// index.js
import '../index.css';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { HiCheckCircle, HiArrowLeft } from 'react-icons/hi';
import { BsGoogle, BsCloudUpload } from 'react-icons/bs';
import { RxNotionLogo } from 'react-icons/rx';
import { BASE_URL } from '../constants';
import { useCarbonAuth } from '../contexts/AuthContext';

const ThirdPartyList = ({
  setActiveStep,
  activeIntegrations,
  environment,
  enabledIntegrations,
  tags,
}) => {
  const integrationsList = [
    {
      id: 'notion',
      subpath: 'notion',
      name: 'Notion',
      icon: <RxNotionLogo className="cc-w-8 cc-h-8" />,
      description: 'Lets your users connect their Notion accounts to Carbon.',
      active: true,
      data_source_type: 'NOTION',
      requiresOAuth: true,
    },
    {
      active: true,
      name: 'Google Docs',
      subpath: 'google',
      id: 'googleDocs',
      description: 'Lets your users connect their Google Docs to Carbon.',
      scope: 'docs',
      icon: <BsGoogle className="cc-w-7 cc-h-7" />,
      data_source_type: 'GOOGLE_DOCS',
      requiresOAuth: true,
    },
    // {
    //   active: true,
    //   name: 'Google Drive',
    //   subpath: 'google',
    //   id: 'googleDrive',
    //   description: 'Lets your users connect their Google Docs to Carbon.',
    //   scope: 'drive',
    //   icon: <BsGoogle className="cc-w-7 cc-h-7" />,
    // },
    // {
    //   active: true,
    //   name: 'Gmail',
    //   subpath: 'google',
    //   id: 'gmail',
    //   description: 'Lets your users connect their Google Docs to Carbon.',
    //   scope: 'gmail',
    //   icon: <BsGoogle className="cc-w-7 cc-h-7" />,
    // },
    // {
    //   active: false,
    //   name: 'Slack',
    //   subpath: 'slack',
    //   id: 'slack',
    //   description: 'Lets your users connect their Slack accounts to Carbon.',
    //   icon: <SiSlack className="cc-w-7 cc-h-7" />,
    // },
    // {
    //   active: false,
    //   name: 'Discord',
    //   subpath: 'discord',
    //   id: 'discord',
    //   description: 'Lets your users connect their Discord accounts to Carbon.',
    //   icon: <BsDiscord className="cc-w-7 cc-h-7" />,
    // },
    {
      active: true,
      name: 'File Upload',
      subpath: 'local',
      id: 'local_files',
      description: 'Lets your users upload local files to Carbon.',
      icon: <BsCloudUpload className="cc-w-7 cc-h-7" />,
      data_source_type: 'LOCAL_FILES',
    },
  ];

  const { accessToken, refreshToken, setAccessToken } = useCarbonAuth();

  const handleServiceOAuthFlow = async (service) => {
    try {
      const oAuthURLResponse = await fetch(
        `${BASE_URL[environment]}/integrations/oauth_url`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Token ${accessToken}`,
          },
          body: JSON.stringify({
            tags: tags,
            scope: service?.scope,
            service: service?.data_source_type,
          }),
        }
      );

      if (oAuthURLResponse.status === 200) {
        const oAuthURLResponseData = await oAuthURLResponse.json();
        window.open(oAuthURLResponseData.oauth_url, '_blank');
      }
    } catch (err) {
      console.log('Error in OAuth URL flow: ', err);
    }
  };

  return (
    <div className="cc-flex cc-flex-col cc-h-full cc-items-center">
      <Dialog.Title className="cc-text-lg cc-mb-4 cc-font-medium cc-w-full">
        <div className="cc-w-full cc-flex cc-items-center cc-space-x-4">
          <HiArrowLeft
            onClick={() => setActiveStep(0)}
            className="cc-cursor-pointer cc-h-6 cc-w-6 cc-text-gray-400"
          />
          <h1>Integrations</h1>
        </div>
      </Dialog.Title>
      <ul className="cc-flex cc-flex-col cc-space-y-3 cc-w-full cc-py-2 cc-overflow-y-auto">
        {integrationsList.map((integration) => {
          const activeIntegrationsList = activeIntegrations.map(
            (i) => i.data_source_type
          );

          const integrationStatus = activeIntegrationsList.includes(
            integration.data_source_type
          );

          if (!enabledIntegrations.includes(integration.data_source_type)) {
            return null;
          }

          return (
            <li
              key={integration.id}
              className={`cc-border cc-rounded-md cc-h-fit cc-items-center cc-px-4 cc-w-full ${
                !integration.active
                  ? 'cc-bg-gray-200 cc-cursor-not-allowed'
                  : 'cc-bg-white cc-cursor-pointer hover:cc-bg-gray-100'
              }`}
            >
              <div
                className={`cc-flex cc-flex-row cc-items-center cc-w-full cc-space-x-3 cc-py-4 cc-justify-between ${
                  !integration.active
                    ? 'cc-bg-gray-200 cc-cursor-not-allowed'
                    : 'cc-bg-white cc-cursor-pointer hover:cc-bg-gray-100'
                }`}
                onClick={() => {
                  if (integration.active) {
                    if (integration.data_source_type === 'LOCAL_FILES') {
                      setActiveStep(integration.data_source_type);
                      return;
                    }
                    if (!integration.requiresOAuth) {
                      // handleServiceOAuthFlow(integration);
                      // console.log('Integration already active');
                      setActiveStep(integration.data_source_type);
                    } else {
                      handleServiceOAuthFlow(integration);
                    }
                  }
                }}
              >
                <div className="cc-flex cc-flex-row cc-items-center">
                  <span className="cc-mr-4">{integration.icon}</span>
                  <h1 className="cc-text-md cc-font-normal">
                    {integration.name}
                  </h1>
                </div>
                <div className="cc-flex cc-flex-col">
                  <div className="cc-flex cc-flex-row cc-w-full cc-items-center cc-space-x-4">
                    {!integration.active && (
                      <p className="cc-text-xs cc-text-gray-600 cc-bg-white cc-px-4 cc-py-1 cc-rounded-full ">
                        Coming Soon
                      </p>
                    )}

                    {integration.active && integrationStatus && (
                      <HiCheckCircle className="cc-text-green-500 cc-w-6 cc-h-6" />
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
