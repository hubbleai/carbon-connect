import React, { useState } from 'react';

import { FileUploader } from 'react-drag-drop-files';
import axios from 'axios';
import * as Dialog from '@radix-ui/react-dialog';
import {
  HiXCircle,
  HiCheckCircle,
  HiArrowLeft,
  HiUpload,
} from 'react-icons/hi';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { toast } from 'react-toastify';

import '../index.css';
import { BASE_URL } from '../constants';
import { LuLoader2 } from 'react-icons/lu';

const fileTypes = ['txt', 'csv', 'pdf'];

function FileUpload({ setActiveStep, token, userid, entryPoint, environment }) {
  const [file, setFile] = useState(null);
  const [syncResponse, setSyncResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadSelectedFile = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await axios.post(
        // `https://api.dev.carbon.ai/uploadfile`,
        // 'http://localhost:8000/uploadfile',
        `${BASE_URL[environment]}/uploadfile`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
            'customer-id': userid,
          },
        }
      );

      if (uploadResponse.status === 200 && uploadResponse.data) {
        setSyncResponse(uploadResponse.data);
        toast.success('Successfully uploaded file');
        setIsLoading(false);
      }
    } catch (err) {
      console.log(err);
      toast.error('Error uploading file');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[540px] items-center relative">
      <Dialog.Title className="text-lg mb-4 font-medium w-full">
        <div className="w-full flex items-center space-x-4">
          {!entryPoint && (
            <HiArrowLeft
              onClick={() => setActiveStep(1)}
              className="cursor-pointer h-6 w-6 text-gray-400"
            />
          )}
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
            maxSize="20"
            label="Upload or drag a file here to embed."
          >
            <div className="rounded-lg flex py-2 h-60 w-full mt-4 mb-1 cursor-pointer text-center border justify-center items-center gap-x-2  overflow-hidden text-black space-x-2">
              <div>
                <AiOutlineCloudUpload className="w-10 text-[#484848] h-10 mb-4 mx-auto" />
                <p className="text-[#484848]">Upload a TXT, PDF or CSV File.</p>
                <p className="text-[#919191]">Max 20 MB per File</p>
              </div>
            </div>
          </FileUploader>

          {file && (
            <table class="my-3 w-full rounded-lg bg-blue-400/20 items-center">
              <tr>
                <td class="py-4 px-6 text-sm font-medium">Name</td>
                <td class="py-4 px-6 text-left text-sm">{file.name}</td>
              </tr>
              <tr>
                <td class="py-2 px-6 text-sm font-medium">Size</td>
                <td class="py-2 px-6 text-left text-sm">{`${parseFloat(
                  file.size / 1024
                ).toFixed(2)} KB`}</td>
              </tr>
              <tr>
                <td class="py-4 px-6 text-sm font-medium">Type</td>
                <td class="py-4 px-6 text-left text-sm ">{file.type}</td>
              </tr>
            </table>
          )}

          <div className="flex flex-row h-full justify-end space-y-2 w-full">
            <button
              className="w-full h-12 flex flex-row bg-black text-white items-center justify-center rounded-md cursor-pointer space-x-2"
              onClick={() => {
                if (file) uploadSelectedFile();
                else toast.error('Please select a file to upload');
              }}
            >
              {isLoading ? (
                <LuLoader2 className="animate-spin text-white" />
              ) : (
                <HiUpload className="text-white" />
              )}
              <p>Upload File</p>
            </button>
          </div>
        </div>
      )}

      {syncResponse && (
        <div className="flex flex-col space-y-3 w-full py-2 overflow-y-auto h-full items-center text-xl justify-center">
          {syncResponse ? (
            <>
              <HiCheckCircle className="text-green-500 w-8 h-8" />
              <p className="text-center">File Upload Successful</p>
            </>
          ) : (
            <>
              <HiXCircle className="text-red-500  w-8 h-8" />
              <p className="text-center">
                There is an error uploading your file. Please try again later.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
