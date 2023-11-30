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

const DEFAULT_RECURSION_DEPTH = 3;
const DEFAULT_MAX_PAGES_TO_SCRAPE = 100;

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
  backButtonText,
}) {
  const MAX_URLS = 2;
  const [submitButtonHoveredState, setSubmitButtonHoveredState] =
    useState(false);
  const [fetchButtonHoveredState, setFetchButtonHoveredState] = useState(false);

  // These will be used to store the list of URLs to be scraped.
  const [urls, setUrls] = useState(['']); // List of URLs to be scraped.
  const [sitemapUrls, setSitemapUrls] = useState([]); // List of URLs to be scraped selected from the sitemap.

  const [areUrlsProvided, setAreUrlsProvided] = useState(false); // Flag to check if the user has provided any URLs to be scraped.
  const [areSitemapUrlsProvided, setAreSitemapUrlsProvided] = useState(false); // Flag to check if the user has provided any URLs to be scraped from the sitemap.

  const [scrapingResponse, setScrapingResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('webpages');
  const [sitemapUrl, setSitemapUrl] = useState('');

  const [sitemapUrlsLoading, setSitemapUrlsLoading] = useState(false);
  const [sitemapUrlsError, setSitemapUrlsError] = useState(null);
  const [selectedUrlIds, setSelectedUrlIds] = useState([]);
  const [selectAllUrls, setSelectAllUrls] = useState(false);
  const [service, setService] = useState(null);

  useEffect(() => {
    setService(
      processedIntegrations.find(
        (integration) => integration.id === 'WEB_SCRAPER'
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
    navigateBackURL,
    manageModalOpenState,
  } = useCarbon();

  const submitScrapeRequest = async () => {
    try {
      if (isLoading === true) {
        toast.error('Please wait for the scraping request is processing');
        return;
      }

      // const service = processedIntegrations.find(
      //   (integration) => integration.id === 'WEB_SCRAPER'
      // );
      const chunkSize =
        service?.chunkSize || topLevelChunkSize || defaultChunkSize;
      const overlapSize =
        service?.overlapSize || topLevelOverlapSize || defaultOverlapSize;
      const recursionDepth = service?.recursionDepth || DEFAULT_RECURSION_DEPTH;
      const maxPagesToScrape =
        service?.maxPagesToScrape || DEFAULT_MAX_PAGES_TO_SCRAPE;
      const skipEmbeddingGeneration = service?.skipEmbeddingGeneration || false;
      const enableAutoSync = service?.enableAutoSync || false;

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

      const selectedSitemapUrls = sitemapUrls.filter((url, idx) =>
        selectedUrlIds.includes(idx)
      );

      let validUrls =
        activeTab === 'sitemap'
          ? selectedSitemapUrls
          : urls.filter((url) => urlPattern.test(url));

      if (validUrls.length === 0) {
        toast.error('Please provide at least one valid URL.');
        setIsLoading(false);
        return;
      }

      const requestObject =
        activeTab === 'sitemap'
          ? selectedSitemapUrls.map((url) => ({
              url: url,
              tags: tags,
              recursion_depth: 1,
              max_pages_to_scrape: 1,
              chunk_size: chunkSize,
              chunk_overlap: overlapSize,
              skip_embedding_generation: skipEmbeddingGeneration,
              enable_auto_sync: enableAutoSync,
            }))
          : validUrls.map((url) => ({
              url: url,
              tags: tags,
              recursion_depth: recursionDepth,
              max_pages_to_scrape: maxPagesToScrape,
              chunk_size: chunkSize,
              chunk_overlap: overlapSize,
              skip_embedding_generation: skipEmbeddingGeneration,
              enable_auto_sync: enableAutoSync,
            }));

      const uploadResponse = await authenticatedFetch(
        `${BASE_URL[environment]}/web_scrape`,
        {
          method: 'POST',
          headers: {
            Authorization: `Token ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestObject),
        }
      );

      if (uploadResponse.status === 200) {
        const responseData = await uploadResponse.json();
        setScrapingResponse('Scraping request initiated successfully.');
        onSuccess({
          status: 200,
          data: {
            data_source_external_id: null,
            sync_status: null,
            files: responseData,
          },
          action: onSuccessEvents.UPDATE,
          event: onSuccessEvents.UPDATE,
          integration: 'WEB_SCRAPER',
        });
      }
    } catch (error) {
      toast.error('Error initiating scraping. Please try again.');
      setIsLoading(false);
      onError({
        status: 400,
        data: [{ message: 'Error initiating scraping. Please try again.' }],
        action: onSuccessEvents.UPDATE,
        event: onSuccessEvents.UPDATE,
        integration: 'WEB_SCRAPER',
      });
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

  const handleSitemapUrlChange = (url) => {
    setSitemapUrl(url);
  };

  const handleFetchSitemapUrls = async () => {
    try {
      if (!sitemapUrl) {
        toast.error('Please provide a valid sitemap URL.');
        return;
      }
      setSitemapUrlsLoading(true);
      const response = await authenticatedFetch(
        `${BASE_URL[environment]}/process_sitemap?url=${sitemapUrl}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Token ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        const responseData = await response.json();
        setSitemapUrls(responseData.urls);
        setSitemapUrlsLoading(false);
      } else {
        throw new Error('Error fetching sitemap. Please try again.');
      }
    } catch (error) {
      setSitemapUrlsLoading(false);
      toast.error('Error fetching sitemap. Please try again.');
      setSitemapUrlsError('Error fetching sitemap. Please try again.');
    }
  };

  const handleRemoveUrl = (url_index) => {
    setUrls((prevList) => {
      let newUrls = [...prevList];
      newUrls.splice(url_index, 1);
      return newUrls;
    });
  };

  const navigateBack = () => {
    if (navigateBackURL) window.open(navigateBackURL, '_self');
    else manageModalOpenState(false);
  };

  return (
    <div className="cc-flex cc-flex-col cc-h-full cc-items-center cc-relative cc-p-4">
      <Dialog.Title className="cc-text-lg cc-mb-4 cc-font-medium cc-w-full">
        <div className="cc-w-full cc-flex cc-items-center cc-space-x-4">
          {!entryPoint && (
            <HiArrowLeft
              onClick={() => setActiveStep(1)}
              className="cc-cursor-pointer cc-h-6 cc-w-6 cc-text-gray-400"
            />
          )}

          <div className="cc-flex cc-w-full">
            <div
              onClick={() => setActiveTab('webpages')}
              className={`cc-flex cc-py-2 cc-px-4 cc-w-1/2 cc-rounded-t-md cc-text-center cc-cursor-pointer ${
                activeTab === 'webpages'
                  ? 'cc-border-b-2 cc-font-bold'
                  : 'cc-border-b cc-font-normal'
              } cc-items-center cc-space-x-2 cc-justify-center`}
              style={{
                color:
                  activeTab === 'webpages' ? primaryBackgroundColor : 'black',
              }}
            >
              <FaLaptop />
              <p>Website</p>
            </div>
            <div
              onClick={() => setActiveTab('sitemap')}
              className={`cc-flex cc-py-2 cc-px-4 cc-w-1/2 cc-rounded-t-md cc-text-center cc-cursor-pointer ${
                activeTab === 'sitemap'
                  ? 'cc-border-b-2 cc-font-bold'
                  : 'cc-border-b cc-font-normal'
              } cc-items-center cc-space-x-2 cc-justify-center`}
              style={{
                color:
                  activeTab === 'sitemap' ? primaryBackgroundColor : 'black',
              }}
            >
              <FaSitemap />
              <p>Sitemap</p>
            </div>
          </div>
        </div>
      </Dialog.Title>

      {!scrapingResponse && (
        <>
          <div className="py-4 cc-flex cc-grow cc-w-full">
            {activeTab === 'webpages' && (
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
            )}
            {activeTab === 'sitemap' && (
              <div className="cc-flex cc-flex-col cc-justify-start cc-h-full cc-items-start cc-w-full cc-space-y-4">
                <div className="cc-flex cc-space-x-2 cc-items-center cc-w-full cc-h-10">
                  <input
                    type="text"
                    className="cc-p-2 cc-flex-grow cc-text-gray-700 cc-text-sm cc-border-4 cc-border-gray-400"
                    style={{ borderRadius: '0.375rem' }}
                    placeholder="Enter Sitemap URL"
                    value={sitemapUrl}
                    onChange={(e) => handleSitemapUrlChange(e.target.value)}
                  />
                  <div
                    className="cc-text-sm cc-border cc-border-gray-400 cc-w-14 cc-h-10 cc-p-2 cc-cursor-pointer cc-items-center"
                    onClick={handleFetchSitemapUrls}
                    style={{
                      backgroundColor: fetchButtonHoveredState
                        ? darkenColor(primaryBackgroundColor, -10)
                        : primaryBackgroundColor,
                      color: primaryTextColor,
                      borderRadius: '0.375rem',
                    }}
                    onMouseEnter={() => setFetchButtonHoveredState(true)}
                    onMouseLeave={() => setFetchButtonHoveredState(false)}
                  >
                    Fetch
                  </div>
                </div>

                <div className="cc-w-full cc-h-70 cc-overflow-y-auto">
                  {sitemapUrlsLoading && (
                    <div className="cc-h-full cc-w-full cc-items-center cc-justify-center cc-flex">
                      <BiLoaderAlt className="cc-animate-spin cc-text-5xl" />
                    </div>
                  )}
                  {sitemapUrlsError && (
                    <div className="cc-h-full cc-w-full cc-items-center cc-justify-center cc-flex cc-flex-col cc-pt-8">
                      <div className="cc-flex cc-w-full">
                        <HiXCircle className="cc-text-red-500 cc-w-6 cc-h-6" />
                        <p className="cc-text-center">{sitemapUrlsError}</p>
                      </div>
                    </div>
                  )}
                  {sitemapUrls.length > 0 && (
                    <>
                      <div className="cc-flex cc-flex-row cc-items-center cc-w-full cc-h-10 cc-p-2 cc-bg-gray-200 cc-space-x-2">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            // const service = processedIntegrations.find(
                            //   (integration) => integration.id === 'WEB_SCRAPER'
                            // );
                            const maxPagesToScrape =
                              service?.maxPagesToScrape ||
                              DEFAULT_MAX_PAGES_TO_SCRAPE;
                            if (e.target.checked) {
                              if (sitemapUrls.length > maxPagesToScrape) {
                                toast.error(
                                  `You can select a maximum of ${maxPagesToScrape} URLs.`
                                );
                                return;
                              }
                              setSelectAllUrls(true);
                              setSelectedUrlIds(
                                sitemapUrls.map((url, idx) => idx)
                              );
                            } else {
                              setSelectAllUrls(false);
                              setSelectedUrlIds([]);
                            }
                          }}
                          checked={selectAllUrls}
                        />
                        <p className="cc-text-sm cc-text-gray-700 cc-font-bold cc-w-full">
                          URLs
                        </p>
                      </div>
                      <div className="cc-flex cc-flex-col cc-justify-start cc-h-64 cc-items-start cc-w-full cc-space-y-4">
                        {sitemapUrls.map((url, idx) => (
                          <div
                            key={idx}
                            className="cc-flex cc-space-x-2 cc-items-center cc-w-full cc-h-10 cc-p-2"
                          >
                            <input
                              type="checkbox"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedUrlIds((prevList) => [
                                    ...prevList,
                                    idx,
                                  ]);
                                } else {
                                  setSelectedUrlIds((prevList) => {
                                    let newIdsList = [...prevList];
                                    newIdsList.splice(
                                      newIdsList.indexOf(idx),
                                      1
                                    );
                                    setSelectAllUrls(false);
                                    return newIdsList;
                                  });
                                }
                              }}
                              checked={selectedUrlIds.includes(idx)}
                            />
                            <p className="cc-text-sm cc-text-gray-700">{url}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <p className="cc-flex cc-text-gray-500 cc-pb-2 cc-space-x-2">
            <HiInformationCircle className="cc-w-4 cc-h-4" />
            {activeTab === 'sitemap' ? (
              <span className="text-xs">{`Select a max of ${
                service?.maxPagesToScrape || DEFAULT_MAX_PAGES_TO_SCRAPE
              } links to sync.`}</span>
            ) : (
              <span className="text-xs">{`The first ${
                service?.maxPagesToScrape || DEFAULT_MAX_PAGES_TO_SCRAPE
              } links per website are synced.`}</span>
            )}
          </p>
          <button
            className={`cc-w-full cc-h-10 cc-flex cc-flex-row cc-items-center cc-justify-center cc-rounded-md cc-cursor-pointer cc-space-x-2`}
            style={{
              backgroundColor: submitButtonHoveredState
                ? darkenColor(primaryBackgroundColor, -10)
                : primaryBackgroundColor,
              color: primaryTextColor,
            }}
            onClick={submitScrapeRequest}
            onMouseEnter={() => setSubmitButtonHoveredState(true)}
            onMouseLeave={() => setSubmitButtonHoveredState(false)}
          >
            {isLoading ? (
              <LuLoader2 className={`cc-animate-spin`} />
            ) : (
              <HiUpload />
            )}
            <p>Submit</p>
          </button>
          {entryPoint && (
            <p
              className="cc-flex cc-flex-row cc-items-center cc-justify-center cc-cursor-pointer cc-text-xs hover:cc-underline cc-pt-2"
              style={{
                color: secondaryTextColor,
              }}
              onClick={navigateBack}
            >
              {backButtonText || 'Go back'}
            </p>
          )}
        </>
      )}

      {scrapingResponse && (
        <div className="cc-flex cc-flex-col cc-space-y-3 cc-w-full cc-py-2 cc-overflow-y-auto cc-h-full cc-items-center cc-text-xl cc-justify-center">
          {scrapingResponse ? (
            <>
              <HiCheckCircle className="cc-text-green-500 cc-w-8 cc-h-8" />
              <p className="cc-text-center">
                {scrapingResponse?.message || scrapingResponse}
              </p>
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
