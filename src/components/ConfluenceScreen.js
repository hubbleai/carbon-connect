import React, { useEffect, useState } from 'react';

import { darkenColor } from '../utils/helpers';

import * as Dialog from '@radix-ui/react-dialog';
import { HiArrowLeft, HiUpload, HiInformationCircle } from 'react-icons/hi';
import { SiConfluence } from 'react-icons/si';
import { toast } from 'react-toastify';

import '../index.css';
import { BASE_URL, onSuccessEvents } from '../constants';
import { LuLoader2 } from 'react-icons/lu';
import { useCarbon } from '../contexts/CarbonContext';

function ConfluenceScreen({
  setActiveStep,
  entryPoint,
  environment,
  tags,
  onSuccess,
  onError,
  primaryBackgroundColor,
  primaryTextColor,
}) {
  const [confluenceSubdomain, setConfluenceSubdomain] = useState('');
  const [submitButtonHoveredState, setSubmitButtonHoveredState] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [service, setService] = useState(null);

  useEffect(() => {
    setService(
      processedIntegrations.find(
        (integration) => integration.id === 'CONFLUENCE'
      )
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
    secondaryBackgroundColor,
    secondaryTextColor,
  } = useCarbon();

  const fetchOauthURL = async () => {
    try {
      if (!confluenceSubdomain) {
        toast.error('Please enter a subdomain.');
        return;
      }
      setIsLoading(true);
      const chunkSize =
        service?.chunkSize || topLevelChunkSize || defaultChunkSize;
      const overlapSize =
        service?.overlapSize || topLevelOverlapSize || defaultOverlapSize;
      const skipEmbeddingGeneration = service?.skipEmbeddingGeneration || false;
      const subdomain = confluenceSubdomain
        .replace('https://www.', '')
        .replace('http://www.', '')
        .replace('https://', '')
        .replace('http://', '')
        .replace('.confluence.com', '')
        .replace(/\/$/, '')
        .trim();

      const requestObject = {
        tags: tags,
        service: service?.data_source_type,
        chunk_size: chunkSize,
        chunk_overlap: overlapSize,
        skip_embedding_generation: skipEmbeddingGeneration,
        confluence_subdomain: subdomain,
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
          integration: 'CONFULENCE',
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
        integration: 'CONFULENCE',
      });
    }
  };

  return (
    <div className="cc-flex cc-flex-col cc-h-[540px] cc-items-center cc-relative">
      <Dialog.Title className="cc-text-lg cc-mb-4 cc-font-medium cc-w-full">
        <div className="cc-w-full cc-flex cc-items-center cc-relative cc-justify-center">
          {/* {!entryPoint && (
            <HiArrowLeft
              onClick={() => setActiveStep(1)}
              className="cc-cursor-pointer cc-h-6 cc-w-6 cc-text-gray-400 cc-absolute cc-left-0"
            />
          )} */}
          <HiArrowLeft
            onClick={() => setActiveStep(entryPoint ? 0 : 1)}
            className="cc-cursor-pointer cc-h-6 cc-w-6 cc-text-gray-400 cc-absolute cc-left-0"
          />
          <SiConfluence className="cc-text-3xl cc-text-black" />
        </div>
      </Dialog.Title>

      <>
        <div className="py-4 cc-flex cc-grow cc-w-full">
          <div className="cc-flex cc-flex-col cc-justify-start cc-h-full cc-items-start cc-w-full cc-space-y-4">
            <span className="cc-text-sm">
              Please enter the Confluence{' '}
              <span className="cc-bg-gray-200 cc-px-1 cc-py-0.5 cc-rounded cc-font-mono cc-text-red-400">
                your-subdomain
              </span>{' '}
              of the account you wish to connect.
            </span>

            <div className="cc-flex cc-space-x-2 cc-items-center cc-w-full cc-h-10">
              <input
                type="text"
                className="cc-p-2 cc-flex-grow cc-text-gray-700 cc-text-sm cc-border-4 cc-border-gray-400"
                style={{ borderRadius: '0.375rem' }}
                placeholder="your-subdomain.confluence.com"
                value={confluenceSubdomain}
                onChange={(e) => setConfluenceSubdomain(e.target.value)}
              />
            </div>
          </div>
        </div>
        <p
          className="cc-flex cc-text-gray-500 cc-p-2 cc-space-x-2 cc-bg-gray-100 cc-rounded-md cc-mb-2 cc-items-center"
          style={{
            color: secondaryTextColor,
            backgroundColor: secondaryBackgroundColor,
          }}
        >
          <HiInformationCircle className="cc-w-8 cc-h-8" />
          <span className="text-xs">
            By connecting to Confluence, you are providing us with access to
            your Confluence profile and Help Center articles.
          </span>
        </p>

        <button
          className={`cc-w-full cc-h-12 cc-flex cc-flex-row cc-items-center cc-justify-center cc-rounded-md cc-cursor-pointer cc-space-x-2`}
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

export default ConfluenceScreen;
