// index.js
import '../index.css';

import React, { useState } from 'react';
// Rest of the imports

import * as Dialog from '@radix-ui/react-dialog';
import { HiCheckCircle, HiXCircle, HiArrowLeft } from 'react-icons/hi';

import axios from 'axios';

const GoogleDocsSelector = ({
  integrationData,
  setActiveStep,
  apikey,
  userid,
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [syncResponse, setSyncResponse] = useState(null);

  const syncSelectedFiles = async () => {
    const syncResponse = await axios.post(
      //   `https://api.dev.carbon.ai/integrations/google/sync`,
      `http://localhost:8000/integrations/google/sync`,
      {
        user_id: userid,
        api_key: apikey,
        file_ids: selectedFiles,
      }
    );

    if (syncResponse.status === 200 && syncResponse.data) {
      setSyncResponse(syncResponse.data);
      // console.log('Sync Response: ', syncResponse.data);
      // if (syncResponse.data.status === 200) {
      //   setActiveStep(2);

      // }
      // setActiveStep(2);
    }
  };

  return (
    <div className="flex flex-col h-[540px] items-center">
      <Dialog.Title className="text-lg mb-4 font-medium w-full">
        <div className="w-full flex items-center space-x-4">
          <HiArrowLeft
            onClick={() => setActiveStep(1)}
            className="cursor-pointer h-6 w-6 text-gray-400"
          />
          <h1>Select Files</h1>
        </div>
      </Dialog.Title>
      {!syncResponse && (
        <>
          <div className="flex flex-col space-y-3 w-full py-2 overflow-y-auto">
            {integrationData.token.all_files.map((fileData) => {
              const isSelected = selectedFiles.includes(fileData.id);

              return (
                <div
                  key={fileData.id}
                  className={`border rounded-md h-fit items-center p-4 w-full cursor-pointer ${
                    isSelected ? 'bg-green-200' : 'bg-white hover:bg-gray-100'
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
                  <h1 className="text-md font-normal">{fileData.name}</h1>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col h-full space-y-2 w-full">
            <button
              className="w-full h-12 flex flex-row bg-black text-white items-center justify-center rounded-md cursor-pointer"
              onClick={() => syncSelectedFiles()}
            >
              Sync Files
            </button>
          </div>
        </>
      )}

      {syncResponse && (
        <div className="flex flex-col space-y-3 w-full py-2 overflow-y-auto h-full items-center text-xl justify-center">
          {syncResponse.code === 200 ? (
            <HiCheckCircle className="text-green-500 w-8 h-8" />
          ) : (
            <HiXCircle className="text-red-500  w-8 h-8" />
          )}
          <p>{syncResponse.message}</p>
        </div>
      )}
    </div>
  );
};

export default GoogleDocsSelector;
