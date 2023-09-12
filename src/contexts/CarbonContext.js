import React, { createContext, useContext, useState, useEffect } from 'react';

import { BsCloudUpload, BsDropbox } from 'react-icons/bs';
import { RxNotionLogo } from 'react-icons/rx';
import { CgWebsite } from 'react-icons/cg';
import { FaIntercom } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { GrOnedrive } from 'react-icons/gr';
import { SiBox } from 'react-icons/si';
import { BASE_URL, onSuccessEvents } from '../constants';

const DEFAAULT_CHUNK_SIZE = 1500;
const DEFAAULT_OVERLAP_SIZE = 20;

const integrationsList = [
  {
    id: 'BOX',
    subpath: 'box',
    name: 'Box',
    description: 'Lets your users connect their Box accounts to Carbon.',
    announcementName: 'to connect Box',
    icon: <SiBox className="cc-w-8 cc-h-8" />,
    active: true,
    data_source_type: 'BOX',
    requiresOAuth: true,
  },
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
  {
    id: 'GOOGLE_DRIVE',
    subpath: 'google',
    name: 'Google Drive',
    description: 'Lets your users connect their Google Drive to Carbon.',
    announcementName: 'to connect Google Drive',
    icon: <FcGoogle className="cc-w-7 cc-h-7" />,
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
    id: 'ONEDRIVE',
    subpath: 'onedrive',
    name: 'OneDrive',
    description: 'Lets your users connect their OneDrive accounts to Carbon.',
    announcementName: 'to connect OneDrive',
    icon: <GrOnedrive className="cc-w-8 cc-h-8" />,
    active: true,
    data_source_type: 'ONEDRIVE',
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
  open,
  setOpen,
  alwaysOpen,
  navigateBackURL,
  activeStep,
  setActiveStep,
}) => {
  const [showModal, setShowModal] = useState(open);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [accessToken, setAccessToken] = useState(null);
  const [processedIntegrations, setProcessedIntegrations] = useState([]);
  const [entryPointIntegrationObject, setEntryPointIntegrationObject] =
    useState(null);
  const [whiteLabelingData, setWhiteLabelingData] = useState(null);

  const manageModalOpenState = (modalOpenState) => {
    if (alwaysOpen) return;
    if (!modalOpenState) {
      if (entryPoint === 'LOCAL_FILES' || entryPoint === 'WEB_SCRAPER')
        setActiveStep(entryPoint);
      else setActiveStep(0);
    }
    if (setOpen) setOpen(modalOpenState);
    setShowModal(modalOpenState);
  };

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

  useEffect(() => {
    setShowModal(open);
  }, [open]);

  const contextValues = {
    accessToken, // Access token of the user
    fetchTokens, // Function to fetch the access token
    carbonFetch, // Function to make a carbon fetch request
    enabledIntegrations, // List of enabled integrations
    orgName, // Name of the organization
    brandIcon, // Brand icon of the organization
    environment, // Environment of the organization
    entryPoint, // Entry point of the modal
    tags, // Tags to be passed to the API
    maxFileSize, // Max file size allowed
    onSuccess, // Success callback
    onError, // Error callback
    primaryBackgroundColor, // Primary background color
    primaryTextColor, // Primary text color
    secondaryBackgroundColor, //  Secondary background color
    secondaryTextColor, // Secondary text color
    allowMultipleFiles, // Allow multiple files boolean value
    topLevelChunkSize: chunkSize, // Top level chunk size. Default value is 1500
    topLevelOverlapSize: overlapSize, // Top level overlap size. Default value is 20
    processedIntegrations, // Processed integrations list
    entryPointIntegrationObject, // Entry point integration object
    defaultChunkSize: 1500, // Default chunk size
    defaultOverlapSize: 20, // Default overlap size
    maxFileCount, // Max file count
    handleServiceOAuthFlow, //  Function to handle OAuth flow
    whiteLabelingData, // White labeling data
    tosURL, // Terms of service URL
    privacyPolicyURL, // Privacy policy URL
    open, // Open state of the modal
    // setOpen,
    showModal, // Show modal state
    setShowModal, // Set show modal state
    alwaysOpen, // Always open state
    navigateBackURL, // Navigate back URL
    manageModalOpenState, // Function to manage modal open state
    activeStep, // Active step
    setActiveStep, // Set active step
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
