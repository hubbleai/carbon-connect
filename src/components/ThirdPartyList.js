// index.js
import '../index.css';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { HiCheckCircle, HiArrowLeft } from 'react-icons/hi';
import { BsGoogle, BsCloudUpload } from 'react-icons/bs';
import { RxNotionLogo } from 'react-icons/rx';
import axios from 'axios';
import { BASE_URL } from '../constants';
import { useCarbonAuth } from '../contexts/AuthContext';

const ThirdPartyList = ({ setActiveStep, activeIntegrations, environment }) => {
  const integrationsList = [
    {
      id: 'notion',
      subpath: 'notion',
      name: 'Notion',
      icon: <RxNotionLogo className="w-8 h-8" />,
      description: 'Lets your users connect their Notion accounts to Carbon.',
      active: true,
    },
    // {
    //   active: true,
    //   name: 'Google Docs',
    //   subpath: 'google',
    //   id: 'googleDocs',
    //   description: 'Lets your users connect their Google Docs to Carbon.',
    //   scope: 'docs',
    //   icon: <BsGoogle className="w-7 h-7" />,
    //   data_source_type: 'GOOGLE_DOCS',
    // },
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

  const { accessToken, refreshToken, setAccessToken } = useCarbonAuth();

  const handleServiceOAuthFlow = async (service) => {
    try {
      const oAuthURLResponse = await axios.get(
        `${BASE_URL[environment]}/integrations/${service.subpath}/oauth_url`,
        {
          params: {
            scope: service.scope,
          },
          headers: {
            'Content-Type': 'application/json',
            authorization: `Token ${accessToken}`,
          },
        }
      );

      if (oAuthURLResponse.status === 200 && oAuthURLResponse.data) {
        window.open(oAuthURLResponse.data.oauth_url, '_blank');
      }
    } catch (err) {
      console.log('Error in OAuth URL flow: ', err);
    }
  };

  return (
    <div className="flex flex-col h-full items-center">
      <Dialog.Title className="text-lg mb-4 font-medium w-full">
        <div className="w-full flex items-center space-x-4">
          <HiArrowLeft
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

export default ThirdPartyList;
