import React, { useEffect, useState } from 'react';

import * as Dialog from '@radix-ui/react-dialog';
import {
  HiXCircle,
  HiCheckCircle,
  HiArrowLeft,
  HiUpload,
  HiX,
  HiPlus,
  HiTrash,
} from 'react-icons/hi';

import { toast } from 'react-toastify';

import '../index.css';
import { BASE_URL } from '../constants';
import { LuLoader2 } from 'react-icons/lu';
import { useCarbonAuth } from '../contexts/AuthContext';

function WebScraper({
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
  const MAX_URLS = 5;
  const [urls, setUrls] = useState(['']);
  const [scrapingResponse, setScrapingResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    accessToken,
    processedIntegrations,
    topLevelChunkSize,
    topLevelOverlapSize,
    defaultChunkSize,
    defaultOverlapSize,
  } = useCarbonAuth();

  const submitScrapeRequest = async () => {
    try {
      if (isLoading === true) {
        toast.error('Please wait for the scraping request is processing');
        return;
      }

      const service = processedIntegrations.find(
        (integration) => integration.id === 'WEB_SCRAPER'
      );
      const chunkSize =
        service?.chunkSize || topLevelChunkSize || defaultChunkSize;
      const overlapSize =
        service?.overlapSize || topLevelOverlapSize || defaultOverlapSize;

      setIsLoading(true);
      const urlPattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
          '(\\#[-a-z\\d_]*)?$',
        'i'
      ); // fragment locator

      let validUrls = urls.filter((url) => urlPattern.test(url));

      if (validUrls.length === 0) {
        toast.error('Please provide at least one valid URL.');
        setIsLoading(false);
        return;
      }

      const uploadResponse = await fetch(
        `${BASE_URL[environment]}/integrations/web_scrape`,
        {
          method: 'POST',
          headers: {
            Authorization: `Token ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            urls: validUrls,
            tags: tags,
            repeat: false,
            repeat_interval: 0,
            chunk_size: chunkSize,
            overlap_size: overlapSize,
          }),
        }
      );

      if (uploadResponse.status === 200) {
        const uploadResponseData = await uploadResponse.json();
        setScrapingResponse(uploadResponseData);
      }
    } catch (error) {
      toast.error('Error initiating scraping. Please try again.');
      setIsLoading(false);
      onError({ status: 400, data: [{ message: 'Error uploading file' }] });
      setScrapingResponse(null);
    }
  };

  const handleAddUrl = () => {
    setUrls((prevList) => [...prevList, '']);
  };

  const handleUrlChange = (url_index, url) => {
    setUrls((prevvList) => {
      let newUrls = [...prevvList];
      newUrls[url_index] = url;
      return newUrls;
    });
  };

  const handleRemoveUrl = (url_index) => {
    setUrls((prevList) => {
      let newUrls = [...prevList];
      newUrls.splice(url_index, 1);
      return newUrls;
    });
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
          <h1>Web Scraper</h1>
        </div>
      </Dialog.Title>
      {!scrapingResponse && (
        <div className="cc-w-full cc-h-full cc-flex-col cc-flex cc-space-y-4 cc-justify-between">
          <div className="cc-flex cc-flex-col cc-justify-start cc-h-full cc-items-start cc-w-full cc-space-y-4">
            {urls.map((url, idx) => (
              <div
                key={idx}
                className="cc-flex cc-space-x-2 cc-items-center cc-w-full cc-h-10"
              >
                <input
                  type="text"
                  className="cc-p-2 cc-flex-grow cc-text-gray-700 cc-text-sm cc-border-4 cc-border-gray-400"
                  style={{ borderRadius: '0.375rem' }}
                  placeholder="Enter URL"
                  value={url}
                  onChange={(e) => handleUrlChange(idx, e.target.value)}
                />
                <HiX
                  className=" cc-text-red-400 cc-text-sm cc-border cc-border-gray-400 cc-w-10 cc-h-10 cc-p-2 cc-cursor-pointer hover:cc-bg-gray-200 hover:cc-border-0"
                  style={{ borderRadius: '0.375rem' }}
                  onClick={() => handleRemoveUrl(idx)}
                />
              </div>
            ))}
            {urls.length < MAX_URLS && (
              <button
                className={`cc-w-fit cc-h-10 cc-flex cc-flex-row cc-items-center cc-justify-center cc-rounded-md cc-cursor-pointer cc-space-x-2 cc-px-4`}
                style={{
                  backgroundColor: secondaryBackgroundColor,
                  color: secondaryTextColor,
                }}
                onClick={handleAddUrl}
              >
                <HiPlus className="inline-block mr-2" />
                Add
              </button>
            )}
          </div>
          <button
            className={`cc-w-full cc-h-12 cc-flex cc-flex-row cc-items-center cc-justify-center cc-rounded-md cc-cursor-pointer cc-space-x-2`}
            style={{
              backgroundColor: primaryBackgroundColor,
              color: primaryTextColor,
            }}
            onClick={submitScrapeRequest}
          >
            {isLoading ? (
              <LuLoader2 className={`cc-animate-spin`} />
            ) : (
              <HiUpload />
            )}
            <p>Submit</p>
          </button>
        </div>
      )}

      {scrapingResponse && (
        <div className="cc-flex cc-flex-col cc-space-y-3 cc-w-full cc-py-2 cc-overflow-y-auto cc-h-full cc-items-center cc-text-xl cc-justify-center">
          {scrapingResponse ? (
            <>
              <HiCheckCircle className="cc-text-green-500 cc-w-8 cc-h-8" />
              <p className="cc-text-center">{scrapingResponse.message}</p>
            </>
          ) : (
            <>
              <HiXCircle className="cc-text-red-500 cc-w-8 cc-h-8" />
              <p className="cc-text-center">
                {`There is an error uploading your file. Please try again later.`}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default WebScraper;
