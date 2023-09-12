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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

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

  const handleServiceOAuthFlow = async (service) => {
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
    fetchTokens, // Function to fetch the access token
    carbonFetch, // Function to make a carbon fetch request
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
    handleServiceOAuthFlow, //  Function to handle OAuth flow
    whiteLabelingData, // White labeling data
    tosURL, // Terms of service URL
    privacyPolicyURL, // Privacy policy URL
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
