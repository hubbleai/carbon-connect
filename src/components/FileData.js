import React, { useState } from 'react';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { MdDelete, MdOutlineSync } from 'react-icons/md';
import { resyncFile, deleteFile } from 'carbon-connect-js';
import { useCarbon } from '../contexts/CarbonContext';
import { toast } from 'react-toastify';

const FileData = ({ file }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isResyncing, setIsResyncing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { accessToken } = useCarbon();

  const handleToggle = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const performResync = async () => {
    setIsResyncing(true);
    const resyncResponse = await resyncFile({
      fileId: file.id,
      accessToken: accessToken,
      environment: 'DEVELOPMENT',
    });

    if (resyncResponse.status === 200) {
      console.log('resyncResponse', resyncResponse);
      setIsResyncing(false);
      toast.success('Resync initiated successfully');
    } else {
      toast.error(resyncResponse?.error || 'Resync failed');

      console.log('resyncResponse', resyncResponse);
      setIsResyncing(false);
    }
  };

  const performDelete = async () => {
    setIsDeleting(true);
    const deleteResponse = await deleteFile({
      fileId: file.id,
      accessToken: accessToken,
      environment: 'DEVELOPMENT',
    });

    if (deleteResponse.status === 200) {
      console.log('deleteResponse', deleteResponse);
      setIsDeleting(false);
      toast.success('File deleted successfully');
    } else {
      toast.error('File deletion failed');
      setIsDeleting(false);
    }
  };

  //   const renderTags = (tags) => {
  //     return (
  //       <div className="cc-grid cc-grid-cols-2 cc-gap-2 cc-col-span-2 cc-border">
  //         {Object.entries(tags).map(([key, value], index) => (
  //           <React.Fragment key={index}>
  //             <div className="cc-text-gray-600">{key}</div>
  //             <div>{value}</div>
  //           </React.Fragment>
  //         ))}
  //       </div>
  //     );
  //   };

  return (
    <div className="cc-bg-gray-100 cc-rounded-md cc-mb-2 cc-border">
      <div
        className="cc-flex cc-flex-row cc-items-center cc-justify-between cc-py-2 cc-px-4 cc-cursor-pointer"
        onClick={handleToggle}
      >
        <div>{file.name}</div>
        <div>{isExpanded ? <HiChevronUp /> : <HiChevronDown />}</div>
      </div>

      {isExpanded && (
        <div className="cc-flex cc-flex-row cc-w-full cc-bg-white">
          <div className="cc-grid cc-grid-cols-3 cc-gap-4 cc-p-4 cc-grow">
            <div className="cc-font-semibold">File ID:</div>
            <div className="cc-col-span-2">{file.id}</div>

            <div className="cc-font-semibold">First Synced On:</div>
            <div className="cc-col-span-2">
              {new Date(file.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}{' '}
              {new Date(file.created_at).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </div>

            <div className="cc-font-semibold">Most Recent Sync:</div>

            <div className="cc-col-span-2">
              {new Date(file.last_sync).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}{' '}
              {new Date(file.last_sync).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </div>

            <div className="cc-font-semibold">Recent Sync Status:</div>
            <div className="cc-col-span-2">{file.sync_status}</div>

            {file.sync_error_message && (
              <>
                <div className="cc-font-semibold">First Synced On:</div>
                <div className="cc-col-span-2">{file.created_at}</div>
              </>
            )}

            {/* <div className="cc-font-semibold">Statistics:</div>
            <div className="cc-col-span-2">{file.file_statistics}</div> */}

            {/* <div className="cc-font-semibold">Tags:</div> */}
            {/* <div className="cc-col-span-2">{file.tags}</div>
            <div className="cc-font-semibold">Tags:</div> */}
            {/* {renderTags(file.tags)} */}
          </div>

          <div className="cc-flex cc-space-x-2  cc-p-4">
            <MdOutlineSync
              className={`cc-h-6 cc-w-6 cc-text-blue-400 ${
                isResyncing && 'animate-spin'
              }`}
              onClick={performResync}
            />
            <MdDelete
              className="cc-h-6 cc-w-6 cc-text-red-400"
              onClick={performDelete}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileData;
