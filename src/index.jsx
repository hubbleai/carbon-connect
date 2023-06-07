// index.js
import './index.css';

import React, { useEffect, useState } from 'react';
// Rest of the imports

import * as Dialog from '@radix-ui/react-dialog';
import { HiCheckCircle, HiPlus, HiTrash, HiX, HiXCircle } from 'react-icons/hi';
import { BsGoogle, BsDiscord, BsCloudUpload } from 'react-icons/bs';
import { FileUploader } from 'react-drag-drop-files';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

import {
  ArrowLeftIcon,
  LinkIcon,
  LockClosedIcon,
} from '@heroicons/react/20/solid';

const fileTypes = ['txt', 'csv'];

const CarbonAnnouncement = ({ setActiveStep }) => {
  return (
    <div className="flex flex-col h-full items-center justify-between ">
      <div className="flex pt-8 -space-x-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/images/icon-integration.png"
          alt="Rubber Icon"
          className="rounded-full border w-16"
        ></img>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/icons/CarbonIcon.svg" alt="Carbon Icon"></img>
        {/* <img src="/assets/icons/HubbleIcon.svg" className="bg-green-500"></img> */}
      </div>
      <h1 className=" text-xl font-light">
        <span className="font-normal">Rubber</span> uses{' '}
        <span className="font-normal">Carbon</span> <br />
        to connect your data.
      </h1>

      <ul className="">
        <li className="flex flex-row items-start w-full space-x-2 py-2 px-4">
          <LockClosedIcon className="w-5 h-5 mr-1 text-gray-400 mt-1" />
          <div className="flex flex-col gap-y-1">
            <h1 className="text-md font-medium">Private</h1>
            <p className="text-sm font-normal text-gray-400">
              Your credentials will never be made available to Rubber.
            </p>
          </div>
        </li>
        <li className="flex flex-row items-start w-full space-x-2 py-2 px-4">
          <LinkIcon className="w-7 h-7 mr-1 text-gray-400" />
          <div className="flex flex-col gap-y-1">
            <h1 className="text-md font-medium">Secure</h1>
            <p className="text-sm font-normal text-gray-400">
              You can select to give Rubber access to specific information only.
            </p>
          </div>
        </li>
      </ul>

      <div className="flex flex-col space-y-3 w-full items-center">
        <p className="text-xs text-center text-gray-400">
          {`By continuing, you agree to Carbon's`}
          <br></br>
          <u>{`User Terms and Privacy Policy.`}</u>
        </p>
        <button
          className="w-full h-12 flex flex-row bg-black text-white items-center justify-center rounded-md cursor-pointer"
          onClick={() => setActiveStep(1)}
        >
          <p>Connect</p>
        </button>
      </div>

      {/* <Dialog.Title className="text-lg font-medium">
        Available Integrations
      </Dialog.Title> */}
      {/* <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
        {`Make changes to your profile here. Click save when you're done.`}
      </Dialog.Description> */}
    </div>
  );
};

const ThirdPartyList = ({
  setActiveStep,
  apikey,
  userid,
  activeIntegrations,
}) => {
  const integrationsList = [
    // {
    //   id: 'notion',
    //   subpath: 'notion',
    //   name: 'Notion',
    //   icon: <RxNotionLogo className="w-8 h-8" />,
    //   description: 'Lets your users connect their Notion accounts to Carbon.',
    //   active: true,
    // },
    {
      active: true,
      name: 'Google Docs',
      subpath: 'google',
      id: 'googleDocs',
      description: 'Lets your users connect their Google Docs to Carbon.',
      scope: 'docs',
      icon: <BsGoogle className="w-7 h-7" />,
      data_source_type: 'GOOGLE_DOCS',
    },
    // {
    //   active: true,
    //   name: 'Google Drive',
    //   subpath: 'google',
    //   id: 'googleDrive',
    //   description: 'Lets your users connect their Google Docs to Carbon.',
    //   scope: 'drive',
    //   icon: <BsGoogle className="w-7 h-7" />,
    // },
    // {
    //   active: true,
    //   name: 'Gmail',
    //   subpath: 'google',
    //   id: 'gmail',
    //   description: 'Lets your users connect their Google Docs to Carbon.',
    //   scope: 'gmail',
    //   icon: <BsGoogle className="w-7 h-7" />,
    // },
    // {
    //   active: false,
    //   name: 'Slack',
    //   subpath: 'slack',
    //   id: 'slack',
    //   description: 'Lets your users connect their Slack accounts to Carbon.',
    //   icon: <SiSlack className="w-7 h-7" />,
    // },
    // {
    //   active: false,
    //   name: 'Discord',
    //   subpath: 'discord',
    //   id: 'discord',
    //   description: 'Lets your users connect their Discord accounts to Carbon.',
    //   icon: <BsDiscord className="w-7 h-7" />,
    // },
    {
      active: true,
      name: 'File Upload',
      subpath: 'local',
      id: 'localFiles',
      description: 'Lets your users upload local files to Carbon.',
      icon: <BsCloudUpload className="w-7 h-7" />,
      data_source_type: 'LOCAL_FILE',
    },
  ];

  const handleServiceOAuthFlow = async (service) => {
    const oAuthURLResponse = await axios.get(
      `http://localhost:8000/integrations/${service.subpath}/oauth_url`,
      {
        params: {
          id: userid,
          apikey: apikey,
          scope: service.scope,
        },
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${apikey}`,
          'customer-id': userid,
        },
      }
    );

    if (oAuthURLResponse.status === 200 && oAuthURLResponse.data) {
      window.open(oAuthURLResponse.data.oauth_url, '_blank');
    }
  };

  return (
    <div className="flex flex-col h-full items-center">
      <Dialog.Title className="text-lg mb-4 font-medium w-full">
        <div className="w-full flex items-center space-x-4">
          <ArrowLeftIcon
            onClick={() => setActiveStep(0)}
            className="cursor-pointer h-6 w-6 text-gray-400"
          />
          {/*<h1>Integrations</h1>*/}
        </div>
      </Dialog.Title>
      <ul className="flex flex-col space-y-3 w-full py-2 overflow-y-auto">
        {integrationsList.map((integration) => {
          const activeIntegrationsList = activeIntegrations.map(
            (i) => i.data_source_type
          );

          const integrationStatus = activeIntegrationsList.includes(
            integration.data_source_type
          );

          // console.log('Active Integrations: ', activeIntegrations);
          return (
            <li
              key={integration.id}
              className={`border rounded-md h-fit items-center px-4 w-full ${
                !integration.active
                  ? 'bg-gray-200 cursor-not-allowed'
                  : 'bg-white cursor-pointer hover:bg-gray-100'
              }`}
            >
              <div
                className={`flex flex-row items-center w-full space-x-3 py-4 justify-between ${
                  !integration.active
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'bg-white cursor-pointer hover:bg-gray-100'
                }`}
                onClick={() => {
                  if (integration.active) {
                    if (integration.data_source_type === 'LOCAL_FILE') {
                      setActiveStep(integration.data_source_type);
                      return;
                    }
                    if (integrationStatus) {
                      // handleServiceOAuthFlow(integration);
                      // console.log('Integration already active');
                      setActiveStep(integration.data_source_type);
                    } else {
                      handleServiceOAuthFlow(integration);
                    }
                  }
                }}
              >
                <div className="flex flex-row items-center">
                  <span className="mr-4">{integration.icon}</span>
                  <h1 className="text-md font-normal">{integration.name}</h1>
                </div>
                <div className="flex flex-col">
                  <div className="flex flex-row w-full items-center space-x-4">
                    {!integration.active && (
                      <p className="text-xs text-gray-600 bg-white px-4 py-1 rounded-full ">
                        Coming Soon
                      </p>
                    )}

                    {integration.active && integrationStatus && (
                      <HiCheckCircle className="text-green-500 w-6 h-6" />
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const GoogleDocsSelector = ({
  integrationData,
  setActiveStep,
  apikey,
  userid,
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [syncResponse, setSyncResponse] = useState(null);

  const syncSelectedFiles = async () => {
    const syncResponse = await axios.post(
      `http://localhost:8000/integrations/google/sync`,
      {
        user_id: userid,
        api_key: apikey,
        file_ids: selectedFiles,
      }
    );

    if (syncResponse.status === 200 && syncResponse.data) {
      setSyncResponse(syncResponse.data);
      // console.log('Sync Response: ', syncResponse.data);
      // if (syncResponse.data.status === 200) {
      //   setActiveStep(2);

      // }
      // setActiveStep(2);
    }
  };

  return (
    <div className="flex flex-col h-[540px] items-center">
      <Dialog.Title className="text-lg mb-4 font-medium w-full">
        <div className="w-full flex items-center space-x-4">
          <ArrowLeftIcon
            onClick={() => setActiveStep(1)}
            className="cursor-pointer h-6 w-6 text-gray-400"
          />
          <h1>Select Files</h1>
        </div>
      </Dialog.Title>
      {!syncResponse && (
        <>
          <div className="flex flex-col space-y-3 w-full py-2 overflow-y-auto">
            {integrationData.token.all_files.map((fileData) => {
              const isSelected = selectedFiles.includes(fileData.id);

              return (
                <div
                  key={fileData.id}
                  className={`border rounded-md h-fit items-center p-4 w-full cursor-pointer ${
                    isSelected ? 'bg-green-200' : 'bg-white hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setSelectedFiles((prev) => {
                      if (prev.includes(fileData.id)) {
                        return prev.filter((id) => id !== fileData.id);
                      } else {
                        return [...prev, fileData.id];
                      }
                    });
                  }}
                >
                  <h1 className="text-md font-normal">{fileData.name}</h1>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col h-full space-y-2 w-full">
            <button
              className="w-full h-12 flex flex-row bg-black text-white items-center justify-center rounded-md cursor-pointer"
              onClick={() => syncSelectedFiles()}
            >
              Sync Files
            </button>
          </div>
        </>
      )}

      {syncResponse && (
        <div className="flex flex-col space-y-3 w-full py-2 overflow-y-auto h-full items-center text-xl justify-center">
          {syncResponse.code === 200 ? (
            <HiCheckCircle className="text-green-500 w-8 h-8" />
          ) : (
            <HiXCircle className="text-red-500  w-8 h-8" />
          )}
          <p>{syncResponse.message}</p>
        </div>
      )}
    </div>
  );
};

function FileUpload({ setActiveStep, apikey, userid }) {
  const [file, setFile] = useState(null);
  const [syncResponse, setSyncResponse] = useState(null);

  useEffect(() => {
    console.log('Files: ', file);
  }, [file]);

  const uploadSelectedFile = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await axios.post(
        `https://api.dev.carbon.ai/uploadfile`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${apikey}`,
            'customer-id': userid,
          },
        }
      );

      if (uploadResponse.status === 200 && uploadResponse.data) {
        setSyncResponse(uploadResponse.data);
        // console.log('Sync Response: ', syncResponse.data);
        // if (syncResponse.data.status === 200) {
        //   setActiveStep(2);

        // }
        // setActiveStep(2);
      }
    } catch (err) {
      console.log(err);
      toast.error('Error uploading file');
    }
  };

  return (
    <div className="flex flex-col h-[540px] items-center relative">
      <Dialog.Title className="text-lg mb-4 font-medium w-full">
        <div className="w-full flex items-center space-x-4">
          <ArrowLeftIcon
            onClick={() => setActiveStep(1)}
            className="cursor-pointer h-6 w-6 text-gray-400"
          />
          <h1>Upload Files</h1>
        </div>
      </Dialog.Title>
      {!syncResponse && (
        <div className="w-full h-full flex-col flex space-y-4 justify-between">
          <FileUploader
            multiple={false}
            handleChange={setFile}
            name="file"
            types={fileTypes}
            maxSize="9.5"
            label="Upload or drag a file here to embed."
          >
            <div className="flex py-2 h-40 w-full flex mt-4 mb-1 cursor-pointer text-center border rounded-lg justify-center items-center gap-x-2  overflow-hidden text-black space-x-2">
              <div>
                <AiOutlineCloudUpload className="w-6 h-6 mb-4 mx-auto" />
                <p className="text-[#484848]">
                  Upload .txt, .pdf, or .csv files
                </p>
                <p className="text-[#919191]">
                  Max 3 MB per File (20 MB total)
                </p>
              </div>
            </div>
          </FileUploader>

          {file && (
            <table class="my-3 w-full bg-blue-400/20">
              <tr>
                <td class="py-2 px-4">Name:</td>
                <td class="py-2 px-4 break-words text-left">{file.name}</td>
              </tr>
              <tr>
                <td class="py-2 px-4">Size:</td>
                <td class="py-2 px-4 text-left">{`${parseFloat(
                  file.size / 1024
                ).toFixed(2)} KB`}</td>
              </tr>
              <tr>
                <td class="py-2 px-4">File Type:</td>
                <td class="py-2 px-4 text-left">{file.type}</td>
              </tr>
            </table>
          )}

          <div className="flex flex-col h-full space-y-2 w-full">
            <button
              className="w-full h-12 flex flex-row bg-black text-white items-center justify-center rounded-md cursor-pointer"
              onClick={() => {
                if (file) uploadSelectedFile();
                else toast.error('Please select a file to upload');
              }}
            >
              Upload File
            </button>
          </div>
        </div>
      )}

      {syncResponse && (
        <div className="flex flex-col space-y-3 w-full py-2 overflow-y-auto h-full items-center text-xl justify-center">
          {syncResponse.code === 200 ? (
            <HiCheckCircle className="text-green-500 w-8 h-8" />
          ) : (
            <HiXCircle className="text-red-500  w-8 h-8" />
          )}
          <p>{syncResponse.message}</p>
        </div>
      )}
    </div>
  );
}

const CarbonConnect = ({ apikey, userid }) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [activeIntegrations, setActiveIntegrations] = React.useState([]);

  const fetchUserIntegrations = async () => {
    const userIntegrationsResponse = await axios.get(
      `http://localhost:8000/integrations`,
      {
        params: {
          id: userid,
          apikey: apikey,
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
    fetchUserIntegrations();

    // Then set up the interval to call it every 10 seconds
    const intervalId = setInterval(fetchUserIntegrations, 10000); // 10000 ms = 10 s

    // Make sure to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <HiPlus className="w-6 h-6 hover:bg-gray-300 rounded-md p-1 mr-5 cursor-pointer" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 bg-black/30" />
        <Dialog.Content className="flex flex-col data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] h-[740px] w-[375px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] focus:outline-none">
          <Dialog.Close asChild>
            <button
              className="absolute inline-flex h-fit appearance-none focus:outline-none justify-end pb-4 cursor-pointer top-7 right-5"
              aria-label="Close"
            >
              <HiX className="w-6 h-6 text-gray-400" />
            </button>
          </Dialog.Close>
          {activeStep === 0 && (
            <CarbonAnnouncement setActiveStep={setActiveStep} />
          )}
          {activeStep === 1 && (
            <ThirdPartyList
              setActiveStep={setActiveStep}
              apikey={apikey}
              userid={userid}
              activeIntegrations={activeIntegrations}
            />
          )}

          {activeStep === 'GOOGLE_DOCS' && (
            <GoogleDocsSelector
              integrationData={activeIntegrations.find(
                (i) => i.data_source_type === 'GOOGLE_DOCS'
              )}
              apikey={apikey}
              userid={userid}
              setActiveStep={setActiveStep}
            />
          )}
          {activeStep === 'LOCAL_FILE' && (
            <FileUpload
              apikey={apikey}
              userid={userid}
              setActiveStep={setActiveStep}
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

export default CarbonConnect;
