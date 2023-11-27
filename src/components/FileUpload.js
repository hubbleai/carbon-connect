import React, { useEffect, useState, useRef } from 'react';
import { darkenColor, formatFileSize } from '../utils/helpers';

import { FileUploader } from 'react-drag-drop-files';
import * as Dialog from '@radix-ui/react-dialog';

import {
  HiXCircle,
  HiCheckCircle,
  HiArrowLeft,
  HiUpload,
  HiX,
} from 'react-icons/hi';
import { AiOutlineFileMarkdown, AiOutlineFileUnknown } from 'react-icons/ai';
import {
  BsFiletypeCsv,
  BsFiletypePdf,
  BsFiletypeTxt,
  BsFiletypeDocx,
  BsFiletypePptx,
} from 'react-icons/bs';
import { toast } from 'react-toastify';
import { LuLoader2 } from 'react-icons/lu';

import '../index.css';
import { BASE_URL, onSuccessEvents } from '../constants';
import { useCarbon } from '../contexts/CarbonContext';

const defaultSupportedFileTypes = ['txt', 'csv', 'pdf', 'docx', 'pptx'];

function FileUpload({ setActiveStep }) {
  const [uploadButtonHoveredState, setUploadButtonHoveredState] =
    useState(false);
  const [files, setFiles] = useState([]);
  const [syncResponse, setSyncResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filesConfig, setFilesConfig] = useState([]);
  const [allowedMaxFileSize, setAllowedMaxFileSize] = useState(20);
  const [allowedMaxFilesCount, setAllowedMaxFilesCount] = useState(10);

  const {
    accessToken,
    fetchTokens,
    entryPoint,
    environment,
    tags,
    maxFileSize,
    onSuccess,
    onError,
    primaryBackgroundColor,
    primaryTextColor,
    allowMultipleFiles,
    processedIntegrations,
    topLevelChunkSize,
    topLevelOverlapSize,
    defaultChunkSize,
    defaultOverlapSize,
    authenticatedFetch,
    navigateBackURL,
    manageModalOpenState,
  } = useCarbon();

  useEffect(() => {
    setTimeout(() => {
      if (!accessToken) {
        fetchTokens();
      }
    }, 1000);
  }, [accessToken]);

  useEffect(() => {
    const newFilesConfig = processedIntegrations.find(
      (integration) => integration.id === 'LOCAL_FILES'
    );
    if (newFilesConfig) {
      setAllowedMaxFileSize(
        newFilesConfig.maxFileSize
          ? newFilesConfig.maxFileSize / 1000000
          : maxFileSize
          ? maxFileSize / 1000000
          : 20
      );
      setAllowedMaxFilesCount(
        newFilesConfig.maxFilesCount ? newFilesConfig.maxFilesCount : 10
      );
      setFilesConfig(newFilesConfig);
    }
  }, [processedIntegrations]);

  const onFilesSelected = (files) => {
    try {
      if (!allowMultipleFiles) setFiles([files]);
      else {
        if (files.length > allowedMaxFilesCount) {
          toast.error(
            `You can only upload a maximum of ${allowedMaxFilesCount} files at a time.`
          );
          onError({
            status: 400,
            data: [
              {
                message: `Tried selecting ${files.length} files at a time.`,
              },
            ],
            action: onSuccessEvents.UPDATE,
            event: onSuccessEvents.UPDATE,
            integration: 'LOCAL_FILES',
          });
          return;
        }
        setFiles((prevList) => {
          if (prevList.length + files.length > allowedMaxFilesCount) {
            toast.error(
              `You can only upload a maximum of ${allowedMaxFilesCount} files at a time.`
            );
            onError({
              status: 400,
              data: [
                {
                  message: `Tried selecting ${
                    prevList.length + files.length
                  } files at a time.`,
                },
              ],
              action: onSuccessEvents.UPDATE,
              event: onSuccessEvents.UPDATE,
              integration: 'LOCAL_FILES',
            });
            return prevList;
          }

          return [...prevList, ...files];
        });
      }
    } catch (e) {}
  };

  const onFileRemoved = (fileIndex) => {
    setFiles((prevList) => {
      const newList = [...prevList];
      newList.splice(fileIndex, 1);
      return newList;
    });
  };

  const uploadSelectedFiles = async () => {
    if (files.length === 0) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      setIsLoading(true);
      const successfulUploads = [];
      const failedUploads = [];

      await Promise.all(
        files.map(async (file, index) => {
          try {
            const formData = new FormData();
            formData.append('file', file);

            const fileType = file.name.split('.').pop();
            const allowedFileTypes = filesConfig.allowedFileTypes
              ? filesConfig.allowedFileTypes.map((config) => config.extension)
              : defaultSupportedFileTypes;

            const fileTypeConfig = allowedFileTypes.find(
              (configuredType) => configuredType === fileType
            );

            if (!fileTypeConfig) {
              failedUploads.push(file.name);
              return;
            }

            const chunkSize =
              fileTypeConfig?.chunkSize ||
              filesConfig?.chunkSize ||
              topLevelChunkSize ||
              defaultChunkSize;
            const overlapSize =
              fileTypeConfig?.overlapSize ||
              filesConfig?.overlapSize ||
              topLevelOverlapSize ||
              defaultOverlapSize;

            const skipEmbeddingGeneration =
              fileTypeConfig?.skipEmbeddingGeneration ||
              filesConfig?.skipEmbeddingGeneration ||
              false;

            const uploadResponse = await authenticatedFetch(
              `${BASE_URL[environment]}/uploadfile?chunk_size=${chunkSize}&chunk_overlap=${overlapSize}&skip_embedding_generation=${skipEmbeddingGeneration}`,
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

              const appendTagsResponse = await authenticatedFetch(
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

              if (appendTagsResponse.status === 200) {
                const appendTagsResponseData = await appendTagsResponse.json();
                successfulUploads.push(appendTagsResponseData);
              } else {
                failedUploads.push({
                  fileName: file.name,
                  message: 'Failed to add tags to the file.',
                });
              }
            } else {
              const errorData = await uploadResponse.json(); // Get the error response body

              failedUploads.push({
                fileName: file.name,
                message: errorData.message || 'Failed to upload file.',
              });
            }
          } catch (error) {
            // console.log(error);
          }
        })
      );

      if (failedUploads.length === 0) {
        if (allowMultipleFiles)
          toast.success(
            `Successfully uploaded ${successfulUploads.length} of ${files.length} file(s)`
          );
        else toast.success('Successfully uploaded file');
      }

      if (successfulUploads.length > 0)
        onSuccess({
          status: 200,
          data: {
            data_source_external_id: null,
            sync_status: null,
            files: successfulUploads,
          },
          action: onSuccessEvents.UPDATE,
          event: onSuccessEvents.UPDATE,
          integration: 'LOCAL_FILES',
        });

      if (failedUploads.length > 0) {
        onError({
          status: 400,
          data: failedUploads,
          action: onSuccessEvents.UPDATE,
          event: onSuccessEvents.UPDATE,
          integration: 'LOCAL_FILES',
        });
      }
      setSyncResponse(true);
      setIsLoading(false);
    } catch (error) {
      toast.error('Error uploading files. Please try again.');
      setIsLoading(false);
      onError({
        status: 400,
        data: [{ message: 'Error uploading files' }],
        action: onSuccessEvents.UPDATE,
        event: onSuccessEvents.UPDATE,
        integration: 'LOCAL_FILES',
      });
    }
  };

  const navigateBack = () => {
    if (navigateBackURL) window.open(navigateBackURL, '_self');
    else manageModalOpenState(false);
  };

  return (
    <div className="cc-flex cc-flex-col cc-items-center cc-relative cc-h-full cc-p-4 ">
      <Dialog.Title className="cc-text-lg cc-mb-4 cc-font-medium cc-w-full">
        <div className="cc-w-full cc-flex cc-items-center cc-space-x-4">
          {!entryPoint && (
            <HiArrowLeft
              onClick={() => setActiveStep(1)}
              className="cc-cursor-pointer cc-h-6 cc-w-6 cc-text-gray-400"
            />
          )}
          <h1 className="cc-grow">Upload Files</h1>
          <HiX
            onClick={() => manageModalOpenState(false)}
            className="cc-cursor-pointer cc-h-5 cc-w-5"
            style={{
              color: primaryTextColor,
            }}
          />
        </div>
      </Dialog.Title>
      {!syncResponse && (
        <div className="cc-w-full cc-flex-col cc-flex cc-space-y-4 cc-justify-between">
          {((!allowMultipleFiles && files.length === 0) ||
            allowMultipleFiles) && (
            <FileUploader
              multiple={allowMultipleFiles}
              handleChange={onFilesSelected}
              name="file"
              types={
                filesConfig.allowedFileTypes
                  ? filesConfig.allowedFileTypes.map(
                      (config) => config.extension
                    )
                  : defaultSupportedFileTypes
              }
              maxSize={allowedMaxFileSize}
              label="Upload or drag a file here to embed."
              onTypeError={(e) => {
                toast.error(
                  `The file format is not supported. The supported formats are: ${
                    filesConfig.allowedFileTypes
                      ? filesConfig.allowedFileTypes
                          .map((config) => config.extension.toUpperCase())
                          .join(', ')
                      : defaultSupportedFileTypes.join(', ')
                  }`
                );
                onError({
                  status: 400,
                  data: [
                    {
                      message: `The file format is not supported. The supported formats are: ${
                        filesConfig.allowedFileTypes
                          ? filesConfig.allowedFileTypes
                              .map((config) => config.extension.toUpperCase())
                              .join(', ')
                          : defaultSupportedFileTypes.join(', ')
                      }`,
                    },
                  ],
                  action: onSuccessEvents.UPDATE,
                  event: onSuccessEvents.UPDATE,
                  integration: 'LOCAL_FILES',
                });
              }}
              onSizeError={(e) => {
                toast.error(
                  `The file size is too large. The maximum size allowed is: ${allowedMaxFileSize} MB`
                );
                onError({
                  status: 400,
                  data: [
                    {
                      message: `The file size is too large. The maximum size allowed is: ${allowedMaxFileSize} MB`,
                    },
                  ],
                  action: onSuccessEvents.UPDATE,
                  event: onSuccessEvents.UPDATE,
                  integration: 'LOCAL_FILES',
                });
              }}
              dropMessageStyle={{
                backgroundColor: '#d1d1d1',
                border: 1,
                borderStyle: 'dashed',
                borderColor: '#919191',
              }}
              hoverTitle={
                allowedMaxFilesCount - files.length > 0
                  ? ' '
                  : 'Cannot select more files'
              }
              disabled={
                allowedMaxFilesCount - files.length > 0 || isLoading
                  ? false
                  : true
              }
            >
              <div
                className="cc-rounded-lg cc-flex cc-py-2 cc-h-24 cc-w-full cc-mt-4 cc-mb-1 cc-cursor-pointer cc-text-center cc-border cc-border-dashed cc-border-[#919191] cc-justify-center cc-items-center cc-gap-x-2 cc-overflow-hidden cc-text-black cc-space-x-2 cc-outline-none focus:cc-outline-none hover:cc-bg-[#d1d1d1] hover:cc-border-0"
                onClick={() => {
                  if (isLoading === true) {
                    toast.error(
                      'Please wait for the file to upload before uploading another file.'
                    );
                    return;
                  }
                  if (allowedMaxFilesCount - files.length <= 0) {
                    toast.error(
                      `You can only upload a maximum of ${allowedMaxFilesCount} files at a time.`
                    );
                    return;
                  }
                }}
              >
                <div>
                  <p className="cc-text-[#484848]">
                    {`Drag and drop ${
                      allowMultipleFiles
                        ? `up to ${allowedMaxFilesCount - files.length} files`
                        : 'file'
                    } here.`}
                  </p>
                  <p className="cc-text-[#919191]">
                    Max {allowedMaxFileSize} MB per file
                  </p>
                </div>
              </div>
            </FileUploader>
          )}

          {files.length > 0 && (
            <>
              <div className="cc-w-full cc-flex cc-flex-col cc-space-y-4 cc-overflow-y-auto cc-h-[19rem]">
                {files.map((file, fileIndex) => (
                  <div
                    className="cc-relative cc-flex cc-flex-row cc-space-x-2 cc-w-full cc-items-center"
                    key={fileIndex}
                  >
                    <div className="cc-w-1/6 cc-text-[#484848] cc-h-10">
                      {file.name.split('.').pop() === 'pdf' ? (
                        <BsFiletypePdf className="cc-w-10 cc-h-10 cc-mx-auto" />
                      ) : file.name.split('.').pop() === 'csv' ? (
                        <BsFiletypeCsv className="cc-w-10 cc-h-10  cc-mx-auto" />
                      ) : file.name.split('.').pop() === 'txt' ? (
                        <BsFiletypeTxt className="cc-w-10 cc-h-10 cc-mx-auto" />
                      ) : file.name.split('.').pop() === 'docx' ? (
                        <BsFiletypeDocx className="cc-w-10 cc-h-10 cc-mx-auto" />
                      ) : file.name.split('.').pop() === 'pptx' ? (
                        <BsFiletypePptx className="cc-w-10 cc-h-10 cc-mx-auto" />
                      ) : file.name.split('.').pop() === 'md' ? (
                        <AiOutlineFileMarkdown className="cc-w-10 cc-h-10 cc-mx-auto" />
                      ) : (
                        <AiOutlineFileUnknown className="cc-w-10 cc-h-10 cc-mx-auto" />
                      )}
                    </div>

                    <div className="cc-flex cc-flex-col cc-w-8/12">
                      <h1 className="cc-text-base cc-font-medium cc-mb-1 cc-w-full cc-truncate">
                        {file.name}
                      </h1>
                      <p className="cc-text-sm cc-text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <HiX
                      className="cc-ml-auto cc-text-gray-400 cc-cursor-pointer cc-w-1/12"
                      onClick={() => onFileRemoved(fileIndex)}
                    />
                  </div>
                ))}
              </div>
              {!allowMultipleFiles && <div className="cc-h-28"></div>}
              <button
                className={`cc-w-full cc-h-12 cc-flex cc-flex-row cc-items-center cc-justify-center cc-rounded-md cc-cursor-pointer cc-space-x-2`}
                style={{
                  backgroundColor: uploadButtonHoveredState
                    ? darkenColor(primaryBackgroundColor, -10)
                    : primaryBackgroundColor,
                  color: primaryTextColor,
                }}
                onClick={() => {
                  if (isLoading === true) {
                    toast.error(
                      'Please wait for the file to upload before uploading another file.'
                    );
                    return;
                  }

                  if (files.length > 0) uploadSelectedFiles();
                  else toast.error('Please select a file to upload');
                }}
                onMouseEnter={() => setUploadButtonHoveredState(true)}
                onMouseLeave={() => setUploadButtonHoveredState(false)}
              >
                {isLoading ? (
                  <LuLoader2 className={`cc-animate-spin`} />
                ) : (
                  <HiUpload />
                )}
                <p>{`Upload File(s)`}</p>
              </button>
            </>
          )}
        </div>
      )}

      {syncResponse && (
        <div className="cc-flex cc-flex-col cc-space-y-3 cc-w-full cc-py-2 cc-overflow-y-auto cc-h-full cc-items-center cc-text-xl cc-justify-center">
          {syncResponse ? (
            <>
              <HiCheckCircle className="cc-text-green-500 cc-w-8 cc-h-8" />
              <p className="cc-text-center">{`File(s) uploaded successfully`}</p>
            </>
          ) : (
            <>
              <HiXCircle className="cc-text-red-500 cc-w-8 cc-h-8" />
              <p className="cc-text-center">
                There is an error uploading your files. Please try again later.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// FileUpload.propTypes = {
//   setActiveStep: PropTypes.func.isRequired,
//   entryPoint: PropTypes.number,
//   environment: PropTypes.string.isRequired,
//   tags: PropTypes.object,
//   maxFileSize: PropTypes.number,
//   onSuccess: PropTypes.func.isRequired,
//   onError: PropTypes.func.isRequired,
//   primaryBackgroundColor: PropTypes.string,
//   primaryTextColor: PropTypes.string,
//   secondaryBackgroundColor: PropTypes.string,
//   secondaryTextColor: PropTypes.string,
// };

// FileUpload.defaultProps = {
//   entryPoint: 0,
//   tags: [],
//   maxFileSize: 20000000, // 20 MB
//   primaryBackgroundColor: '#ffffff',
//   primaryTextColor: '#000000',
//   secondaryBackgroundColor: '#f2f2f2',
//   secondaryTextColor: '#4f4f4f',
// };

export default FileUpload;
