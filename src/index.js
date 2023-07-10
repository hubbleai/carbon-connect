import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import './index.css';

import { HiCheckCircle, HiPlus, HiTrash, HiX, HiXCircle } from 'react-icons/hi';
import CarbonAnnouncement from './components/CarbonAnnouncement';
import ThirdPartyList from './components/ThirdPartyList';
import GoogleDocsSelector from './components/GoogleDocsSelector';
import FileUpload from './components/FileUpload';
import { ToastContainer, toast } from 'react-toastify';

import { BASE_URL } from './constants';
import { AuthProvider, useCarbonAuth } from './contexts/AuthContext';
import WebScraper from './components/WebScraper';

const IntegrationModal = ({
  orgName,
  brandIcon,
  maxFileSize,
  children,
  enabledIntegrations,
  onSuccess,
  onError,
  primaryBackgroundColor,
  primaryTextColor,
  secondaryBackgroundColor,
  secondaryTextColor,
  tags = {},
  environment = 'PRODUCTION',
  entryPoint = null,
}) => {
  const [activeStep, setActiveStep] = useState(entryPoint || 0);
  const [activeIntegrations, setActiveIntegrations] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const { accessToken, fetchTokens } = useCarbonAuth();

  const fetchUserIntegrationsHelper = async () => {
    const userIntegrationsResponse = await fetch(
      `${BASE_URL[environment]}/integrations/`,
      {
        headers: {
          Authorization: `Token ${accessToken}`,
        },
      }
    );

    if (userIntegrationsResponse.status === 200) {
      const responseBody = await userIntegrationsResponse.json();
      setActiveIntegrations(responseBody['active_integrations']);
    }
  };

  const fetchUserIntegrations = async () => {
    try {
      await fetchUserIntegrationsHelper();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        await fetchTokens();
        setTimeout(async () => {
          await fetchUserIntegrationsHelper();
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (accessToken && showModal) {
      fetchUserIntegrations();
      // Then set up the interval to call it every 10 seconds
      const intervalId = setInterval(fetchUserIntegrations, 10000); // 10000 ms = 10 s
      // Make sure to clear the interval when the component unmounts
      return () => clearInterval(intervalId);
    }
  }, [accessToken, showModal]);

  return (
    <Dialog.Root
      onOpenChange={(open) => {
        if (!open) setActiveStep(entryPoint || 0);
        setShowModal(open);
      }}
      open={showModal}
    >
      <Dialog.Trigger asChild>
        {children ? (
          <div onClick={fetchTokens}>{children}</div>
        ) : (
          <HiPlus
            className="cc-w-6 cc-h-6 hover:cc-bg-gray-300 cc-rounded-md cc-p-1 cc-mr-5 cc-cursor-pointer"
            onClick={fetchTokens}
          />
        )}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="cc-bg-blackA9 data-[state=open]:cc-animate-overlayShow cc-fixed cc-inset-0 cc-bg-black/30" />
        <Dialog.Content className="cc-flex cc-flex-col data-[state=open]:cc-animate-contentShow cc-fixed cc-top-[50%] cc-left-[50%] cc-h-[600px] cc-w-[375px] cc-translate-x-[-50%] cc-translate-y-[-50%] cc-rounded-[6px] cc-bg-white cc-p-[25px] focus:cc-outline-none">
          {activeStep === 0 && (
            <CarbonAnnouncement
              setActiveStep={setActiveStep}
              orgName={orgName}
              brandIcon={brandIcon}
              primaryBackgroundColor={primaryBackgroundColor}
              primaryTextColor={primaryTextColor}
              secondaryBackgroundColor={secondaryBackgroundColor}
              secondaryTextColor={secondaryTextColor}
            />
          )}
          {activeStep === 1 && (
            <ThirdPartyList
              setActiveStep={setActiveStep}
              activeIntegrations={activeIntegrations}
              environment={environment}
              enabledIntegrations={enabledIntegrations}
              tags={tags}
              primaryBackgroundColor={primaryBackgroundColor}
              primaryTextColor={primaryTextColor}
              secondaryBackgroundColor={secondaryBackgroundColor}
              secondaryTextColor={secondaryTextColor}
            />
          )}

          {/* {activeStep === 'GOOGLE_DOCS' && (
            <GoogleDocsSelector
              integrationData={activeIntegrations.find(
                (i) => i.data_source_type === 'GOOGLE_DOCS'
              )}
              setActiveStep={setActiveStep}
              entryPoint={entryPoint}
              environment={environment}
              primaryBackgroundColor={primaryBackgroundColor}
              primaryTextColor={primaryTextColor}
              secondaryBackgroundColor={secondaryBackgroundColor}
              secondaryTextColor={secondaryTextColor}
            />
          )} */}
          {activeStep === 'LOCAL_FILES' && (
            <FileUpload
              setActiveStep={setActiveStep}
              entryPoint={entryPoint}
              environment={environment}
              tags={tags}
              maxFileSize={maxFileSize}
              onSuccess={onSuccess}
              onError={onError}
              primaryBackgroundColor={primaryBackgroundColor}
              primaryTextColor={primaryTextColor}
              secondaryBackgroundColor={secondaryBackgroundColor}
              secondaryTextColor={secondaryTextColor}
            />
          )}

          {activeStep === 'WEB_SCRAPER' && (
            <WebScraper
              setActiveStep={setActiveStep}
              entryPoint={entryPoint}
              environment={environment}
              tags={tags}
              maxFileSize={maxFileSize}
              onSuccess={onSuccess}
              onError={onError}
              primaryBackgroundColor={primaryBackgroundColor}
              primaryTextColor={primaryTextColor}
              secondaryBackgroundColor={secondaryBackgroundColor}
              secondaryTextColor={secondaryTextColor}
            />
          )}
        </Dialog.Content>

        <ToastContainer
          position="bottom-right"
          pauseOnFocusLoss={false}
          pauseOnHover={false}
        />
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const CarbonConnect = ({
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
  enabledIntegrations = ['LOCAL_FILES'],
  primaryBackgroundColor = '#000000',
  primaryTextColor = '#FFFFFF',
  secondaryBackgroundColor = '#FFFFFF',
  secondaryTextColor = '#000000',
}) => {
  return (
    <AuthProvider tokenFetcher={tokenFetcher}>
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
      >
        {children}
      </IntegrationModal>
    </AuthProvider>
  );
};

export { CarbonConnect };
