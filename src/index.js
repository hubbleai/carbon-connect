import React, { useState, useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import './index.css';

import { HiCheckCircle, HiPlus, HiTrash, HiX, HiXCircle } from 'react-icons/hi';
import CarbonAnnouncement from './components/CarbonAnnouncement';
import ThirdPartyList from './components/ThirdPartyList';
import GoogleDocsSelector from './components/GoogleDocsSelector';
import FileUpload from './components/FileUpload';
import { ToastContainer, toast } from 'react-toastify';

import { BASE_URL } from './constants';
import { CarbonProvider, useCarbon } from './contexts/CarbonContext';
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
  allowMultipleFiles,
  tags = {},
  environment = 'PRODUCTION',
  entryPoint = null,
  open,
  setOpen,
  alwaysOpen,
}) => {
  const [activeStep, setActiveStep] = useState(
    entryPoint === 'LOCAL_FILES' || entryPoint === 'WEB_SCRAPER'
      ? entryPoint
      : 0
  );
  const [showModal, setShowModal] = useState(open);
  const [activeIntegrations, setActiveIntegrations] = useState([]);

  const activeIntegrationsRef = useRef(activeIntegrations);
  const firstFetchCompletedRef = useRef(false);

  const { accessToken, fetchTokens, authenticatedFetch } = useCarbon();

  const findModifications = (newIntegrations, oldIntegrations) => {
    const response = [];
    try {
      for (let i = 0; i < newIntegrations.length; i++) {
        const newIntegration = newIntegrations[i];
        const oldIntegration = oldIntegrations.find(
          (oldIntegration) => oldIntegration.id === newIntegration.id
        );

        if (!oldIntegration) {
          const onSuccessObject = {
            status: 200,
            integration: newIntegration.data_source_type,
            data_source_external_id: newIntegration.data_source_external_id,
            action: 'ADD',
            data: newIntegration?.synced_files || [],
          };

          response.push(onSuccessObject);
          continue;
        }

        const newFiles =
          newIntegration?.synced_files || newIntegration.files || [];
        const oldFiles =
          oldIntegration?.synced_files || oldIntegration.files || [];

        const newIds = newFiles?.map((item) => item.id);
        const oldIds = oldFiles?.map((item) => item.id);

        const newAdditions =
          newIds?.filter((item) => !oldIds.includes(item)) || [];
        const newDeletions =
          oldIds?.filter((item) => !newIds.includes(item)) || [];

        if (newAdditions.length > 0) {
          const onSuccessObject = {
            status: 200,
            integration: newIntegration.data_source_type,
            data_source_external_id: newIntegration.data_source_external_id,
            action: 'UPDATE',
            data: newFiles.filter((item) => newAdditions.includes(item.id)),
          };

          response.push(onSuccessObject);
        }
      }

      return response;
    } catch (error) {
      // console.log(error);
    }
  };

  const fetchUserIntegrationsHelper = async () => {
    try {
      const userIntegrationsResponse = await authenticatedFetch(
        `${BASE_URL[environment]}/integrations/`,
        {
          method: 'GET',
          headers: {
            Authorization: `Token ${accessToken}`,
          },
        }
      );

      if (userIntegrationsResponse.status === 200) {
        const responseBody = await userIntegrationsResponse.json();
        if (firstFetchCompletedRef.current) {
          const integrationModifications = findModifications(
            responseBody['active_integrations'],
            activeIntegrationsRef.current
          );

          if (integrationModifications.length > 0) {
            for (let i = 0; i < integrationModifications.length; i++) {
              onSuccess(integrationModifications[i]);
            }
          }
        } else {
          firstFetchCompletedRef.current = true;
        }
        activeIntegrationsRef.current = responseBody['active_integrations'];
        setActiveIntegrations(responseBody['active_integrations']);
        return;
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    setShowModal(open);
  }, [open]);

  useEffect(() => {
    activeIntegrationsRef.current = activeIntegrations;
  }, [activeIntegrations]);

  const fetchUserIntegrations = async () => {
    try {
      await fetchUserIntegrationsHelper();
    } catch (error) {}
  };

  useEffect(() => {
    if (accessToken && showModal) {
      fetchUserIntegrations();
      // Then set up the interval to call it every 10 seconds
      const intervalId = setInterval(fetchUserIntegrations, 5000); // 5000 ms = 5 s
      // Make sure to clear the interval when the component unmounts
      return () => clearInterval(intervalId);
    }
  }, [accessToken, showModal]);

  useEffect(() => {
    if (!accessToken) {
      fetchTokens();
    }
  }, [accessToken]);

  return (
    <Dialog.Root
      onOpenChange={(modalOpenState) => {
        if (alwaysOpen) return;
        if (!modalOpenState) {
          if (entryPoint === 'LOCAL_FILES' || entryPoint === 'WEB_SCRAPER')
            setActiveStep(entryPoint);
          else setActiveStep(0);
        }
        if (setOpen) setOpen(modalOpenState);
        setShowModal(modalOpenState);
      }}
      open={alwaysOpen ? true : showModal}
    >
      <Dialog.Trigger asChild>
        {setOpen ? null : children ? (
          <div>{children}</div>
        ) : (
          <HiPlus
            className="cc-w-6 cc-h-6 hover:cc-bg-gray-300 cc-rounded-md cc-p-1 cc-mr-5 cc-cursor-pointer"
            // onClick={fetchTokens}
          />
        )}
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="cc-bg-blackA9 data-[state=open]:cc-animate-overlayShow cc-fixed cc-inset-0 cc-bg-black/30" />
        <Dialog.Content className="cc-flex cc-flex-col data-[state=open]:cc-animate-contentShow cc-fixed cc-top-[50%] cc-left-[50%] cc-h-[600px] cc-w-[375px] cc-translate-x-[-50%] cc-translate-y-[-50%] cc-rounded-[6px] cc-bg-white cc-p-[25px] focus:cc-outline-none">
          {activeStep === 0 && (
            <CarbonAnnouncement
              setActiveStep={setActiveStep}
              activeIntegrations={activeIntegrations}
            />
          )}
          {activeStep === 1 && (
            <ThirdPartyList
              setActiveStep={setActiveStep}
              activeIntegrations={activeIntegrations}
            />
          )}

          {activeStep === 'GOOGLE_DOCS' && (
            <GoogleDocsSelector
              integrationData={activeIntegrations
                .filter((i) => i.data_source_type === 'GOOGLE_DRIVE')
                .pop()}
              setActiveStep={setActiveStep}
            />
          )}
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
              allowMultipleFiles={allowMultipleFiles}
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
  enabledIntegrations = [
    {
      id: 'LOCAL_FILES',
      chunkSize: 100,
      overlapSize: 10,
      maxFileSize: 20000000,
      allowMultipleFiles: true,
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
}) => {
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
      alwaysOpen={alwaysOpen}
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
      >
        {children}
      </IntegrationModal>
    </CarbonProvider>
  );
};

export { CarbonConnect };
