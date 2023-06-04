// index.js

import React from 'react';
// Rest of the imports

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { HiPlus, HiX } from 'react-icons/hi';
import { BsGoogle, BsDiscord, BsCloudUpload } from 'react-icons/bs';
import { RxNotionLogo } from 'react-icons/rx';
import { SiSlack } from 'react-icons/si';
import axios from 'axios';

import {
  ArrowLeftIcon,
  LinkIcon,
  LockClosedIcon,
} from '@heroicons/react/20/solid';

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

const ThirdPartyList = ({ setActiveStep }) => {
  const { appUser } = useAppUser();

  const integrationsList = [
    {
      id: 'notion',
      subpath: 'notion',
      name: 'Notion',
      icon: <RxNotionLogo className="w-8 h-8" />,
      description: 'Lets your users connect their Notion accounts to Carbon.',
      active: true,
    },
    {
      active: true,
      name: 'Google Docs',
      subpath: 'google',
      id: 'googleDocs',
      description: 'Lets your users connect their Google Docs to Carbon.',
      scope: 'docs',
      icon: <BsGoogle className="w-7 h-7" />,
    },
    {
      active: true,
      name: 'Google Drive',
      subpath: 'google',
      id: 'googleDrive',
      description: 'Lets your users connect their Google Docs to Carbon.',
      scope: 'drive',
      icon: <BsGoogle className="w-7 h-7" />,
    },
    {
      active: true,
      name: 'Gmail',
      subpath: 'google',
      id: 'gmail',
      description: 'Lets your users connect their Google Docs to Carbon.',
      scope: 'gmail',
      icon: <BsGoogle className="w-7 h-7" />,
    },
    {
      active: false,
      name: 'Slack',
      subpath: 'slack',
      id: 'slack',
      description: 'Lets your users connect their Slack accounts to Carbon.',
      icon: <SiSlack className="w-7 h-7" />,
    },
    {
      active: false,
      name: 'Discord',
      subpath: 'discord',
      id: 'discord',
      description: 'Lets your users connect their Discord accounts to Carbon.',
      icon: <BsDiscord className="w-7 h-7" />,
    },
    {
      active: false,
      name: 'File Upload',
      subpath: 'local',
      id: 'localFiles',
      description: 'Lets your users upload local files to Carbon.',
      icon: <BsCloudUpload className="w-7 h-7" />,
    },
  ];

  const handleServiceClick = async (service) => {
    const oAuthURLResponse = await axios.get(
      `http://localhost:8000/integrations/${service.subpath}/oauth_url`,
      {
        params: {
          id: 'kailash@hubble.ai',
          apikey: '1',
          scope: service.scope,
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
        {integrationsList.map((integration) => (
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
              onClick={() =>
                integration.active && handleServiceClick(integration)
              }
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
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const IntegrationsModal = () => {
  const [activeStep, setActiveStep] = React.useState(0);

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <HiPlus className="w-6 h-6 hover:bg-gray-300 rounded-md p-1 mr-5 cursor-pointer" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0 bg-black/30" />
        <Dialog.Content className="flex flex-col data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] h-[540px] w-[375px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] focus:outline-none">
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
          {activeStep === 1 && <ThirdPartyList setActiveStep={setActiveStep} />}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default IntegrationsModal;
