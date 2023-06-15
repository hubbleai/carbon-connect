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

const CarbonConnect = ({
  token,
  userid,
  orgName,
  brandIcon,
  environment = 'PRODUCTION',
  entryPoint = null,
}) => {
  const [activeStep, setActiveStep] = React.useState(entryPoint || 0);
  const [activeIntegrations, setActiveIntegrations] = React.useState([]);

  const fetchUserIntegrations = async () => {
    const userIntegrationsResponse = await axios.get(
      //   `https://api.dev.carbon.ai/integrations`,
      // `http://localhost:8000/integrations`
      `${BASE_URL[environment]}/integrations`,
      {
        params: {
          id: userid,
          token: token,
        },
      }
    );

    if (userIntegrationsResponse.status === 200) {
      setActiveIntegrations(
        userIntegrationsResponse.data['active_integrations']
      );
    }
  };

  useEffect(() => {
    // fetchUserIntegrations();
    // Then set up the interval to call it every 10 seconds
    // const intervalId = setInterval(fetchUserIntegrations, 10000); // 10000 ms = 10 s
    // Make sure to clear the interval when the component unmounts
    // return () => clearInterval(intervalId);
  }, []);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <HiPlus className="w-6 h-6 hover:bg-gray-300 rounded-md p-1 mr-5 cursor-pointer" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 bg-black/30" />
        <Dialog.Content className="flex flex-col data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] h-[600px] w-[375px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] focus:outline-none">
          <Dialog.Close asChild>
            <button
              className="absolute inline-flex h-fit appearance-none focus:outline-none justify-end pb-4 cursor-pointer top-7 right-5"
              aria-label="Close"
            >
              <HiX className="w-6 h-6 text-gray-400" />
            </button>
          </Dialog.Close>
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
              token={token}
              userid={userid}
              activeIntegrations={activeIntegrations}
              environment={environment}
            />
          )}

          {activeStep === 'GOOGLE_DOCS' && (
            <GoogleDocsSelector
              integrationData={activeIntegrations.find(
                (i) => i.data_source_type === 'GOOGLE_DOCS'
              )}
              token={token}
              userid={userid}
              setActiveStep={setActiveStep}
              entryPoint={entryPoint}
              environment={environment}
            />
          )}
          {activeStep === 'LOCAL_FILE' && (
            <FileUpload
              token={token}
              userid={userid}
              setActiveStep={setActiveStep}
              entryPoint={entryPoint}
              environment={environment}
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

export { CarbonConnect };
