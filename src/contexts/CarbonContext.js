import React, { createContext, useContext, useState, useEffect } from 'react';

import { BASE_URL, onSuccessEvents } from '../constants';

import BoxLogo from '../logos/box.svg';
import ConfluenceLogo from '../logos/confluence.svg';
import DropboxLogo from '../logos/dropbox.svg';
import FreshdeskLogo from '../logos/freshdesk.svg';
import GmailLogo from '../logos/gmail.svg';
import GoogleDriveLogo from '../logos/google_drive.svg';
import IntercomLogo from '../logos/intercom.svg';
import NotionLogo from '../logos/notion.svg';
import OneDriveLogo from '../logos/onedrive.svg';
import OutlookLogo from '../logos/outlook.svg';
import S3Logo from '../logos/s3.svg';
import SharePointLogo from '../logos/sharepoint.svg';
import FileUploadIcon from '../logos/file_upload.svg';
import WebScraperIcon from '../logos/web_scraper.svg';
// import SlackLogo from '../logos/slack.svg';
import ZendeskLogo from '../logos/zendesk.svg';
import ZoteroLogo from '../logos/zotero.svg';

const DEFAAULT_CHUNK_SIZE = 1500;
const DEFAAULT_OVERLAP_SIZE = 20;

const integrationsList = [
  {
    id: 'BOX',
    subpath: 'box',
    name: 'Box',
    description: 'Lets your users connect their Box accounts to Carbon.',
    announcementName: 'to connect Box',
    icon: <img src={BoxLogo} className="cc-w-7 cc-h-7" />,
    logo: BoxLogo,
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
    icon: <img src={ConfluenceLogo} className="cc-w-7 cc-h-7" />,
    logo: ConfluenceLogo,
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
    icon: <img src={DropboxLogo} className="cc-w-7 cc-h-7" />,
    logo: DropboxLogo,
    active: true,
    data_source_type: 'DROPBOX',
    requiresOAuth: true,
  },
  {
    id: 'FRESHDESK',
    subpath: 'freshdesk',
    name: 'Freshdesk',
    description: 'Lets your users connect their Freshdesk accounts to Carbon.',
    announcementName: 'to connect Freshdesk',
    icon: <img src={FreshdeskLogo} className="cc-w-7 cc-h-7" />,
    logo: FreshdeskLogo,
    active: true,
    data_source_type: 'FRESHDESK',
    requiresOAuth: true,
    multiStep: true,
  },
  {
    id: 'LOCAL_FILES',
    subpath: 'local',
    name: 'File Upload',
    description: 'Lets your users upload local files to Carbon.',
    announcementName: 'to upload local files',
    icon: <img src={FileUploadIcon} className="cc-w-7 cc-h-7" />,
    logo: FileUploadIcon,
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
    icon: <img src={GmailLogo} className="cc-w-7 cc-h-7" />,
    logo: GmailLogo,
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
    icon: <img src={GoogleDriveLogo} className="cc-w-7 cc-h-7" />,
    logo: GoogleDriveLogo,
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
    icon: <img src={IntercomLogo} className="cc-w-7 cc-h-7" />,
    logo: IntercomLogo,
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
    icon: <img src={NotionLogo} className="cc-w-7 cc-h-7" />,
    logo: NotionLogo,
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
    icon: <img src={OneDriveLogo} className="cc-w-7 cc-h-7" />,
    logo: OneDriveLogo,
    active: true,
    data_source_type: 'ONEDRIVE',
    requiresOAuth: true,
  },
  {
    id: 'OUTLOOK',
    subpath: 'outlook',
    name: 'Outlook',
    description: 'Lets your users connect their Outlook accounts to Carbon.',
    announcementName: 'to connect Outlook',
    icon: <img src={OutlookLogo} className="cc-w-7 cc-h-7" />,
    logo: OutlookLogo,
    active: true,
    data_source_type: 'OUTLOOK',
    requiresOAuth: true,
  },
  {
    id: 'S3',
    subpath: 's3',
    name: 'S3',
    description: 'Lets your users connect their data on S3 to Carbon.',
    announcementName: 'to connect S3',
    icon: <img src={S3Logo} className="cc-w-7 cc-h-7" />,
    logo: S3Logo,
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
    icon: <img src={SharePointLogo} className="cc-w-7 cc-h-7" />,
    logo: SharePointLogo,
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
    icon: <img src={WebScraperIcon} className="cc-w-7 cc-h-7" />,
    logo: WebScraperIcon,
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
    icon: <img src={ZendeskLogo} className="cc-w-7 cc-h-7" />,
    logo: ZendeskLogo,
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
    icon: <img src={ZoteroLogo} className="cc-w-7 cc-h-7" />,
    logo: ZoteroLogo,
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
  maxItemsPerChunk
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
      const oauthWindow = window.open('', '_blank');
      oauthWindow.document.write('Loading...');
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
      const maxItemsPerChunkValue =
        service?.maxItemsPerChunk || maxItemsPerChunk || false;

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
            ...(maxItemsPerChunkValue && { max_items_per_chunk: maxItemsPerChunkValue })
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

        oauthWindow.location.href = oAuthURLResponseData.oauth_url;

        // window.open(oAuthURLResponseData.oauth_url, '_blank');
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
    maxItemsPerChunk
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
