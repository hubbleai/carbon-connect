import React, { useState } from 'react';

import { FileUploader } from 'react-drag-drop-files';
import axios from 'axios';
import * as Dialog from '@radix-ui/react-dialog';
import { HiXCircle, HiCheckCircle, HiArrowLeft } from 'react-icons/hi';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { toast } from 'react-toastify';

import '../index.css';

const fileTypes = ['txt', 'csv'];

function FileUpload({ setActiveStep, apikey, userid }) {
  const [file, setFile] = useState(null);
  const [syncResponse, setSyncResponse] = useState(null);

  const uploadSelectedFile = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await axios.post(
        // `https://api.dev.carbon.ai/uploadfile`,
        'http://localhost:8000/uploadfile',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${apikey}`,
            'customer-id': userid,
          },
        }
      );

      if (uploadResponse.status === 200 && uploadResponse.data) {
        setSyncResponse(uploadResponse.data);
        // console.log('Sync Response: ', syncResponse.data);
        // if (syncResponse.data.status === 200) {
        //   setActiveStep(2);

        // }
        // setActiveStep(2);
      }
    } catch (err) {
      console.log(err);
      toast.error('Error uploading file');
    }
  };

  return (
    <div className="flex flex-col h-[540px] items-center relative">
      <Dialog.Title className="text-lg mb-4 font-medium w-full">
        <div className="w-full flex items-center space-x-4">
          <HiArrowLeft
            onClick={() => setActiveStep(1)}
            className="cursor-pointer h-6 w-6 text-gray-400"
          />
          <h1>Upload Files</h1>
        </div>
      </Dialog.Title>
      {!syncResponse && (
        <div className="w-full h-full flex-col flex space-y-4 justify-between">
          <FileUploader
            multiple={false}
            handleChange={setFile}
            name="file"
            types={fileTypes}
            maxSize="9.5"
            label="Upload or drag a file here to embed."
          >
            <div className="flex py-2 h-40 w-full flex mt-4 mb-1 cursor-pointer text-center border rounded-lg justify-center items-center gap-x-2  overflow-hidden text-black space-x-2">
              <div>
                <AiOutlineCloudUpload className="w-6 h-6 mb-4 mx-auto" />
                <p className="text-[#484848]">
                  Upload .txt, .pdf, or .csv files
                </p>
                <p className="text-[#919191]">
                  Max 3 MB per File (20 MB total)
                </p>
              </div>
            </div>
          </FileUploader>

          {file && (
            <table class="my-3 w-full bg-blue-400/20">
              <tr>
                <td class="py-2 px-4">Name:</td>
                <td class="py-2 px-4 break-words text-left">{file.name}</td>
              </tr>
              <tr>
                <td class="py-2 px-4">Size:</td>
                <td class="py-2 px-4 text-left">{`${parseFloat(
                  file.size / 1024
                ).toFixed(2)} KB`}</td>
              </tr>
              <tr>
                <td class="py-2 px-4">File Type:</td>
                <td class="py-2 px-4 text-left">{file.type}</td>
              </tr>
            </table>
          )}

          <div className="flex flex-col h-full space-y-2 w-full">
            <button
              className="w-full h-12 flex flex-row bg-black text-white items-center justify-center rounded-md cursor-pointer"
              onClick={() => {
                if (file) uploadSelectedFile();
                else toast.error('Please select a file to upload');
              }}
            >
              Upload File
            </button>
          </div>
        </div>
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
}

export default FileUpload;
