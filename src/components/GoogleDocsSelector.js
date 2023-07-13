// index.js
import '../index.css';

import React, { useState } from 'react';
// Rest of the imports

import * as Dialog from '@radix-ui/react-dialog';
import { HiCheckCircle, HiXCircle, HiArrowLeft } from 'react-icons/hi';

import { BASE_URL } from '../constants';
import { useCarbonAuth } from '../contexts/AuthContext';

const GoogleDocsSelector = ({
  integrationData,
  setActiveStep,
  token,
  userid,
  entryPoint,
  environment,
  tags,
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [syncResponse, setSyncResponse] = useState(null);
  const { accessToken, setAccessToken } = useCarbonAuth();

  const syncSelectedFiles = async () => {
    const syncResponse = await fetch(
      `${BASE_URL[environment]}/integrations/google/sync`,
      {
        method: 'POST',
        body: JSON.stringify({
          file_objects: integrationData.objects.filter((fileData) =>
            selectedFiles.includes(fileData.id)
          ),
          tags: tags,
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
    }
  };

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
      {!syncResponse && (
        <>
          <div className="cc-flex cc-flex-col cc-space-y-3 cc-w-full cc-py-2 cc-overflow-y-auto">
            {integrationData.objects.map((fileData) => {
              const isSelected = selectedFiles.includes(fileData.id);

              return (
                <div
                  key={fileData.id}
                  className={`cc-border cc-rounded-md cc-h-fit cc-items-center cc-p-4 cc-w-full cc-cursor-pointer ${
                    isSelected
                      ? 'cc-bg-green-200'
                      : 'cc-bg-white hover:cc-bg-gray-100'
                  }`}
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
                  <h1 className="cc-text-md cc-font-normal">{fileData.name}</h1>
                </div>
              );
            })}
          </div>

          <div className="cc-flex cc-flex-col cc-h-full cc-space-y-2 cc-w-full">
            <button
              className="cc-w-full cc-h-12 cc-flex cc-flex-row cc-bg-black cc-text-white cc-items-center cc-justify-center cc-rounded-md cc-cursor-pointer"
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
    </div>
  );
};

export default GoogleDocsSelector;
