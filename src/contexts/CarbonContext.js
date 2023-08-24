import React, { createContext, useContext, useState, useEffect } from 'react';

import { BsGoogle, BsCloudUpload, BsDropbox } from 'react-icons/bs';
import { RxNotionLogo } from 'react-icons/rx';
import { CgWebsite } from 'react-icons/cg';
import { FaIntercom } from 'react-icons/fa';
import { BASE_URL } from '../constants';

const DEFAAULT_CHUNK_SIZE = 1500;
const DEFAAULT_OVERLAP_SIZE = 20;

const integrationsList = [
  {
    id: 'DROPBOX',
    subpath: 'dropbox',
    name: 'Dropbox',
    description: 'Lets your users connect their Dropbox accounts to Carbon.',
    announcementName: 'to connect Dropbox',
    icon: <BsDropbox className="cc-w-8 cc-h-8" />,
    active: true,
    data_source_type: 'DROPBOX',
    requiresOAuth: true,
  },
  // {
  //   id: 'GOOGLE_DOCS',
  //   subpath: 'google',
  //   name: 'Google Docs',
  //   description: 'Lets your users connect their Google Docs to Carbon.',
  //   announcementName: 'to connect Google Docs',
  //   icon: <BsGoogle className="cc-w-7 cc-h-7" />,
  //   active: true,
  //   data_source_type: 'GOOGLE_DOCS',
  //   requiresOAuth: true,
  //   scope: 'docs',
  // },
  {
    id: 'GOOGLE_DRIVE',
    subpath: 'google',
    name: 'Google Drive',
    description: 'Lets your users connect their Google Drive to Carbon.',
    announcementName: 'to connect Google Drive',
    icon: <BsGoogle className="cc-w-7 cc-h-7" />,
    active: true,
    data_source_type: 'GOOGLE_DRIVE',
    requiresOAuth: true,
  },
  {
    id: 'INTERCOM',
    subpath: 'intercom',
    name: 'Intercom',
    description: 'Lets your users connect their Intercom to Carbon.',
    announcementName: 'to connect Intercom',
    icon: <FaIntercom className="cc-w-7 cc-h-7" />,
    active: true,
    data_source_type: 'INTERCOM',
    requiresOAuth: true,
  },
  {
    id: 'NOTION',
    subpath: 'notion',
    name: 'Notion',
    description: 'Lets your users connect their Notion accounts to Carbon.',
    announcementName: 'to connect Notion',
    icon: <RxNotionLogo className="cc-w-8 cc-h-8" />,
    active: true,
    data_source_type: 'NOTION',
    requiresOAuth: true,
  },
  {
    id: 'WEB_SCRAPER',
    subpath: 'scraper',
    name: 'Web Scraper',
    description: 'Lets your users Scrape websites to Carbon.',
    announcementName: 'for Web Scraping',
    icon: <CgWebsite className="cc-w-7 cc-h-7" />,
    active: true,
    data_source_type: 'WEB_SCRAPER',
    requiresOAuth: false,
  },
  {
    id: 'LOCAL_FILES',
    subpath: 'local',
    name: 'File Upload',
    description: 'Lets your users upload local files to Carbon.',
    announcementName: 'to upload local files',
    icon: <BsCloudUpload className="cc-w-7 cc-h-7" />,
    active: true,
    data_source_type: 'LOCAL_FILES',
    requiresOAuth: false,
  },
];

const CarbonContext = createContext();

export const CarbonProvider = ({
  children,
  tokenFetcher,
  enabledIntegrations,
  orgName,
  brandIcon,
  environment,
  entryPoint,
  tags,
  maxFileSize,
  onSuccess,
  onError,
  primaryBackgroundColor,
  primaryTextColor,
  secondaryBackgroundColor,
  secondaryTextColor,
  allowMultipleFiles,
  chunkSize,
  overlapSize,
  maxFileCount,
  tosURL,
  privacyPolicyURL,
}) => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [processedIntegrations, setProcessedIntegrations] = useState([]);
  const [entryPointIntegrationObject, setEntryPointIntegrationObject] =
    useState(null);
  const [whiteLabelingData, setWhiteLabelingData] = useState(null);

  const authenticatedFetch = async (url, options = {}, retry = true) => {
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

        return await authenticatedFetch(url, newOptions, false); // Passing 'false' to avoid endless loop in case refreshing the token doesn't help
      }

      return response;
    } catch (err) {}
  };

  const fetchTokens = async () => {
    try {
      setLoading(true);
      const response = await tokenFetcher();
      setAccessToken(response.access_token);

      const whiteLabelingResponse = await authenticatedFetch(
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
      const oAuthURLResponse = await authenticatedFetch(
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

    if (entryPoint) {
      const obj = temp.find((integration) => integration.id === entryPoint);
      if (!obj) {
        const isIntegrationAvailable = integrationsList.find(
          (integration) => integration.id === entryPoint
        );
        if (isIntegrationAvailable)
          console.error(
            'Invalid entry point. Make sure that the integrations is enabled through enabledIntegrations prop.'
          );
        else
          console.error(
            'Invalid entry point. Make sure that right integration id is passed.'
          );
      }

      setEntryPointIntegrationObject(obj);
    }
  }, []);

  useEffect(() => {}, [processedIntegrations]);

  const contextValues = {
    accessToken,
    setAccessToken,
    fetchTokens,
    authenticatedFetch,
    enabledIntegrations,
    orgName,
    brandIcon,
    environment,
    entryPoint,
    tags,
    maxFileSize,
    onSuccess,
    onError,
    primaryBackgroundColor,
    primaryTextColor,
    secondaryBackgroundColor,
    secondaryTextColor,
    allowMultipleFiles,
    topLevelChunkSize: chunkSize,
    topLevelOverlapSize: overlapSize,
    processedIntegrations,
    entryPointIntegrationObject,
    defaultChunkSize: 1500,
    defaultOverlapSize: 20,
    maxFileCount,
    handleServiceOAuthFlow,
    whiteLabelingData,
    tosURL,
    privacyPolicyURL,
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
