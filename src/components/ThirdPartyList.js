import '../index.css';

import React, { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { HiCheckCircle, HiArrowLeft, HiX, HiSearch } from 'react-icons/hi';
import { BASE_URL, onSuccessEvents } from '../constants';
import { useCarbon } from '../contexts/CarbonContext';

const ThirdPartyListItem = ({
  integration,
  integrationStatus,
  setActiveStep,
}) => {
  return (
    <div
      key={integration.id}
      className="cc-rounded-md cc-items-center cc-px-4 cc-w-40 cc-h-32 cc-bg-white cc-cursor-pointer hover:cc-bg-gray-100 cc-shadow-lg cc-border"
      onClick={() => {
        try {
          setActiveStep(integration.data_source_type);
        } catch (err) {
          console.log(
            '[ThirdPartyList.js] Error in thirdpartylist onClick ',
            err
          );
        }
      }}
    >
      <span className="cc-flex cc-items-center cc-justify-center cc-w-full cc-h-2/3">
        {integration.icon}
      </span>

      <div className="cc-flex cc-flex-row cc-items-center cc-justify-center cc-w-full">
        <h1 className="cc-text-base cc-font-roboto cc-font-medium">
          {integration.name}
        </h1>
        {integrationStatus && (
          <div className="cc-ml-2 cc-w-2 cc-h-2 cc-bg-green-500 cc-rounded-full cc-animate-pulse" />
        )}
      </div>
    </div>
  );
};

const ThirdPartyList = ({ setActiveStep, activeIntegrations }) => {
  const [searchTerm, setSearchTerm] = useState(null);
  const [filteredIntegrations, setFilteredIntegrations] = useState([]);

  useEffect(() => {
    if (searchTerm === '' || searchTerm === null) {
      setFilteredIntegrations(processedIntegrations);
    } else {
      const filteredIntegrations = processedIntegrations.filter(
        (i) =>
          i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          i.id.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setFilteredIntegrations(filteredIntegrations);
    }
  }, [searchTerm, processedIntegrations]);

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
    <div className="cc-flex cc-flex-col cc-h-full cc-items-center cc-px-4 cc-py-6">
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

      {/* <div className="cc-flex cc-items-center cc-w-full cc-bg-gray-300 cc-rounded-md cc-m-2 cc-border cc-space-x-2">
        <HiSearch className="cc-text-gray-600 cc-mx-2" />
        <input
          type="text"
          placeholder="Search Integrations"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="cc-flex-grow cc-border-none cc-text-sm cc-font-roboto cc-font-medium cc-text-gray-600 cc-placeholder-gray-400 cc-rounded-md cc-bg-transparent cc-outline-none focus:cc-outline-none focus:cc-ring-0"
        />
      </div> */}
      <div className="cc-flex cc-items-center cc-w-full cc-rounded-md cc-m-2 cc-border cc-px-2 cc-space-x-2 cc-border-gray-500">
        <HiSearch className="cc-text-gray-600" />
        <input
          type="text"
          placeholder="Search Integrations"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="cc-flex-grow cc-w-full cc-border-none cc-text-sm cc-font-roboto cc-font-medium cc-text-gray-600 cc-placeholder-gray-400 cc-rounded-md cc-outline-none focus:cc-outline-none focus:cc-ring-0"
        />
      </div>

      {/* sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 */}
      <div className="grid grid-cols-4 cc-gap-4 cc-w-full cc-h-full cc-overflow-y-auto">
        {filteredIntegrations.map((integration) => {
          const activeIntegrationsList = activeIntegrations.map(
            (i) => i.data_source_type
          );

          const integrationStatus = activeIntegrationsList.includes(
            integration.data_source_type
          );

          return (
            <ThirdPartyListItem
              integration={integration}
              integrationStatus={integrationStatus}
              setActiveStep={setActiveStep}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ThirdPartyList;
