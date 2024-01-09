// index.js
import '../index.css';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { HiCheckCircle, HiArrowLeft, HiX } from 'react-icons/hi';
import { BASE_URL, onSuccessEvents } from '../constants';
import { useCarbon } from '../contexts/CarbonContext';

const ThirdPartyList = ({ setActiveStep, activeIntegrations }) => {
  const {
    accessToken,
    tags,
    environment,
    processedIntegrations,
    topLevelChunkSize,
    topLevelOverlapSize,
    defaultChunkSize,
    defaultOverlapSize,
    authenticatedFetch,
    onSuccess,
    manageModalOpenState,
    primaryTextColor,
    embeddingModel,
  } = useCarbon();

  const handleServiceOAuthFlow = async (service) => {
    try {
      const chunkSize =
        service?.chunkSize || topLevelChunkSize || defaultChunkSize;
      const overlapSize =
        service?.overlapSize || topLevelOverlapSize || defaultOverlapSize;
      const skipEmbeddingGeneration = service?.skipEmbeddingGeneration || false;
      const oAuthURLResponse = await authenticatedFetch(
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
            chunk_size: chunkSize,
            chunk_overlap: overlapSize,
            skip_embedding_generation: skipEmbeddingGeneration,
            embedding_model: embeddingModel,
          }),
        }
      );

      if (oAuthURLResponse.status === 200) {
        // setFlag(service?.data_source_type, true);
        onSuccess({
          status: 200,
          data: null,
          integration: service?.data_source_type,
          action: onSuccessEvents.INITIATE,
          event: onSuccessEvents.INITIATE,
        });
        const oAuthURLResponseData = await oAuthURLResponse.json();

        window.open(oAuthURLResponseData.oauth_url, '_blank');
      }
    } catch (err) {
      console.log('[ThirdPartyList.js] Error in handleServiceOAuthFlow: ', err);
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
          const activeIntegrationsList = activeIntegrations.map(
            (i) => i.data_source_type
          );

          const integrationStatus = activeIntegrationsList.includes(
            integration.data_source_type
          );

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
                        handleServiceOAuthFlow(integration);
                      }
                    }
                  } catch (err) {
                    console.log(
                      '[ThirdPartyList.js] Error in handleServiceOAuthFlow: ',
                      err
                    );
                  }
                }}
              >
                <div className="cc-flex cc-flex-row cc-items-center">
                  <span className="cc-mr-4">{integration.icon}</span>
                  <h1 className="cc-text-base cc-font-roboto cc-items-center cc-justify-center cc-font-medium">
                    {integration.data_source_type === 'GOOGLE_DRIVE'
                      ? 'Connect your Google Drive'
                      : integration.name}
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
