import React, { ReactNode } from 'react';
import './index.css';
declare enum ActionType {
    INITIATE = "INITIATE",
    ADD = "ADD",
    UPDATE = "UPDATE",
    CANCEL = "CANCEL"
}
declare enum IntegrationName {
    LOCAL_FILES = "LOCAL_FILES",
    NOTION = "NOTION",
    WEB_SCRAPER = "WEB_SCRAPER",
    GOOGLE_DRIVE = "GOOGLE_DRIVE",
    INTERCOM = "INTERCOM",
    DROPBOX = "DROPBOX",
    ONEDRIVE = "ONEDRIVE"
}
declare enum SyncStatus {
    READY = "READY",
    QUEUED_FOR_SYNCING = "QUEUED_FOR_SYNCING",
    SYNCING = "SYNCING",
    SYNC_ERROR = "SYNC_ERROR"
}
interface FileType {
    extension: string;
    chunkSize?: number;
    overlapSize?: number;
}
interface BaseIntegration {
    id: IntegrationName;
    chunkSize?: number;
    overlapSize?: number;
}
interface LocalFilesIntegration extends BaseIntegration {
    maxFileSize: number;
    allowMultipleFiles: boolean;
    maxFilesCount?: number;
    allowedFileTypes?: FileType[];
}
interface WebScraperIntegration extends BaseIntegration {
    recursionDepth?: number;
    maxPagesToScrape?: number;
}
type Integration = LocalFilesIntegration | WebScraperIntegration | BaseIntegration;
interface LocalFile {
    id: string;
    name: string;
    source: IntegrationName;
    external_file_id: string;
    tags: string[];
    sync_status: SyncStatus;
}
interface WebScraper {
    urls: string[];
    validUrls: string[];
    tags: string[];
}
interface ThirdPartyIntegrationFile {
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
    file_statistics: object;
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
interface OnSuccessData {
    status: number;
    data: LocalFile[] | WebScraper[] | ThirdPartyIntegrationFile[] | null;
    action: ActionType;
    event: ActionType;
    integration: IntegrationName;
}
interface OnErrorData {
    status: number;
    action: ActionType;
    event: ActionType;
    integration: IntegrationName;
    data?: object;
}
type TagValue = string | number | string[] | number[];
interface CarbonConnectProps {
    orgName: string;
    brandIcon: string;
    children?: ReactNode;
    tokenFetcher: () => Promise<{
        access_token: string;
    }>;
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
}
declare const CarbonConnect: React.FC<CarbonConnectProps>;
export { CarbonConnect };
