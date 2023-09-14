import React, { useEffect, useState } from 'react';
import { darkenColor } from '../utils/helpers';

import * as Dialog from '@radix-ui/react-dialog';
import {
  HiXCircle,
  HiCheckCircle,
  HiArrowLeft,
  HiUpload,
  HiX,
  HiPlus,
  HiTrash,
  HiDownload,
  HiInformationCircle,
} from 'react-icons/hi';
import { FaSitemap, FaLaptop } from 'react-icons/fa';
import { toast } from 'react-toastify';

import '../index.css';
import { BASE_URL, onSuccessEvents } from '../constants';
import { LuLoader2 } from 'react-icons/lu';
import { useCarbon } from '../contexts/CarbonContext';
import { BiLoaderAlt } from 'react-icons/bi';

function ZendeskScreen({
  setActiveStep,
  entryPoint,
  environment,
  tags,
  onSuccess,
  onError,
  primaryBackgroundColor,
  primaryTextColor,
  secondaryBackgroundColor,
  secondaryTextColor,
}) {
  const [zendeskSubdomain, setZendeskSubdomain] = useState('');
  const [submitButtonHoveredState, setSubmitButtonHoveredState] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [service, setService] = useState(null);

  useEffect(() => {
    setService(
      processedIntegrations.find((integration) => integration.id === 'ZENDESK')
    );
  }, [processedIntegrations]);

  const {
    accessToken,
    processedIntegrations,
    topLevelChunkSize,
    topLevelOverlapSize,
    defaultChunkSize,
    defaultOverlapSize,
    authenticatedFetch,
  } = useCarbon();

  const fetchOauthURL = async () => {
    try {
      setIsLoading(true);
      const chunkSize =
        service?.chunkSize || topLevelChunkSize || defaultChunkSize;
      const overlapSize =
        service?.overlapSize || topLevelOverlapSize || defaultOverlapSize;
      const skipEmbeddingGeneration = service?.skipEmbeddingGeneration || false;

      const requestObject = {
        tags: tags,
        service: service?.data_source_type,
        chunk_size: chunkSize,
        chunk_overlap: overlapSize,
        skip_embedding_generation: skipEmbeddingGeneration,
        zendesk_subdomain: zendeskSubdomain,
      };

      const response = await authenticatedFetch(
        `${BASE_URL[environment]}/integrations/oauth_url`,
        {
          method: 'POST',
          headers: {
            Authorization: `Token ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestObject),
        }
      );

      if (response.status === 200) {
        onSuccess({
          status: 200,
          data: null,
          action: onSuccessEvents.INITIATE,
          event: onSuccessEvents.INITIATE,
          integration: 'ZENDESK',
        });
        setIsLoading(false);
        const oAuthURLResponseData = await response.json();
        window.open(oAuthURLResponseData.oauth_url, '_blank');
      }
    } catch (error) {
      toast.error('Error getting oAuth URL. Please try again.');
      setIsLoading(false);
      onError({
        status: 400,
        data: [{ message: 'Error getting oAuth URL. Please try again.' }],
        action: onSuccessEvents.ERROR,
        event: onSuccessEvents.ERROR,
        integration: 'ZENDESK',
      });
    }
  };

  return (
    <div className="cc-flex cc-flex-col cc-h-[540px] cc-items-center cc-relative">
      <Dialog.Title className="cc-text-lg cc-mb-4 cc-font-medium cc-w-full">
        <div className="cc-w-full cc-flex cc-items-center cc-space-x-4">
          {!entryPoint && (
            <HiArrowLeft
              onClick={() => setActiveStep(1)}
              className="cc-cursor-pointer cc-h-6 cc-w-6 cc-text-gray-400"
            />
          )}

          <div className="cc-flex cc-w-full">
            <h1 className="cc-text-lg cc-font-medium cc-text-gray-700">
              Zendesk
            </h1>
          </div>
        </div>
      </Dialog.Title>

      <>
        <div className="py-4 cc-flex cc-grow cc-w-full">
          <div className="cc-flex cc-flex-col cc-justify-start cc-h-full cc-items-start cc-w-full cc-space-y-4">
            <div className="cc-flex cc-space-x-2 cc-items-center cc-w-full cc-h-10">
              <input
                type="text"
                className="cc-p-2 cc-flex-grow cc-text-gray-700 cc-text-sm cc-border-4 cc-border-gray-400"
                style={{ borderRadius: '0.375rem' }}
                placeholder="Enter subdomain"
                value={zendeskSubdomain}
                onChange={(e) => setZendeskSubdomain(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button
          className={`cc-w-full cc-h-10 cc-flex cc-flex-row cc-items-center cc-justify-center cc-rounded-md cc-cursor-pointer cc-space-x-2`}
          style={{
            backgroundColor: submitButtonHoveredState
              ? darkenColor(primaryBackgroundColor, -10)
              : primaryBackgroundColor,
            color: primaryTextColor,
          }}
          onClick={fetchOauthURL}
          onMouseEnter={() => setSubmitButtonHoveredState(true)}
          onMouseLeave={() => setSubmitButtonHoveredState(false)}
        >
          {isLoading ? (
            <LuLoader2 className={`cc-animate-spin`} />
          ) : (
            <HiUpload />
          )}
          <p>Connect</p>
        </button>
      </>
    </div>
  );
}

export default ZendeskScreen;
