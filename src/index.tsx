import React, { useState, ReactNode } from 'react';
import './index.css';

// @ts-ignore
import IntegrationModal from './components/IntegrationModal';

// @ts-ignore
import { CarbonProvider } from './contexts/CarbonContext';
import { EmbeddingModel } from 'carbon-connect-js/dist/types';

// Enums
export enum ActionType {
  INITIATE = 'INITIATE',
  ADD = 'ADD',
  UPDATE = 'UPDATE',
  CANCEL = 'CANCEL',
}

export enum FilePickerMode {
  FILES = 'FILES',
  FOLDERS = 'FOLDERS',
  BOTH = 'BOTH',
}

export enum IntegrationName {
  BOX = 'BOX',
  CONFLUENCE = 'CONFLUENCE',
  DROPBOX = 'DROPBOX',
  GOOGLE_DRIVE = 'GOOGLE_DRIVE',
  GMAIL = 'GMAIL',
  INTERCOM = 'INTERCOM',
  LOCAL_FILES = 'LOCAL_FILES',
  NOTION = 'NOTION',
  ONEDRIVE = 'ONEDRIVE',
  S3 = 'S3',
  SHAREPOINT = 'SHAREPOINT',
  WEB_SCRAPER = 'WEB_SCRAPER',
  ZENDESK = 'ZENDESK',
  ZOTERO = 'ZOTERO',
}

export enum SyncStatus {
  READY = 'READY',
  QUEUED_FOR_SYNCING = 'QUEUED_FOR_SYNCING',
  SYNCING = 'SYNCING',
  SYNC_ERROR = 'SYNC_ERROR',
}

export interface FileType {
  extension: string;
  chunkSize?: number;
  overlapSize?: number;
  setPageAsBoundary?: boolean;
  useOcr?: boolean;
  generateSparseVectors?: boolean;
}
export interface BaseIntegration {
  id: IntegrationName;
  chunkSize?: number;
  overlapSize?: number;
  skipEmbeddingGeneration?: boolean;
  embeddingModel?: EmbeddingModel;
  enableAutoSync?: boolean;
  generateSparseVectors?: boolean;
}
export interface LocalFilesIntegration extends BaseIntegration {
  maxFileSize: number;
  allowMultipleFiles: boolean;
  maxFilesCount?: number;
  allowedFileTypes?: FileType[];
  setPageAsBoundary?: boolean;
  filePickerMode?: FilePickerMode;
  useOcr?: boolean;
}

export interface WebScraperIntegration extends BaseIntegration {
  recursionDepth?: number;
  maxPagesToScrape?: number;
}

export type Integration =
  | LocalFilesIntegration
  | WebScraperIntegration
  | BaseIntegration;

export interface LocalFile {
  id: string;
  name: string;
  source: IntegrationName;
  external_file_id: string;
  tags: string[];
  sync_status: SyncStatus;
}

export interface WebScraper {
  urls: string[];
  validUrls: string[];
  tags: string[];
}

export interface OnSuccessDataFileObject {
  id: string;
  source: IntegrationName;
  organization_id: string;
  organization_supplied_user_id: string;
  organization_user_data_source_id: string;
  external_file_id: string;
  external_url: string;
  sync_status: SyncStatus;
  last_sync: string;
  tags: Record<string, TagValue> | null;
  // TODO: Need a more detailed type
  file_statistics: object;
  // TODO: Need a more detailed type
  file_metadata: object;
  chunk_size: number;
  chunk_overlap: number;
  name: string;
  enable_auto_sync: boolean;
  presigned_url: string;
  parsed_text_url: string;
  skip_embedding_generation: boolean;
  created_at: string;
  updated_at: string;
  action: ActionType;
}

// Callback data types
export interface OnSuccessData {
  status: number;
  data: {
    data_source_external_id: string | null;
    sync_status: string | null;
    files: LocalFile[] | WebScraper[] | OnSuccessDataFileObject[] | null;
  } | null;
  action: ActionType;
  event: ActionType;
  integration: IntegrationName;
}

export interface OnErrorData {
  status: number;
  action: ActionType;
  event: ActionType;
  integration: IntegrationName;
  // TODO: Need a more detailed type
  data?: object;
}

export type TagValue = string | number | string[] | number[];

export interface CarbonConnectProps {
  orgName: string;
  brandIcon: string;
  children?: ReactNode;
  tokenFetcher?: () => Promise<{ access_token: string }>;
  onSuccess?: (data: OnSuccessData) => void;
  onError?: (data: OnErrorData) => void;
  tags?: Record<string, TagValue>;
  maxFileSize?: number;
  environment?: string;
  entryPoint?: string | null;
  enabledIntegrations?: Integration[];
  primaryBackgroundColor?: string;
  primaryTextColor?: string;
  secondaryBackgroundColor?: string;
  secondaryTextColor?: string;
  allowMultipleFiles?: boolean;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>> | null;
  chunkSize?: number;
  overlapSize?: number;
  tosURL?: string;
  privacyPolicyURL?: string;
  alwaysOpen?: boolean;
  navigateBackURL?: string | null;
  backButtonText?: string;
  zIndex?: number;
  enableToasts?: boolean;
  embeddingModel?: EmbeddingModel;
  generateSparseVectors?: boolean;
}

const CarbonConnect: React.FC<CarbonConnectProps> = ({
  orgName,
  brandIcon,
  children,
  tokenFetcher = () => {},
  onSuccess = () => {},
  onError = () => {},
  tags = [],
  maxFileSize = 20000000,
  environment = 'PRODUCTION',
  entryPoint = null,
  enabledIntegrations = [
    {
      id: 'LOCAL_FILES',
      chunkSize: 100,
      overlapSize: 10,
      maxFileSize: 20000000,
      allowMultipleFiles: true,
      skipEmbeddingGeneration: false,
      setPageAsBoundary: false,
      filePickerMode: 'FILES',
      allowedFileTypes: [
        {
          extension: 'csv',
        },
        {
          extension: 'txt',
        },
        {
          extension: 'pdf',
        },
      ],
    },
  ],
  primaryBackgroundColor = '#000000',
  primaryTextColor = '#FFFFFF',
  secondaryBackgroundColor = '#FFFFFF',
  secondaryTextColor = '#000000',
  allowMultipleFiles = false,
  open = false,
  setOpen = null,
  chunkSize = 1500,
  overlapSize = 20,
  tosURL = 'https://carbon.ai/terms',
  privacyPolicyURL = 'https://carbon.ai/privacy',
  alwaysOpen = false,
  navigateBackURL = null,
  backButtonText = 'Go Back',
  zIndex = 1000,
  enableToasts = true,
  embeddingModel = 'OPENAI',
}) => {
  const [activeStep, setActiveStep] = useState<string | number>(
    entryPoint === 'LOCAL_FILES' || entryPoint === 'WEB_SCRAPER'
      ? entryPoint
      : 0
  );

  return (
    <CarbonProvider
      tokenFetcher={tokenFetcher}
      enabledIntegrations={enabledIntegrations}
      orgName={orgName}
      brandIcon={brandIcon}
      environment={environment}
      entryPoint={entryPoint}
      tags={tags}
      maxFileSize={maxFileSize}
      onSuccess={onSuccess}
      onError={onError}
      primaryBackgroundColor={primaryBackgroundColor}
      primaryTextColor={primaryTextColor}
      secondaryBackgroundColor={secondaryBackgroundColor}
      secondaryTextColor={secondaryTextColor}
      allowMultipleFiles={allowMultipleFiles}
      chunkSize={chunkSize}
      overlapSize={overlapSize}
      tosURL={tosURL}
      privacyPolicyURL={privacyPolicyURL}
      open={open}
      setOpen={setOpen}
      alwaysOpen={alwaysOpen}
      navigateBackURL={navigateBackURL}
      activeStep={activeStep}
      setActiveStep={setActiveStep}
      backButtonText={backButtonText}
      enableToasts={enableToasts}
      zIndex={zIndex}
      embeddingModel={embeddingModel}
    >
      <IntegrationModal>{children}</IntegrationModal>
    </CarbonProvider>
  );
};

export { CarbonConnect };
