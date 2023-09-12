import React, { createContext, useContext, useState, useEffect } from 'react';

import { BASE_URL, onSuccessEvents } from '../constants';

import { integrationsList } from '../integrationsList';

const DEFAAULT_CHUNK_SIZE = 1500;
const DEFAAULT_OVERLAP_SIZE = 20;

const CarbonContext = createContext();

export const CarbonProvider = ({
  children,
  tokenFetcher,
  enabledIntegrations,
  orgName,
  brandIcon,
  environment,
  tags,
  maxFileSize,
  onSuccess,
  onError,
  allowMultipleFiles,
  chunkSize,
  overlapSize,
  maxFileCount,
  tosURL,
  privacyPolicyURL,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isError, setIsError] = useState(false);

  const [accessToken, setAccessToken] = useState(null);
  const [processedIntegrations, setProcessedIntegrations] = useState([]);
  const [whiteLabelingData, setWhiteLabelingData] = useState(null);

  const carbonFetch = async (url, options = {}, retry = true) => {
    try {
      const response = await fetch(url, {
        body: options.body,
        method: options.method,
        headers: options.headers,
      });

      if (response.status === 401 && retry) {
        const response = await tokenFetcher();
        setAccessToken(response.access_token);

        const newOptions = {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Token ${response.access_token}`,
          },
        };

        // Passing 'false' to avoid endless loop in case refreshing the token doesn't help
        return await carbonFetch(url, newOptions, false);
      }

      return response;
    } catch (err) {}
  };

  const fetchTokens = async () => {
    try {
      setLoading(true);
      const response = await tokenFetcher();
      setAccessToken(response.access_token);

      const whiteLabelingResponse = await carbonFetch(
        `${BASE_URL[environment]}/auth/v1/white_labeling`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Token ${response.access_token}`,
          },
        }
      );
      const whiteLabelingResponseData = await whiteLabelingResponse.json();
      setWhiteLabelingData(whiteLabelingResponseData);

      setLoading(false);
    } catch (err) {
      setError(true);
      // console.log('Error: ', err);
    }
  };

  const generateOauthurl = async (service) => {
    try {
      const chunkSizeValue =
        service?.chunkSize || chunkSize || DEFAAULT_CHUNK_SIZE;
      const overlapSizeValue =
        service?.overlapSize || overlapSize || DEFAAULT_OVERLAP_SIZE;
      const skipEmbeddingGeneration = service?.skipEmbeddingGeneration || false;

      const oAuthURLResponse = await carbonFetch(
        `${BASE_URL[environment]}/integrations/oauth_url`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Token ${accessToken}`,
          },
          body: JSON.stringify({
            tags: tags,
            service: service?.data_source_type,
            chunk_size: chunkSizeValue,
            chunk_overlap: overlapSizeValue,
            skip_embedding_generation: skipEmbeddingGeneration,
          }),
        }
      );

      if (oAuthURLResponse.status === 200) {
        onSuccess({
          status: 200,
          data: null,
          integration: service?.data_source_type,
          action: onSuccessEvents.INITIATE,
          event: onSuccessEvents.INITIATE,
        });
        const oAuthURLResponseData = await oAuthURLResponse.json();

        window.open(oAuthURLResponseData.oauth_url, '_blank');
      }
    } catch (err) {}
  };

  const uploadFilesToCarbon = async (
    files,
    chunkSize = null,
    overlapSize = null
  ) => {
    try {
      const filesConfig = processedIntegrations.find(
        (integration) => integration.id === 'LOCAL_FILES'
      );

      if (files.length === 0) {
        setIsError(true);
        setError('Please provide atleast a file to upload');
        return;
      }

      setIsLoading(true);
      const successfulUploads = [];
      const failedUploads = [];

      await Promise.all(
        files.map(async (file, index) => {
          try {
            const formData = new FormData();
            formData.append('file', file);

            const fileType = file.name.split('.').pop();
            const allowedFileTypes = filesConfig.allowedFileTypes
              ? filesConfig.allowedFileTypes.map((config) => config.extension)
              : defaultSupportedFileTypes;

            const fileTypeConfig = allowedFileTypes.find(
              (configuredType) => configuredType === fileType
            );

            if (!fileTypeConfig) {
              failedUploads.push(file.name);
              return;
            }

            const chunkSizeValue =
              chunkSize ||
              fileTypeConfig?.chunkSize ||
              filesConfig?.chunkSize ||
              topLevelChunkSize ||
              defaultChunkSize;

            const overlapSizeValue =
              overlapSize ||
              fileTypeConfig?.overlapSize ||
              filesConfig?.overlapSize ||
              topLevelOverlapSize ||
              defaultOverlapSize;

            const skipEmbeddingGeneration =
              fileTypeConfig?.skipEmbeddingGeneration ||
              filesConfig?.skipEmbeddingGeneration ||
              false;

            const uploadResponse = await carbonFetch(
              `${BASE_URL[environment]}/uploadfile?chunk_size=${chunkSizeValue}&chunk_overlap=${overlapSizeValue}&skip_embedding_generation=${skipEmbeddingGeneration}`,
              {
                method: 'POST',
                body: formData,
                headers: {
                  // 'Content-Type': 'multipart/form-data',
                  Authorization: `Token ${accessToken}`,
                },
              }
            );

            if (uploadResponse.status === 200) {
              const uploadResponseData = await uploadResponse.json();

              const appendTagsResponse = await carbonFetch(
                `${BASE_URL[environment]}/create_user_file_tags`,
                {
                  method: 'POST',
                  body: JSON.stringify({
                    tags: tags,
                    organization_user_file_id: uploadResponseData['id'],
                  }),
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${accessToken}`,
                  },
                }
              );

              if (appendTagsResponse.status === 200) {
                const appendTagsResponseData = await appendTagsResponse.json();
                successfulUploads.push(appendTagsResponseData);
              } else {
                failedUploads.push({
                  fileName: file.name,
                  message: 'Failed to add tags to the file.',
                });
              }
            } else {
              const errorData = await uploadResponse.json(); // Get the error response body

              failedUploads.push({
                fileName: file.name,
                message: errorData.message || 'Failed to upload file.',
              });
            }
          } catch (error) {
            // console.log(error);
          }
        })
      );

      setIsLoading(false);
      const errorObject = null;
      if (failedUploads.length > 0) {
        errorObject = {
          message: 'Failed to upload some files.',
          count: failedUploads.length,
          failedUploads,
        };
      }
      return { successfulUploads, error: errorObject, status: 200 };
    } catch (error) {
      setIsLoading(false);

      return {
        successfulUploads: [],
        error: {
          message: error.message || 'Failed to upload files.',
          count: files.length,
          failedUploads: files.map((file) => file.name),
        },
        status: 400,
      };
    }
  };

  const fetchUserConnections = async () => {
    try {
      const userIntegrationsResponse = await carbonFetch(
        `${BASE_URL[environment]}/integrations/`,
        {
          method: 'GET',
          headers: {
            Authorization: `Token ${accessToken}`,
          },
        }
      );

      if (userIntegrationsResponse.status === 200) {
        const responseBody = await userIntegrationsResponse.json();
        const userConnections = responseBody['active_integrations'];

        return {
          connections: userConnections,
          error: null,
          status: 200,
        };
      }
    } catch (error) {
      return {
        connections: [],
        error: {
          message: error.message || 'Failed to fetch user connections.',
        },
        status: 400,
      };
    }
  };

  const handleFetchSitemapUrls = async (sitemapUrl) => {
    try {
      if (!sitemapUrl) {
        return {
          status: 400,
          data: null,
          error: 'Please provide a valid sitemap URL.',
        };
      }

      setIsLoading(true);
      const response = await carbonFetch(
        `${BASE_URL[environment]}/process_sitemap?url=${sitemapUrl}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Token ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        const responseData = await response.json();
        return {
          status: 200,
          data: {
            urls: responseData.urls,
            count: responseData.urls.length,
          },
          error: null,
        };
      } else {
        return {
          status: 400,
          data: null,
          error: 'Error fetching sitemap. Please try again.',
        };
      }
    } catch (error) {
      return {
        status: 400,
        data: null,
        error: 'Error fetching sitemap. Please try again.',
      };
    }
  };

  const submitScrapeRequest = async (
    urls,
    recursionDepth = 1,
    maxPagesToScrape = 1
  ) => {
    try {
      setIsLoading(true);

      const service = processedIntegrations.find(
        (integration) => integration.id === 'WEB_SCRAPER'
      );

      const chunkSizeValue =
        service?.chunkSize || chunkSize || DEFAAULT_CHUNK_SIZE;
      const overlapSizeValue =
        service?.overlapSize || overlapSize || DEFAAULT_OVERLAP_SIZE;
      const recursionDepthValue =
        recursionDepth || service?.recursionDepth || DEFAULT_RECURSION_DEPTH;
      const maxPagesToScrapeValue =
        maxPagesToScrape ||
        service?.maxPagesToScrape ||
        DEFAULT_MAX_PAGES_TO_SCRAPE;
      const skipEmbeddingGeneration = service?.skipEmbeddingGeneration || false;

      const urlPattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$',
        'i'
      ); // fragment locator

      let validUrls = urls.filter((url) => urlPattern.test(url));

      if (validUrls.length === 0) {
        setIsLoading(false);
        return {
          status: 400,
          data: null,
          error: 'Please provide at least one valid URL.',
        };
      }

      const requestObject = validUrls.map((url) => ({
        url: url,
        tags: tags,
        recursion_depth: recursionDepthValue,
        max_pages_to_scrape: maxPagesToScrapeValue,
        chunk_size: chunkSizeValue,
        chunk_overlap: overlapSizeValue,
        skip_embedding_generation: skipEmbeddingGeneration,
      }));

      const uploadResponse = await carbonFetch(
        `${BASE_URL[environment]}/web_scrape`,
        {
          method: 'POST',
          headers: {
            Authorization: `Token ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestObject),
        }
      );

      if (uploadResponse.status === 200) {
        const responseData = await uploadResponse.json();
        setIsLoading(false);
        return {
          status: 200,
          data: {
            files: responseData.files,
          },
          error: null,
        };
      }
    } catch (error) {
      setIsLoading(false);
      return {
        status: 400,
        data: null,
        error: 'Error initiating scraping. Please try again.',
      };
    }
  };

  useEffect(() => {
    let temp = [];
    for (let i = 0; i < integrationsList.length; i++) {
      const integration = integrationsList[i];
      const integrationOptions = enabledIntegrations.find(
        (enabledIntegration) =>
          enabledIntegration.id === integration.id && integration.active
      );
      if (!integrationOptions) continue;
      temp.push({ ...integrationOptions, ...integration });
    }
    setProcessedIntegrations(temp);
  }, []);

  const contextValues = {
    accessToken, // Access token of the user
    enabledIntegrations, // List of enabled integrations
    orgName, // Name of the organization
    brandIcon, // Brand icon of the organization
    environment, // Environment of the organization
    tags, // Tags to be passed to the API
    maxFileSize, // Max file size allowed
    onSuccess, // Success callback
    onError, // Error callback
    allowMultipleFiles, // Allow multiple files boolean value
    topLevelChunkSize: chunkSize, // Top level chunk size. Default value is 1500
    topLevelOverlapSize: overlapSize, // Top level overlap size. Default value is 20
    processedIntegrations, // Processed integrations list
    defaultChunkSize: 1500, // Default chunk size
    defaultOverlapSize: 20, // Default overlap size
    maxFileCount, // Max file count
    whiteLabelingData, // White labeling data
    tosURL, // Terms of service URL
    privacyPolicyURL, // Privacy policy URL
    isLoading, // Loading state
    error, // Error message
    isError, // Error state

    fetchTokens, // Function to fetch the access token
    carbonFetch, // Function to make a carbon fetch request
    generateOauthurl, //  Function to handle OAuth flow
    uploadFilesToCarbon, // Function to upload files to Carbon
    fetchUserConnections, // Function to fetch user connections
    handleFetchSitemapUrls, // Function to fetch sitemap URLs
    submitScrapeRequest, // Function to submit scraping request
  };

  return (
    <CarbonContext.Provider value={contextValues}>
      {children}
    </CarbonContext.Provider>
  );
};

export const useCarbon = () => {
  const context = useContext(CarbonContext);
  if (context === undefined) {
    throw new Error('useCarbon must be used within an CarbonProvider');
  }
  return context;
};

export default CarbonContext;
