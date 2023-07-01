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

const IntegrationModal = ({
  orgName,
  brandIcon,
  maxFileSize,
  children,
  enabledIntegrations,
  onSuccess,
  onError,
  tags = {},
  environment = 'PRODUCTION',
  entryPoint = null,
}) => {
  const [activeStep, setActiveStep] = React.useState(entryPoint || 0);
  const [activeIntegrations, setActiveIntegrations] = React.useState([]);

  const { accessToken, refreshToken, setAccessToken, fetchTokens } =
    useCarbonAuth();

  const fetchUserIntegrations = async () => {
    try {
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
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('Error Message: ', error.response.data['detail']);
        try {
          const refreshResponse = await fetch(
            `${BASE_URL[environment]}/auth/v1/refresh_access_token`,
            {
              headers: {
                Authorization: `Token ${refreshToken}`,
              },
            }
          );

          if (refreshResponse.status === 200) {
            const responseBody = await refreshResponse.json();
            const newAccessToken = responseBody['access_token'];
            setAccessToken(newAccessToken);
          }
        } catch (refreshError) {
          if (refreshError.response && refreshError.response.status === 401) {
            console.log('Refresh token expired, fetching new tokens...');
          }
        }
      }
    }
  };

  useEffect(() => {
    if (accessToken && refreshToken) {
      fetchUserIntegrations();
      // Then set up the interval to call it every 10 seconds
      const intervalId = setInterval(fetchUserIntegrations, 10000); // 10000 ms = 10 s
      // Make sure to clear the interval when the component unmounts
      return () => clearInterval(intervalId);
    }
  }, [accessToken, refreshToken]);

  useEffect(() => {
    fetchTokens();
  }, []);

  return (
    <Dialog.Root
      onOpenChange={(open) => {
        if (!open) setActiveStep(entryPoint || 0);
      }}
    >
      <Dialog.Trigger asChild>
        {children ? (
          <div
          // onClick={fetchTokens}
          >
            {children}
          </div>
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
              orgName={orgName}
              brandIcon={brandIcon}
            />
          )}
          {activeStep === 1 && (
            <ThirdPartyList
              setActiveStep={setActiveStep}
              activeIntegrations={activeIntegrations}
              environment={environment}
              enabledIntegrations={enabledIntegrations}
              tags={tags}
            />
          )}

          {/* {activeStep === 'GOOGLE_DOCS' && (
            <GoogleDocsSelector
              integrationData={activeIntegrations.find(
                (i) => i.data_source_type === 'GOOGLE_DOCS'
              )}
              // token={token}
              // userid={userid}
              setActiveStep={setActiveStep}
              entryPoint={entryPoint}
              environment={environment}
            />
          )} */}
          {activeStep === 'LOCAL_FILES' && (
            <FileUpload
              // token={token}
              // userid={userid}
              setActiveStep={setActiveStep}
              entryPoint={entryPoint}
              environment={environment}
              tags={tags}
              maxFileSize={maxFileSize}
              onSuccess={onSuccess}
              onError={onError}
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
      >
        {children}
      </IntegrationModal>
    </AuthProvider>
  );
};

export { CarbonConnect };
