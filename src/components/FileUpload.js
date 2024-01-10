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
  BsExclamationTriangle,
} from 'react-icons/bs';
import { CiFileOn, CiFolderOn } from 'react-icons/ci';
import { toast } from 'react-toastify';
import { LuLoader2 } from 'react-icons/lu';

import '../index.css';
import { BASE_URL, onSuccessEvents } from '../constants';
import { useCarbon } from '../contexts/CarbonContext';

const defaultSupportedFileTypes = ['txt', 'csv', 'pdf', 'docx', 'pptx'];

const FileItemIcon = ({ fileObject, allowedFileTypes }) => {
  const fileExt = fileObject.name.split('.').pop();
  console.log('Allowed file types: ', allowedFileTypes);

  if (!allowedFileTypes.includes(fileExt)) {
    return (
      <BsExclamationTriangle className="cc-w-10 cc-h-10 cc-mx-auto cc-text-yellow-500" />
    );
  }

  if (fileExt === 'pdf') {
    return <BsFiletypePdf className="cc-w-10 cc-h-10 cc-mx-auto" />;
  }
  if (fileExt === 'csv') {
    return <BsFiletypeCsv className="cc-w-10 cc-h-10  cc-mx-auto" />;
  }
  if (fileExt === 'txt') {
    return <BsFiletypeTxt className="cc-w-10 cc-h-10 cc-mx-auto" />;
  }
  if (fileExt === 'docx') {
    return <BsFiletypeDocx className="cc-w-10 cc-h-10 cc-mx-auto" />;
  }
  if (fileExt === 'pptx') {
    return <BsFiletypePptx className="cc-w-10 cc-h-10 cc-mx-auto" />;
  }
  if (fileExt === 'md') {
    return <AiOutlineFileMarkdown className="cc-w-10 cc-h-10 cc-mx-auto" />;
  }
  return <AiOutlineFileUnknown className="cc-w-10 cc-h-10 cc-mx-auto" />;
};

function FileUpload({ setActiveStep }) {
  const [uploadButtonHoveredState, setUploadButtonHoveredState] =
    useState(false);
  const [filePickerType, setFilePickerType] = useState(null);
  const [showUI, setShowUI] = useState(false);
  const [files, setFiles] = useState([]);
  const [successfulFiles, setSuccessfulFiles] = useState([]);
  const [failedFiles, setFailedFiles] = useState([]);
  const fileInputRef = useRef(null);

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
    embeddingModel,
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

  useEffect(() => {
    if (filesConfig.filePickerMode === 'FILES') {
      setFilePickerType('FILES');
    } else if (filesConfig.filePickerMode === 'FOLDERS') {
      setFilePickerType('FOLDERS');
    } else if (filesConfig.filePickerMode === 'BOTH') {
      setFilePickerType(null);
    }
    setShowUI(true);
  }, [filesConfig]);

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
            const fileType = file.name.split('.').pop();
            const allowedFileTypes = filesConfig.allowedFileTypes
              ? filesConfig.allowedFileTypes.map((config) => config.extension)
              : defaultSupportedFileTypes;

            const fileTypeConfig = allowedFileTypes.find(
              (configuredType) => configuredType === fileType
            );

            if (!fileTypeConfig) {
              // failedUploads.push({
              //   name: file.name,
              //   message: 'Unsupported Format',
              // });
              return;
            }

            const fileSize = file.size / 1000000;

            if (fileSize > allowedMaxFileSize) {
              failedUploads.push({
                name: file.name,
                message: `File size is too large. The maximum size allowed is: ${allowedMaxFileSize} MB`,
              });
              return;
            }

            const formData = new FormData();
            formData.append('file', file);

            const setPageAsBoundary =
              fileTypeConfig?.setPageAsBoundary ||
              filesConfig?.setPageAsBoundary ||
              false;
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

            const embeddingModelValue =
              fileTypeConfig?.embeddingModel ||
              filesConfig?.embeddingModel ||
              embeddingModel ||
              null;

            const useOCR =
              fileTypeConfig?.useOcr || filesConfig?.useOcr || false;

            const generateSparseVectors =
              fileTypeConfig?.generateSparseVectors ||
              filesConfig?.generateSparseVectors ||
              false;

            const uploadResponse = await authenticatedFetch(
              `${BASE_URL[environment]}/uploadfile?chunk_size=${chunkSize}&chunk_overlap=${overlapSize}&skip_embedding_generation=${skipEmbeddingGeneration}&set_page_as_boundary=${setPageAsBoundary}&embedding_model=${embeddingModelValue}&use_ocr=${useOCR}&generate_sparse_vectors=${generateSparseVectors}`,
              {
                method: 'POST',
                body: formData,
                headers: {
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
                  name: file.name,
                  message: 'Failed to add tags to the file.',
                });
              }
            } else {
              const errorData = await uploadResponse.json(); // Get the error response body

              failedUploads.push({
                name: file.name,
                message: errorData.message || 'Failed to upload file.',
              });
            }
          } catch (error) {
            console.log(error);
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
      setSuccessfulFiles(successfulUploads);
      setFailedFiles(failedUploads);
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

  const handleFolderSelection = (event) => {
    const items = event.target.files;
    const topLevelFiles = [];

    for (let i = 0; i < items.length; i++) {
      if (items[i].webkitRelativePath.split('/').length === 2) {
        topLevelFiles.push(items[i]);
      }
    }
    const maxFilesCount = allowedMaxFilesCount - files.length;
    if (topLevelFiles.length > maxFilesCount) {
      toast.error(
        `You can only upload a maximum of ${maxFilesCount} files at a time.`
      );
      return;
    }
    setFiles((prevList) => {
      if (prevList.length + topLevelFiles.length > allowedMaxFilesCount) {
        toast.error(
          `You can only upload a maximum of ${allowedMaxFilesCount} files at a time.`
        );
        return prevList;
      }

      return [...prevList, ...topLevelFiles];
    });
  };

  const handleTriggerClick = () => {
    fileInputRef.current.click(); // Trigger the hidden file input
  };

  if (filePickerType === null) {
  }
  return (
    <div className="cc-flex cc-flex-col cc-items-center cc-relative cc-h-full">
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

      {!showUI ? (
        <></>
      ) : filePickerType === null ? (
        <div className="cc-w-full cc-h-full cc-flex cc-flex-row cc-space-x-4 cc-justify-center cc-items-center">
          <button
            className="cc-w-full cc-h-12 cc-flex cc-flex-row cc-items-center cc-justify-center cc-rounded-md cc-cursor-pointer cc-space-x-2"
            style={{
              backgroundColor: uploadButtonHoveredState
                ? darkenColor(primaryBackgroundColor, -10)
                : primaryBackgroundColor,
              color: primaryTextColor,
            }}
            onClick={() => {
              setFilePickerType('FILES');
            }}
          >
            <div className="cc-flex w-full cc-items-center cc-justify-center cc-space-x-2">
              <CiFileOn className="cc-w-4 cc-h-4 " />
              <span>File Picker</span>
            </div>
          </button>
          {allowMultipleFiles && (
            <button
              className="cc-w-full cc-h-12 cc-flex cc-flex-row cc-items-center cc-justify-center cc-rounded-md cc-cursor-pointer cc-space-x-2"
              style={{
                backgroundColor: uploadButtonHoveredState
                  ? darkenColor(primaryBackgroundColor, -10)
                  : primaryBackgroundColor,
                color: primaryTextColor,
              }}
              onClick={() => {
                setFilePickerType('FOLDERS');
              }}
            >
              <div className="cc-flex w-full cc-items-center cc-justify-center cc-space-x-2">
                <CiFolderOn className="cc-w-4 cc-h-4 " />
                <span>Folder Picker</span>
              </div>
            </button>
          )}
        </div>
      ) : (
        <>
          {!syncResponse && (
            <div className="cc-w-full cc-h-full cc-flex-col cc-flex cc-space-y-4 cc-justify-between">
              {((!allowMultipleFiles && files.length === 0) ||
                allowMultipleFiles) && (
                <div className="cc-flex cc-flex-col">
                  {/* <div className="cc-flex cc-w-full cc-justify-between cc-text-xs">
                    <p className="cc-text-gray-600">
                      Allowed Files: {allowedMaxFilesCount}
                    </p>
                    <p className="cc-text-gray-600">
                      Currently selected: {files.length}
                    </p>
                  </div>
                  <p className="cc-flex cc-w-full cc-text-gray-600 cc-text-xs">
                    Max Size: {allowedMaxFileSize} MB per file
                  </p> */}
                  <div className="cc-flex cc-flex-row cc-items-center cc-space-x-2 cc-w-full">
                    {filePickerType === 'FILES' ? (
                      <div className="cc-w-full">
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
                                      .map((config) =>
                                        config.extension.toUpperCase()
                                      )
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
                                          .map((config) =>
                                            config.extension.toUpperCase()
                                          )
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
                            className="cc-rounded-lg cc-flex cc-py-4 cc-h-28 cc-w-full cc-mt-4 cc-mb-1 cc-cursor-pointer cc-text-center cc-border cc-border-dashed cc-border-[#919191] cc-justify-center cc-items-center cc-gap-x-2 cc-overflow-hidden cc-text-black cc-space-x-2 cc-outline-none focus:cc-outline-none hover:cc-bg-[#d1d1d1] hover:cc-border-0"
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
                              <CiFileOn className="cc-w-6 cc-h-6 cc-mx-auto cc-mb-2" />
                              <p className="cc-text-[#484848]">
                                {`Drag and drop ${
                                  allowMultipleFiles
                                    ? `up to ${
                                        allowedMaxFilesCount - files.length
                                      } files`
                                    : 'file'
                                } here.`}
                              </p>
                              <p className="cc-text-[#919191]">
                                Max {allowedMaxFileSize} MB per file
                              </p>
                            </div>
                          </div>
                        </FileUploader>
                      </div>
                    ) : (
                      <button
                        onClick={handleTriggerClick}
                        className="cc-rounded-lg cc-flex cc-py-4 cc-h-28 cc-w-full cc-mt-4 cc-mb-1 cc-cursor-pointer cc-text-center cc-border cc-border-dashed cc-border-[#919191] cc-justify-center cc-items-center cc-gap-x-2 cc-overflow-hidden cc-text-[#484848] cc-space-x-2 cc-outline-none focus:cc-outline-none hover:cc-bg-[#d1d1d1] hover:cc-border-0"
                      >
                        <div>
                          <CiFolderOn className="cc-w-6 cc-h-6 cc-mx-auto cc-mb-2" />
                          <p className="cc-text-[#484848]">
                            {`Select folders with up to ${
                              allowedMaxFilesCount - files.length
                            } files`}
                          </p>
                          <p className="cc-text-[#919191]">
                            Max {allowedMaxFileSize} MB per file
                          </p>
                        </div>
                      </button>
                    )}

                    <input
                      type="file"
                      ref={fileInputRef}
                      webkitdirectory="true"
                      multiple={allowMultipleFiles}
                      onChange={handleFolderSelection}
                      className="cc-hidden"
                    />
                    {/* {allowMultipleFiles &&
                      ['BOTH', 'FOLDERS'].includes(
                        filesConfig.FilePickerMode
                      ) && (
                        <button
                          onClick={handleTriggerClick}
                          className="cc-rounded-lg cc-flex cc-py-2 cc-h-fit cc-w-full cc-mt-4 cc-mb-1 cc-cursor-pointer cc-text-center cc-border cc-border-dashed cc-border-[#919191] cc-justify-center cc-items-center cc-gap-x-2 cc-overflow-hidden cc-text-[#484848] cc-space-x-2 cc-outline-none focus:cc-outline-none hover:cc-bg-[#d1d1d1] hover:cc-border-0"
                        >
                          Folder Picker
                        </button>
                      )} */}
                  </div>
                </div>
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
                          <FileItemIcon
                            fileObject={file}
                            allowedFileTypes={
                              filesConfig.allowedFileTypes
                                ? filesConfig.allowedFileTypes.map(
                                    (config) => config.extension
                                  )
                                : defaultSupportedFileTypes
                            }
                          />
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
            <div className="cc-flex cc-flex-col cc-space-y-3 cc-w-full cc-py-2 cc-overflow-y-auto cc-h-full cc-items-center cc-text-xl">
              {syncResponse ? (
                <>
                  {successfulFiles.map((file, index) => (
                    <div
                      className="cc-relative cc-flex cc-flex-row cc-space-x-2 cc-w-full cc-items-center"
                      key={index}
                    >
                      <div className="cc-w-1/6 cc-text-[#484848] cc-h-10">
                        <HiCheckCircle className="cc-text-green-500 cc-w-8 cc-h-8" />
                      </div>

                      <div className="cc-flex cc-flex-col cc-w-8/12">
                        <h1 className="cc-text-base cc-font-medium cc-mb-1 cc-w-full cc-truncate">
                          {file.name}
                        </h1>
                        <p className="cc-text-sm cc-text-gray-400">
                          {file.message}
                        </p>
                      </div>
                    </div>
                  ))}

                  {failedFiles.map((file, index) => (
                    <div
                      className="cc-relative cc-flex cc-flex-row cc-space-x-2 cc-w-full cc-items-center"
                      key={index}
                    >
                      <div className="cc-w-1/6 cc-text-[#484848] cc-h-10">
                        <BsExclamationTriangle className="cc-text-yellow-500 cc-w-8 cc-h-8" />
                      </div>

                      <div className="cc-flex cc-flex-col cc-w-8/12">
                        <h1 className="cc-text-base cc-font-medium cc-mb-1 cc-w-full cc-truncate">
                          {file.name}
                        </h1>
                        <p className="cc-text-sm cc-text-gray-400">
                          {file.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <HiXCircle className="cc-text-red-500 cc-w-8 cc-h-8" />
                  <p className="cc-text-center">
                    There is an error uploading your files. Please try again
                    later.
                  </p>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FileUpload;
