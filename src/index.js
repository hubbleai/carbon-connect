import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import './index.css';

import { HiCheckCircle, HiPlus, HiTrash, HiX, HiXCircle } from 'react-icons/hi';
import CarbonAnnouncement from './components/CarbonAnnouncement';
import ThirdPartyList from './components/ThirdPartyList';
import GoogleDocsSelector from './components/GoogleDocsSelector';
import FileUpload from './components/FileUpload';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { BASE_URL } from './constants';
import { AuthProvider, useCarbonAuth } from './contexts/AuthContext';

const IntegrationModal = ({
  orgName,
  brandIcon,
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
      const userIntegrationsResponse = await axios.get(
        `${BASE_URL[environment]}/integrations/`,
        {
          headers: {
            Authorization: `Token ${accessToken}`,
          },
        }
      );

      if (userIntegrationsResponse.status === 200) {
        setActiveIntegrations(
          userIntegrationsResponse.data['active_integrations']
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('Error Message: ', error.response.data['detail']);
        try {
          const refreshResponse = await axios.get(
            `${BASE_URL[environment]}/auth/v1/refresh_access_token`,
            {
              headers: {
                Authorization: `Token ${refreshToken}`,
              },
            }
          );

          if (refreshResponse.status === 200) {
            const newAccessToken = refreshResponse.data['access_token'];
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
      // const intervalId = setInterval(fetchUserIntegrations, 10000); // 10000 ms = 10 s
      // Make sure to clear the interval when the component unmounts
      // return () => clearInterval(intervalId);
    }
  }, [accessToken, refreshToken]);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <HiPlus
          className="w-6 h-6 hover:bg-gray-300 rounded-md p-1 mr-5 cursor-pointer"
          onClick={fetchTokens}
        />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 bg-black/30" />
        <Dialog.Content className="flex flex-col data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] h-[600px] w-[375px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] focus:outline-none">
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
          {activeStep === 'LOCAL_FILE' && (
            <FileUpload
              // token={token}
              // userid={userid}
              setActiveStep={setActiveStep}
              entryPoint={entryPoint}
              environment={environment}
              tags={tags}
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
  tokenFetcher = () => {},
  tags = [],
  environment = 'PRODUCTION',
  entryPoint = null,
}) => {
  return (
    <AuthProvider tokenFetcher={tokenFetcher}>
      <IntegrationModal
        orgName={orgName}
        brandIcon={brandIcon}
        environment={environment}
        entryPoint={entryPoint}
        tags={tags}
      />
    </AuthProvider>
  );
};

export { CarbonConnect };
