import React, { useState, ReactNode } from 'react';
import './index.css';

// @ts-ignore
import IntegrationModal from './components/IntegrationModal';

// @ts-ignore
import { CarbonProvider } from './contexts/CarbonContext';

interface FileType {
  extension: string;
}

interface Integration {
  id: string;
  chunkSize: number;
  overlapSize: number;
  maxFileSize: number;
  allowMultipleFiles: boolean;
  skipEmbeddingGeneration: boolean;
  allowedFileTypes: FileType[];
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
    >
      <IntegrationModal
        orgName={orgName}
        brandIcon={brandIcon}
        environment={environment}
        entryPoint={entryPoint}
        tags={tags}
        maxFileSize={maxFileSize}
        enabledIntegrations={enabledIntegrations}
        onSuccess={onSuccess}
        onError={onError}
        primaryBackgroundColor={primaryBackgroundColor}
        primaryTextColor={primaryTextColor}
        secondaryBackgroundColor={secondaryBackgroundColor}
        secondaryTextColor={secondaryTextColor}
        allowMultipleFiles={allowMultipleFiles}
        open={open}
        setOpen={setOpen}
        alwaysOpen={alwaysOpen}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
      >
        {children}
      </IntegrationModal>
    </CarbonProvider>
  );
};

export { CarbonConnect };
