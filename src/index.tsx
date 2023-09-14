import React, { useState } from 'react';
import './index.css';

// @ts-ignore
import IntegrationModal from './components/IntegrationModal';

// @ts-ignore
import { CarbonModalProvider } from './contexts/CarbonModalContext';

// @ts-ignore
import { CarbonProvider, useCarbon } from './contexts/CarbonContext';

import { CarbonConnectProps } from './types';

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
    <CarbonModalProvider
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
    </CarbonModalProvider>
  );
};

export { CarbonConnect, CarbonProvider, useCarbon };
