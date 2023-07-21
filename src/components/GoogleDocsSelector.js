// index.js
import '../index.css';

import React, { useEffect, useState } from 'react';
// Rest of the imports

import * as Dialog from '@radix-ui/react-dialog';
import { HiCheckCircle, HiXCircle, HiArrowLeft } from 'react-icons/hi';
import { BiLoaderAlt } from 'react-icons/bi';

import { BASE_URL } from '../constants';
import { useCarbonAuth } from '../contexts/AuthContext';

const GoogleDocsSelector = ({ integrationData, setActiveStep }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [syncResponse, setSyncResponse] = useState(null);
  const [isLoadedSyncedFiles, setIsLoadedSyncedFiles] = useState(false);
  const [alreadySyncedFiles, setAlreadySyncedFiles] = useState([]);

  const {
    accessToken,
    entryPoint,
    environment,
    tags,
    primaryBackgroundColor,
    primaryTextColor,
    secondaryBackgroundColor,
    secondaryTextColor,
    processedIntegrations,
    topLevelChunkSize,
    topLevelOverlapSize,
    defaultChunkSize,
    defaultOverlapSize,
    authenticatedFetch,
  } = useCarbonAuth();

  const syncSelectedFiles = async () => {
    const service = processedIntegrations.find(
      (integration) => integration.id === 'GOOGLE_DOCS'
    );
    const chunkSize =
      service?.chunkSize || topLevelChunkSize || defaultChunkSize;
    const overlapSize =
      service?.overlapSize || topLevelOverlapSize || defaultOverlapSize;

    const syncResponse = await authenticatedFetch(
      `${BASE_URL[environment]}/integrations/google/sync`,
      {
        method: 'POST',
        body: JSON.stringify({
          file_objects: integrationData.objects.filter((fileData) =>
            selectedFiles.includes(fileData.id)
          ),
          tags: tags,
          chunk_size: chunkSize,
          chunk_overlap: overlapSize,
        }),
        headers: {
          'Content-Type': 'application/json',
          authorization: `Token ${accessToken}`,
        },
      }
    );

    if (syncResponse.status === 200) {
      const syncResponseData = await syncResponse.json();
      setSyncResponse(syncResponseData);
      onSuccess({
        status: 200,
        data: uploadResponseData,
        action: 'UPDATE',
        integration: 'GOOGLE_DOCS',
      });
    }
  };

  useEffect(() => {
    const fetchAlreadySyncedFiles = async () => {
      setIsLoadedSyncedFiles(true);
      const syncedFileIdsResponse = await authenticatedFetch(
        `${BASE_URL[environment]}/user_files_v2`,
        {
          method: 'POST',
          body: JSON.stringify({
            pagination: {
              limit: 10,
              offset: 0,
            },
            order_by: 'updated_at',
            order_dir: 'desc',
            filters: { source: 'GOOGLE_DOCS' },
          }),
          headers: {
            'Content-Type': 'application/json',
            authorization: `Token ${accessToken}`,
          },
        }
      );

      if (syncedFileIdsResponse.status === 200) {
        const syncedFileIdsData = await syncedFileIdsResponse.json();
        const alreadySyncedFiles = syncedFileIdsData.results.map(
          (fileData) => fileData.external_file_id
        );
        setAlreadySyncedFiles(alreadySyncedFiles);
        setSelectedFiles(alreadySyncedFiles);
        setIsLoadedSyncedFiles(false);
      }
    };

    fetchAlreadySyncedFiles();
  }, []);

  return (
    <div className="cc-flex cc-flex-col cc-h-[540px] cc-items-center">
      <Dialog.Title className="cc-text-lg cc-mb-4 cc-font-medium cc-w-full">
        <div className="cc-w-full cc-flex cc-items-center cc-space-x-4">
          {!entryPoint && (
            <HiArrowLeft
              onClick={() => setActiveStep(1)}
              className="cc-cursor-pointer cc-h-6 cc-w-6 cc-text-gray-400"
            />
          )}
          <h1>Select Files</h1>
        </div>
      </Dialog.Title>
      {isLoadedSyncedFiles ? (
        <div className="cc-h-full cc-w-full cc-items-center cc-justify-center cc-flex">
          <BiLoaderAlt className="cc-animate-spin cc-text-5xl" />
        </div>
      ) : (
        <>
          {!syncResponse && (
            <>
              <div className="cc-flex cc-flex-col cc-space-y-3 cc-w-full cc-py-2 cc-overflow-y-auto">
                {integrationData.objects.map((fileData) => {
                  const isSelected = selectedFiles.includes(fileData.id);

                  return (
                    <div
                      key={fileData.id}
                      className={`cc-border cc-rounded-md cc-h-fit cc-items-center cc-p-4 cc-w-full cc-cursor-pointer cc-flex cc-flex-row`}
                      style={{
                        backgroundColor: isSelected
                          ? secondaryBackgroundColor
                          : '#ffffff',
                        color: isSelected ? secondaryTextColor : '#000000',
                      }}
                      onClick={() => {
                        setSelectedFiles((prev) => {
                          if (prev.includes(fileData.id)) {
                            return prev.filter((id) => id !== fileData.id);
                          } else {
                            return [...prev, fileData.id];
                          }
                        });
                      }}
                    >
                      <h1 className="cc-text-md cc-font-normal cc-grow">
                        {fileData.name}
                      </h1>
                      {isSelected && (
                        <HiCheckCircle className="cc-text-green-500 cc-w-6 cc-h-6" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="cc-flex cc-flex-col cc-h-full cc-space-y-2 cc-w-full">
                <button
                  className="cc-w-full cc-h-12 cc-flex cc-flex-row cc-items-center cc-justify-center cc-rounded-md cc-cursor-pointer"
                  style={{
                    backgroundColor: primaryBackgroundColor,
                    color: primaryTextColor,
                  }}
                  onClick={() => syncSelectedFiles()}
                >
                  Sync Files
                </button>
              </div>
            </>
          )}

          {syncResponse && (
            <div className="cc-flex cc-flex-col cc-space-y-3 cc-w-full cc-py-2 cc-overflow-y-auto cc-h-full cc-items-center cc-text-xl cc-justify-center">
              {syncResponse.code === 200 ? (
                <HiCheckCircle className="cc-text-green-500 cc-w-8 cc-h-8" />
              ) : (
                <HiXCircle className="cc-text-red-500 cc-w-8 cc-h-8" />
              )}
              <p>{syncResponse.message}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GoogleDocsSelector;
