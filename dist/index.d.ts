import React, { ReactNode } from 'react';
import './index.css';
interface FileType {
  extension: string;
}
interface Integration {
  id: string;
  chunkSize?: number;
  overlapSize?: number;
  maxFileSize?: number;
  allowMultipleFiles?: boolean;
  skipEmbeddingGeneration?: boolean;
  allowedFileTypes?: FileType[];
}
interface CarbonConnectProps {
  orgName: string;
  brandIcon: string;
  children?: ReactNode;
  tokenFetcher?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
  tags?: string[];
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
