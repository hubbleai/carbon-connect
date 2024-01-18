import React, { createContext, useContext, useState, useEffect } from 'react';

import { BsGoogle, BsCloudUpload, BsDropbox } from 'react-icons/bs';
import { RxNotionLogo } from 'react-icons/rx';
import { CgWebsite } from 'react-icons/cg';
import { FaAws, FaIntercom } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { GrOnedrive } from 'react-icons/gr';
import {
  SiBox,
  SiConfluence,
  SiMicrosoftsharepoint,
  SiZendesk,
} from 'react-icons/si';
import { BASE_URL, onSuccessEvents } from '../constants';
import zoteroLogo from '../zotero.png';

const DEFAAULT_CHUNK_SIZE = 1500;
const DEFAAULT_OVERLAP_SIZE = 20;

const integrationsList = [
  {
    id: 'BOX',
    subpath: 'box',
    name: 'Box',
    description: 'Lets your users connect their Box accounts to Carbon.',
    announcementName: 'to connect Box',
    icon: <SiBox className="cc-w-7 cc-h-7" />,
    active: true,
    data_source_type: 'BOX',
    requiresOAuth: true,
  },
  {
    id: 'CONFLUENCE',
    subpath: 'confluence',
    name: 'Confluence',
    description: 'Lets your users connect their Confluence accounts to Carbon.',
    announcementName: 'to connect Confluence',
    icon: <SiConfluence className="cc-w-7 cc-h-7" />,
    active: true,
    data_source_type: 'CONFLUENCE',
    requiresOAuth: true,
    multiStep: true,
  },
  {
    id: 'DROPBOX',
    subpath: 'dropbox',
    name: 'Dropbox',
    description: 'Lets your users connect their Dropbox accounts to Carbon.',
    announcementName: 'to connect Dropbox',
    icon: <BsDropbox className="cc-w-7 cc-h-7" />,
    active: true,
    data_source_type: 'DROPBOX',
    requiresOAuth: true,
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
  {
    id: 'GMAIL',
    subpath: 'gmail',
    name: 'Gmail',
    description: 'Lets your users connect their Gmail to Carbon.',
    announcementName: 'to connect Gmail',
    icon: <FcGoogle className="cc-w-7 cc-h-7" />,
    active: true,
    data_source_type: 'GMAIL',
    requiresOAuth: true,
    integrationsListViewTitle: 'Connect your Gmail',
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
    integrationsListViewTitle: 'Connect your Google Drive',
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
    icon: <RxNotionLogo className="cc-w-7 cc-h-7" />,
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
    icon: <GrOnedrive className="cc-w-7 cc-h-7" />,
    active: true,
    data_source_type: 'ONEDRIVE',
    requiresOAuth: true,
  },
  {
    id: 'S3',
    subpath: 's3',
    name: 'S3',
    description: 'Lets your users connect their data on S3 to Carbon.',
    announcementName: 'to connect S3',
    icon: <FaAws className="cc-w-7 cc-h-7" />,
    active: true,
    data_source_type: 'S3',
    requiresOAuth: false,
    multiStep: true,
  },
  {
    id: 'SHAREPOINT',
    subpath: 'sharepoint',
    name: 'Sharepoint',
    description: 'Lets your users connect their Sharepoint accounts to Carbon.',
    announcementName: 'to connect Sharepoint',
    icon: <SiMicrosoftsharepoint className="cc-w-7 cc-h-7" />,
    active: true,
    data_source_type: 'SHAREPOINT',
    requiresOAuth: true,
    multiStep: true,
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
    id: 'ZENDESK',
    subpath: 'zendesk',
    name: 'Zendesk',
    description: 'Lets your users connect their Zendesk accounts to Carbon.',
    announcementName: 'to connect Zendesk',
    icon: <SiZendesk className="cc-w-7 cc-h-7" />,
    active: true,
    data_source_type: 'ZENDESK',
    requiresOAuth: true,
    multiStep: true,
  },
  {
    id: 'ZOTERO',
    subpath: 'zotero',
    name: 'Zotero',
    description: 'Lets your users connect their Zotero accounts to Carbon.',
    announcementName: 'to connect Zotero',
    icon: <img src={zoteroLogo} className="cc-w-7 cc-h-7" />, // <SiZotero className="cc-w-7 cc-h-7" />,
    active: true,
    data_source_type: 'ZOTERO',
    requiresOAuth: true,
    multiStep: false,
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
  backButtonText,
  enableToasts,
  zIndex,
  embeddingModel,
  generateSparseVectors,
  prependFilenameToChunks,
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
    } catch (err) {
      console.log(
        `[CarbonContext.js] Error in authenticatedFetch [${url}]: `,
        err
      );
    }
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
      console.log('[CarbonContext.js: 235] Error in fetchTokens: ', err);
    }
  };

  const handleServiceOAuthFlow = async (service) => {
    try {
      const chunkSizeValue =
        service?.chunkSize || chunkSize || DEFAAULT_CHUNK_SIZE;
      const overlapSizeValue =
        service?.overlapSize || overlapSize || DEFAAULT_OVERLAP_SIZE;
      const skipEmbeddingGeneration = service?.skipEmbeddingGeneration || false;
      const embeddingModelValue =
        service?.embeddingModel || embeddingModel || null;
      const generateSparseVectorsValue =
        service?.generateSparseVectors || generateSparseVectors || false;
      const prependFilenameToChunksValue =
        service?.prependFilenameToChunks || prependFilenameToChunks || false;

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
            embedding_model: embeddingModelValue,
            generate_sparse_vectors: generateSparseVectorsValue,
            prepend_filename_to_chunks: prependFilenameToChunksValue,
          }),
        }
      );

      if (oAuthURLResponse.status === 200) {
        // setFlag(service?.data_source_type, true);
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
    } catch (err) {
      console.log(
        '[CarbonContext.js: 351] Error in handleServiceOAuthFlow: ',
        err
      );
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
    open,
    setOpen,
    showModal,
    setShowModal,
    alwaysOpen,
    navigateBackURL,
    manageModalOpenState,
    activeStep,
    setActiveStep,
    backButtonText,
    enableToasts,
    zIndex,
    embeddingModel,
    generateSparseVectors,
    prependFilenameToChunks,
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
