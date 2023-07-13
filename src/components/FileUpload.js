import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { FileUploader } from 'react-drag-drop-files';
import * as Dialog from '@radix-ui/react-dialog';
import {
  HiXCircle,
  HiCheckCircle,
  HiArrowLeft,
  HiUpload,
  HiX,
} from 'react-icons/hi';
import { AiOutlineCloudUpload, AiOutlineFileUnknown } from 'react-icons/ai';
import { BsFiletypeCsv, BsFiletypePdf, BsFiletypeTxt } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { LuLoader2 } from 'react-icons/lu';

import '../index.css';
import { BASE_URL } from '../constants';
import { useCarbonAuth } from '../contexts/AuthContext';

const fileTypes = ['txt', 'csv', 'pdf'];

function FileUpload({
  setActiveStep,
  entryPoint,
  environment,
  tags,
  maxFileSize,
  onSuccess,
  onError,
  primaryBackgroundColor,
  primaryTextColor,
  secondaryBackgroundColor,
  secondaryTextColor,
}) {
  const [file, setFile] = useState(null);
  const [syncResponse, setSyncResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { accessToken, fetchTokens } = useCarbonAuth();

  useEffect(() => {
    if (!accessToken) {
      fetchTokens();
    }
  }, [accessToken]);

  const uploadSelectedFile = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch(
        `${BASE_URL[environment]}/uploadfile`,
        {
          method: 'POST',
          body: formData,
          headers: {
            // 'Content-Type': 'multipart/form-data',
            Authorization: `Token ${accessToken}`,
          },
        }
      );

      if (uploadResponse.status === 200) {
        const uploadResponseData = await uploadResponse.json();

        const appendTagsResponse = await fetch(
          `${BASE_URL[environment]}/create_user_file_tags`,
          {
            method: 'POST',
            body: JSON.stringify({
              tags: tags,
              organization_user_file_id: uploadResponseData['id'],
            }),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token ${accessToken}`,
            },
          }
        );
        setSyncResponse(uploadResponseData);

        if (appendTagsResponse.status === 200) {
          const appendTagsResponseData = await appendTagsResponse.json();
          const dataObject = {
            id: appendTagsResponseData['id'],
            name: appendTagsResponseData['name'],
            source: appendTagsResponseData['source'],
            external_file_id: appendTagsResponseData['external_file_id'],
            tags: appendTagsResponseData['tags'],
            sync_status: appendTagsResponseData['sync_status'],
          };
          onSuccess({ status: 200, data: dataObject });
          toast.success('Successfully uploaded file');
          setIsLoading(false);
        }
      } else {
        toast.error('Error uploading file. Please try again.');
        setIsLoading(false);
        onError({ status: 400, data: { message: 'Error uploading file' } });
      }
    } catch (error) {
      toast.error('Error uploading file. Please try again.');
      setIsLoading(false);
      console.log('Error: ', error);
      onError({ status: 400, data: { message: 'Error uploading file' } });
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
          <h1>Upload Files</h1>
        </div>
      </Dialog.Title>
      {!syncResponse && (
        <div className="cc-w-full cc-h-full cc-flex-col cc-flex cc-space-y-4 cc-justify-between">
          {!file ? (
            <FileUploader
              multiple={false}
              handleChange={setFile}
              name="file"
              types={fileTypes}
              maxSize={maxFileSize ? maxFileSize / 1000000 : 20}
              label="Upload or drag a file here to embed."
              classes="focus:cc-outline-none"
              onSizeError={(e) => {
                toast.error(
                  `The file size is too large. The maximum size allowed is: ${
                    maxFileSize ? maxFileSize / 1000000 : 20
                  } MB`
                );
                onError({
                  status: 400,
                  data: {
                    message: `The file size is too large. The maximum size allowed is: ${
                      maxFileSize ? maxFileSize / 1000000 : 20
                    } MB`,
                  },
                });
              }}
            >
              <div className="cc-rounded-lg cc-flex cc-py-2 cc-h-60 cc-w-full cc-mt-4 cc-mb-1 cc-cursor-pointer cc-text-center cc-border-2 cc-justify-center cc-items-center cc-gap-x-2 cc-overflow-hidden cc-text-black cc-space-x-2 cc-outline-none focus:cc-outline-none">
                <div>
                  <AiOutlineCloudUpload className="cc-w-10 cc-text-[#484848] cc-h-10 cc-mb-4 cc-mx-auto" />
                  <p className="cc-text-[#484848]">
                    Upload a TXT, PDF or CSV File.
                  </p>
                  <p className="cc-text-[#919191]">
                    Max {maxFileSize ? maxFileSize / 1000000 : 20} MB per File
                  </p>
                </div>
              </div>
            </FileUploader>
          ) : (
            <div className="cc-flex cc-flex-col cc-justify-between cc-h-full cc-items-start">
              <div className="cc-relative cc-flex cc-flex-row cc-space-x-2 cc-w-full cc-items-center">
                <div className="cc-w-1/6 cc-text-[#484848] cc-h-10">
                  {file.name.split('.').pop() === 'pdf' ? (
                    <BsFiletypePdf className="cc-w-10 cc-h-10 cc-mx-auto" />
                  ) : file.name.split('.').pop() === 'csv' ? (
                    <BsFiletypeCsv className="cc-w-10 cc-h-10  cc-mx-auto" />
                  ) : file.name.split('.').pop() === 'txt' ? (
                    <BsFiletypeTxt className="cc-w-10 cc-h-10 cc-mx-auto" />
                  ) : (
                    <AiOutlineFileUnknown className="cc-w-10 cc-h-10 cc-mx-auto" />
                  )}
                </div>

                <div className="cc-flex cc-flex-col cc-w-9/12">
                  <h1 className="cc-text-base cc-font-medium cc-mb-1 cc-w-full cc-truncate">
                    {file.name}
                  </h1>
                  <p className="cc-text-sm cc-text-gray-400">
                    {`${parseFloat(file.size / 1024).toFixed(2)} KB`}
                  </p>
                </div>
                <HiX
                  className="cc-ml-auto cc-text-gray-400 cc-cursor-pointer cc-w-1/12"
                  onClick={() => setFile(null)}
                />
              </div>
              <button
                className={`cc-w-full cc-h-12 cc-flex cc-flex-row cc-items-center cc-justify-center cc-rounded-md cc-cursor-pointer cc-space-x-2`}
                style={{
                  backgroundColor: primaryBackgroundColor,
                  color: primaryTextColor,
                }}
                onClick={() => {
                  if (isLoading === true) {
                    toast.error(
                      'Please wait for the file to upload: ',
                      isLoading
                    );
                    return;
                  }

                  if (file) uploadSelectedFile();
                  else toast.error('Please select a file to upload');
                }}
              >
                {isLoading ? (
                  <LuLoader2 className={`cc-animate-spin`} />
                ) : (
                  <HiUpload />
                )}
                <p>Upload File</p>
              </button>
            </div>
          )}
        </div>
      )}

      {syncResponse && (
        <div className="cc-flex cc-flex-col cc-space-y-3 cc-w-full cc-py-2 cc-overflow-y-auto cc-h-full cc-items-center cc-text-xl cc-justify-center">
          {syncResponse ? (
            <>
              <HiCheckCircle className="cc-text-green-500 cc-w-8 cc-h-8" />
              <p className="cc-text-center">File Upload Successful</p>
            </>
          ) : (
            <>
              <HiXCircle className="cc-text-red-500 cc-w-8 cc-h-8" />
              <p className="cc-text-center">
                There is an error uploading your file. Please try again later.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

FileUpload.propTypes = {
  setActiveStep: PropTypes.func.isRequired,
  entryPoint: PropTypes.number,
  environment: PropTypes.string.isRequired,
  tags: PropTypes.array,
  maxFileSize: PropTypes.number,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  primaryBackgroundColor: PropTypes.string,
  primaryTextColor: PropTypes.string,
  secondaryBackgroundColor: PropTypes.string,
  secondaryTextColor: PropTypes.string,
};

FileUpload.defaultProps = {
  entryPoint: 0,
  tags: [],
  maxFileSize: 20000000, // 20 MB
  primaryBackgroundColor: '#ffffff',
  primaryTextColor: '#000000',
  secondaryBackgroundColor: '#f2f2f2',
  secondaryTextColor: '#4f4f4f',
};

export default FileUpload;
