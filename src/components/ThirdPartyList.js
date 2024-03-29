// index.js
import '../index.css';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { HiCheckCircle, HiArrowLeft, HiX } from 'react-icons/hi';
import { BASE_URL, onSuccessEvents } from '../constants';
import { useCarbon } from '../contexts/CarbonContext';

const ThirdPartyList = ({ setActiveStep, activeIntegrations }) => {
  const {
    processedIntegrations,
    manageModalOpenState,
    primaryTextColor,
    handleServiceOAuthFlow,
    entryPoint,
  } = useCarbon();

  const activeIntegrationsList = activeIntegrations.map(
    (i) => i.data_source_type
  );

  return (
    <div className="cc-flex cc-flex-col cc-h-full cc-items-center">
      <Dialog.Title className="cc-text-lg cc-mb-4 cc-font-medium cc-w-full">
        <div className="cc-w-full cc-flex cc-items-center cc-space-x-4">
          {entryPoint !== 'INTEGRATIONS_HOME' ? (
            <HiArrowLeft
              onClick={() => setActiveStep(0)}
              className="cc-cursor-pointer cc-h-6 cc-w-6 cc-text-gray-400"
            />
          ) : null}

          <h1 className="cc-grow">Integrations</h1>
          <HiX
            onClick={() => manageModalOpenState(false)}
            className="cc-cursor-pointer cc-h-5 cc-w-5"
            style={{
              color: primaryTextColor,
            }}
          />
        </div>
      </Dialog.Title>
      <ul className="cc-flex cc-flex-col cc-space-y-3 cc-w-full cc-py-2 cc-overflow-y-auto">
        {processedIntegrations.map((integration) => {
          const integrationStatus = activeIntegrationsList.includes(
            integration.data_source_type
          );

          // to support multiple integrations we will read the last one they connected
          const matchingIntegrations = activeIntegrations.filter(
            ai => ai.data_source_type == integration.data_source_type
          ).sort((a, b) => b.id - a.id)
          const activeIntegration = matchingIntegrations.length ? matchingIntegrations[0] : null

          return (
            <li
              key={integration.id}
              className={`cc-border cc-rounded-md cc-h-fit cc-items-center cc-px-4 cc-w-full ${!integration.active
                ? 'cc-bg-gray-200 cc-cursor-not-allowed'
                : 'cc-bg-white cc-cursor-pointer hover:cc-bg-gray-100'
                }`}
            >
              <div
                className="cc-flex cc-flex-row cc-items-center cc-w-full cc-space-x-3 cc-py-4 cc-justify-between"
                onClick={() => {
                  try {
                    if (integration.active) {
                      if (!integration.requiresOAuth) {
                        setActiveStep(integration.data_source_type);
                      } else {
                        if (integration?.multiStep) {
                          setActiveStep(integration.data_source_type);
                          return;
                        }
                        handleServiceOAuthFlow(integration, activeIntegration);
                      }
                    }
                  } catch (err) {
                    console.error(
                      '[ThirdPartyList.js] Error in handleServiceOAuthFlow: ',
                      err
                    );
                  }
                }}
              >
                <div className="cc-flex cc-flex-row cc-items-center">
                  <span className="cc-mr-4">{integration.icon}</span>
                  <h1 className="cc-text-base cc-font-roboto cc-items-center cc-justify-center cc-font-medium">
                    {integration.integrationsListViewTitle || integration.name}
                    {/* {integration.data_source_type === 'GOOGLE_DRIVE'
                      ? 'Connect your Google Drive'
                      : integration.name} */}
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
