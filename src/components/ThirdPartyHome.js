import React, { useEffect, useState } from 'react';
import {
  Table,
  Column,
  InfiniteLoader,
  AutoSizer,
  SortDirection,
} from 'react-virtualized';
import { toast } from 'react-toastify';
import { useCarbon } from '../contexts/CarbonContext';
import { HiArrowLeft, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import {
  getUserFiles,
  revokeAccessToDataSource,
  generateOauthurl,
  resyncFile,
} from 'carbon-connect-js';
import { VscDebugDisconnect, VscLoading } from 'react-icons/vsc';
import 'react-virtualized/styles.css'; // import styles

const ThirdPartyHome = ({
  integrationName,
  activeIntegrations,
  setActiveStep,
}) => {
  const [integrationData, setIntegrationData] = useState(null);
  const [connected, setConnected] = useState([]);
  const [canConnectMore, setCanConnectMore] = useState(false);
  const [viewSelectedAccountData, setViewSelectedAccountData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('files'); // ['files', 'config']
  const [isRevokingDataSource, setIsRevokingDataSource] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [files, setFiles] = useState([]);
  const [sortedFiles, setSortedFiles] = useState([]);
  const [hasMoreFiles, setHasMoreFiles] = useState(true);
  const [offset, setOffset] = useState(0);
  const [sortState, setSortState] = useState({
    sortBy: '',
    sortDirection: 'ASC',
  });

  const {
    accessToken,
    processedIntegrations,
    entryPoint,
    handleServiceOAuthFlow,
  } = useCarbon();

  useEffect(() => {
    const integrationData = processedIntegrations.find(
      (integration) => integration.id === integrationName
    );
    setIntegrationData(integrationData);
  }, [processedIntegrations]);

  useEffect(() => {
    const connected = activeIntegrations.filter(
      (integration) => integration.data_source_type === integrationName
    );
    setConnected(connected);
  }, [activeIntegrations]);

  // TODO: This useEffect will be removed when we enable multiple accounts for all integrations
  useEffect(() => {
    if (integrationName === 'NOTION') setCanConnectMore(true);
    else if (connected.length !== 0) setCanConnectMore(false);
    else setCanConnectMore(true);

    setIsLoading(false);
  }, [connected, integrationName]);

  useEffect(() => {
    if (viewSelectedAccountData) {
      loadMoreRows();
    }
  }, [viewSelectedAccountData]);

  const loadMoreRows = async () => {
    const userFilesResponse = await getUserFiles({
      accessToken: accessToken,
      environment: 'DEVELOPMENT',
      offset: offset,
      filters: {
        organization_user_data_source_id: [viewSelectedAccountData.id],
      },
    });

    if (userFilesResponse.status === 200) {
      const count = userFilesResponse.data.count;
      const userFiles = userFilesResponse.data.results;
      const newFiles = [...files, ...userFiles];
      setFiles(newFiles);
      setOffset(offset + userFiles.length);

      if (count > offset + userFiles.length) {
        setHasMoreFiles(true);
      } else {
        setHasMoreFiles(false);
      }
    } else {
      setHasMoreFiles(false);
    }
  };

  const isRowLoaded = ({ index }) => {
    return !!files[index];
  };

  useEffect(() => {
    if (!files.length) return;
    setSortedFiles(files);
  }, [files]);

  const dateCellRenderer = ({ cellData }) => {
    const dateString = new Date(cellData).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const timeString = new Date(cellData).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // Use 24-hour format
    });

    return `${dateString} ${timeString}`;
  };

  const statusCellRenderer = ({ cellData }) => {
    let pillClass =
      'cc-inline-block cc-px-2 cc-py-1 cc-text-xs cc-font-bold cc-rounded-full cc-text-center ';

    switch (cellData) {
      case 'READY':
        pillClass += 'cc-text-green-700 cc-bg-green-300'; // Green for READY
        break;
      case 'SYNCING':
        pillClass += 'cc-text-blue-700 cc-bg-blue-300'; // Blue for SYNCING
        break;
      case 'QUEUED_FOR_SYNCING':
        pillClass += 'cc-text-yellow-700 cc-bg-yellow-300'; // Yellow for QUEUED_FOR_SYNCING
        break;
      case 'SYNC_ERROR':
        pillClass += 'cc-text-red-700 cc-bg-red-300'; // Red for SYNC_ERROR
        break;
      case 'DELAYED':
        pillClass += 'cc-text-gray-700 cc-bg-gray-300'; // Grey for DELAYED
        break;
      default:
        pillClass += 'cc-text-blue-700 cc-bg-blue-300'; // Blue for any other status
    }

    return <span className={pillClass}>{cellData}</span>;
  };

  const checkboxCellRenderer = ({ rowData }) => {
    return (
      <input
        type="checkbox"
        checked={selectedRows.has(rowData.id)}
        onChange={(e) => {
          handleCheckboxChange(rowData.id, e.target.checked);
          e.stopPropagation(); // Prevents row click event
        }}
        onClick={(e) => e.stopPropagation()} // Prevents row click event
      />
    );
  };

  const headerRenderer = ({ label, dataKey }) => (
    <div className="cc-flex cc-flex-row cc-items-center cc-space-x-2 cc-text-left cc-text-sm cc-font-semibold cc-text-gray-500 cc-p-2">
      <span>{label}</span>

      {sortState.sortBy === dataKey &&
        (sortState.sortDirection === SortDirection.ASC ? (
          <HiChevronUp className="cc-w-5 cc-h-5" />
        ) : (
          <HiChevronDown className="cc-w-5 cc-h-5" />
        ))}
    </div>
  );

  const headerRowRenderer = ({ columns }) => (
    <div
      className="cc-flex cc-flex-row cc-items-center cc-space-x-2 cc-text-left cc-text-sm cc-font-semibold cc-text-gray-500 cc-border-b cc-border-gray-300 cc-py-1 cc-mb-1"
      role="row"
    >
      {columns}
    </div>
  );

  const sort = ({ sortBy, sortDirection }) => {
    const { sortBy: prevSortBy, sortDirection: prevSortDirection } = sortState;

    if (prevSortDirection === SortDirection.DESC) {
      sortBy = null;
      sortDirection = null;
    }

    const tempFiles = [...files];
    if (sortBy && sortDirection) {
      tempFiles.sort((a, b) => {
        if (a[sortBy] < b[sortBy])
          return sortDirection === SortDirection.ASC ? -1 : 1;
        if (a[sortBy] > b[sortBy])
          return sortDirection === SortDirection.ASC ? 1 : -1;
        return 0;
      });
    }
    setSortedFiles(tempFiles);
    setSortState({ sortBy, sortDirection });
  };

  const handleRowClick = ({ index }) => {
    const newSelectedRows = new Set(selectedRows);
    const selectedFile = sortedFiles[index];

    if (newSelectedRows.has(selectedFile.id)) {
      newSelectedRows.delete(selectedFile.id);
    } else {
      newSelectedRows.add(selectedFile.id);
    }
    setSelectedRows(newSelectedRows);
  };

  const handleCheckboxChange = (fileId, isChecked) => {
    const newSelectedRows = new Set(selectedRows);
    if (isChecked) {
      newSelectedRows.add(fileId);
    } else {
      newSelectedRows.delete(fileId);
    }
    setSelectedRows(newSelectedRows);
  };

  const handleNewAccountClick = async () => {
    toast.info('You will be redirected to the service to connect your account');
    const generateOauthUrlResponse = await generateOauthurl({
      accessToken: accessToken,
      environment: 'DEVELOPMENT',
      integrationName: integrationName,
    });
    if (generateOauthUrlResponse.status === 200) {
      const oauthUrl = generateOauthUrlResponse.data.oauth_url;
      window.open(oauthUrl, '_blank');
    } else {
      toast.error('Error generating oauth url');
      console.error(
        'Error generating oauth url: ',
        generateOauthUrlResponse.error
      );
    }
  };

  return (
    <div className="cc-h-full cc-w-full cc-flex cc-flex-col">
      <div
        className="cc-flex cc-flex-row cc-w-full cc-h-28 cc-items-center cc-px-4 cc-justify-between cc-bg-gray-200 cc-rounded-[6px] cc-space-x-2"
        style={{
          backgroundColor:
            integrationData?.branding?.header?.primaryBackgroundColor ??
            '#F5F5F5',
        }}
      >
        <div className="cc-flex cc-flex-row cc-items-center cc-space-x-4 cc-w-full">
          <HiArrowLeft
            onClick={() => {
              if (!entryPoint) setActiveStep(1);
              else setActiveStep(0);
            }}
            className="cc-cursor-pointer cc-h-6 cc-w-6 cc-text-gray-400"
          />

          <div className="cc-flex cc-bg-white cc-border cc-rounded-md cc-w-28 cc-h-28 cc-translate-y-6 cc-items-center cc-justify-center">
            <img
              className="cc-w-16 cc-h-16"
              src={integrationData?.logo}
              alt="Integration Logo"
            />
          </div>

          <div className="cc-flex cc-flex-col cc-space-y-2 cc-mr-2 cc-grow">
            <div
              className="cc-flex cc-space-x-2 cc-text-xl cc-items-center cc-text-black"
              style={{
                color:
                  integrationData?.branding?.header?.primaryTextColor ??
                  '#000000',
              }}
            >
              <p>{integrationData?.name}</p>
            </div>
            <div
              className="cc-text-xs cc-text-gray-500 cc-truncate"
              style={{
                color:
                  integrationData?.branding?.header?.secondaryTextColor ??
                  '#000000',
              }}
            >
              {integrationData?.description}
            </div>
          </div>

          {!isLoading && connected?.length === 0 ? (
            <button
              className="cc-text-white cc-cursor-pointer cc-py-2 cc-px-4 cc-text-sm cc-rounded-md"
              style={{
                backgroundColor:
                  integrationData?.branding?.header?.primaryButtonColor ??
                  '#000000',
                color:
                  integrationData?.branding?.header?.primaryLabelColor ??
                  '#FFFFFF',
              }}
              onClick={() => {
                handleNewAccountClick();
              }}
            >
              Connect account
            </button>
          ) : (
            <select
              className="cc-py-2 cc-px-4 cc-rounded-md cc-w-44"
              onChange={async (e) => {
                if (e.target.value === 'add-account') {
                  handleNewAccountClick();
                  e.target.value = ''; // Reset the select value
                } else {
                  const selectedAccount = connected.find(
                    (account) =>
                      account.data_source_external_id === e.target.value
                  );
                  setViewSelectedAccountData(selectedAccount || null);
                }
              }}
            >
              <option value="">Select Account</option>
              {connected.map((account) => {
                const connectedAccountEmail =
                  account.data_source_external_id.split('|')[1] ||
                  account.data_source_external_id.split('-')[1];
                return (
                  <option
                    key={account.id}
                    value={account.data_source_external_id}
                  >
                    {connectedAccountEmail}
                  </option>
                );
              })}
              {canConnectMore && (
                <>
                  <hr className="cc-border-gray-300 cc-my-1" />
                  <option value="add-account">Add Account</option>
                </>
              )}
            </select>
          )}
        </div>
      </div>

      <div className="cc-grow cc-flex cc-flex-col cc-py-4 cc-px-4 cc-space-y-4">
        {isLoading ? (
          <div className="cc-flex cc-flex-col cc-grow cc-items-center cc-justify-center">
            <div className="cc-spinner cc-w-10 cc-h-10 cc-border-2 cc-border-t-4 cc-border-gray-200 cc-rounded-full cc-animate-spin"></div>
          </div>
        ) : viewSelectedAccountData ? (
          <div className="cc-flex-col cc-flex cc-overflow-y-auto cc-translate-y-6">
            <div className="cc-flex cc-border-b cc-mb-2">
              <button
                className={`cc-flex cc-py-2 cc-px-4 cc-text-center cc-cursor-pointer ${
                  activeTab === 'files'
                    ? 'cc-border-b-2 cc-font-bold'
                    : 'cc-font-normal'
                } cc-items-center cc-space-x-2 cc-justify-center cc-w-fit-content`}
                onClick={() => setActiveTab('files')}
              >
                Files
              </button>
              <button
                className={`cc-flex cc-py-2 cc-px-4 cc-text-center cc-cursor-pointer ${
                  activeTab === 'config'
                    ? 'cc-border-b-2 cc-font-bold'
                    : 'cc-font-normal'
                } cc-items-center cc-space-x-2 cc-justify-center cc-w-fit-content`}
                onClick={() => setActiveTab('config')}
              >
                Configuration
              </button>
            </div>

            {activeTab === 'files' &&
              (viewSelectedAccountData.synced_files.length === 0 ? (
                <div className="cc-flex cc-flex-col cc-items-center cc-justify-center">
                  <p className="cc-text-gray-500 cc-text-sm">No files synced</p>
                </div>
              ) : (
                <div className="cc-w-full cc-flex cc-flex-col cc-space-y-4">
                  <InfiniteLoader
                    isRowLoaded={isRowLoaded}
                    loadMoreRows={loadMoreRows}
                    rowCount={hasMoreFiles ? files.length + 1 : files.length}
                  >
                    {({ onRowsRendered, registerChild }) => (
                      <div className="cc-flex cc-grow cc-w-full cc-h-full">
                        <Table
                          headerRowRenderer={headerRowRenderer}
                          width={688}
                          height={200}
                          headerHeight={20}
                          rowHeight={30}
                          rowCount={sortedFiles.length}
                          rowGetter={({ index }) => sortedFiles[index]}
                          onRowsRendered={onRowsRendered}
                          ref={registerChild}
                          onRowClick={({ index }) => {
                            const selectedFile = sortedFiles[index];
                            if (!selectedFile) return;
                            handleCheckboxChange(
                              selectedFile.id,
                              !selectedRows.has(selectedFile.id)
                            );
                          }}
                          rowClassName={({ index }) => {
                            let className =
                              'cc-p-2 hover:cc-cursor-pointer hover:cc-bg-gray-50 ';

                            className +=
                              index % 2 === 0
                                ? 'cc-bg-white'
                                : 'cc-bg-gray-100';

                            return className;
                          }}
                          sort={sort}
                          sortBy={sortState.sortBy}
                          sortDirection={sortState.sortDirection}
                        >
                          <Column
                            label=""
                            dataKey=""
                            width={50}
                            cellRenderer={checkboxCellRenderer}
                          />
                          <Column
                            label="File Name"
                            dataKey="name"
                            width={288}
                            headerRenderer={headerRenderer}
                            sortBy={sortState.sortBy}
                          />
                          <Column
                            label="Status"
                            dataKey="sync_status"
                            width={200}
                            cellRenderer={statusCellRenderer}
                            headerRenderer={headerRenderer}
                          />
                          <Column
                            label="Last Sync Time"
                            dataKey="last_sync"
                            width={200}
                            cellRenderer={dateCellRenderer}
                            headerRenderer={headerRenderer}
                          />
                        </Table>
                      </div>
                    )}
                  </InfiniteLoader>

                  <button
                    className={`cc-mt-4 ${
                      selectedRows.size > 0
                        ? 'cc-bg-black cc-cursor-pointer cc-text-white'
                        : 'cc-bg-gray-300'
                    } cc-bg-black cc-text-white cc-cursor-pointer cc-py-2 cc-px-4 cc-text-sm cc-rounded-md cc-flex cc-items-center cc-space-x-2 cc-justify-center`}
                    onClick={() => {
                      selectedRows.forEach(async (fileId) => {
                        const resyncFileResponse = await resyncFile({
                          accessToken: accessToken,
                          environment: 'DEVELOPMENT',
                          fileId: fileId,
                        });

                        if (resyncFileResponse.status === 200) {
                          const fileData = resyncFileResponse.data;

                          // Update the file in the files array
                          const fileIndex = files.findIndex(
                            (file) => file.id === fileData.id
                          );

                          // Update the file in the sortedFiles array
                          const sortedFileIndex = sortedFiles.findIndex(
                            (file) => file.id === fileData.id
                          );

                          const newFiles = [...files];
                          const newSortedFiles = [...sortedFiles];

                          newFiles[fileIndex] = fileData;
                          newSortedFiles[sortedFileIndex] = fileData;

                          setFiles(newFiles);
                          setSortedFiles(newSortedFiles);

                          setSelectedRows((prevSelectedRows) => {
                            prevSelectedRows.delete(fileData.id);
                            return prevSelectedRows;
                          });
                        }
                      });

                      toast.info('Resync initiated');
                    }}
                    disabled={selectedRows.size === 0}
                  >
                    <span>Resync Selected Files</span>
                  </button>
                </div>
              ))}

            {activeTab === 'config' && (
              <div className="cc-flex cc-flex-row cc-w-full cc-border cc-rounded-md cc-border-gray-500 cc-mt-2 cc-px-4 cc-py-2 cc-items-center">
                <h1 className="cc-grow cc-font-semibold">Disconnect Account</h1>
                <button
                  className="cc-text-red-600 cc-bg-red-200 cc-px-4 cc-py-2 cc-font-semibold cc-rounded-md cc-flex cc-items-center cc-space-x-2 cc-cursor-pointer"
                  onClick={async () => {
                    setIsRevokingDataSource(true);
                    const revokeAccessResponse = await revokeAccessToDataSource(
                      {
                        accessToken: accessToken,
                        environment: 'DEVELOPMENT',
                        dataSourceId: viewSelectedAccountData.id,
                      }
                    );
                    if (revokeAccessResponse.status === 200) {
                      toast.success('Successfully disconnected account');
                      setIsRevokingDataSource(false);
                      setViewSelectedAccountData(null);
                      setActiveStep(1);
                    } else {
                      toast.error('Error disconnecting account');
                      setIsRevokingDataSource(false);
                    }
                  }}
                >
                  {isRevokingDataSource ? (
                    <VscLoading className="animate-spin" />
                  ) : (
                    <VscDebugDisconnect />
                  )}

                  <span>Disconnect</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grow cc-w-full cc-h-full cc-items-center cc-justify-center cc-flex">
            {connected.length === 0 ? (
              <div className="cc-flex cc-flex-col cc-items-center cc-justify-center">
                <p className="cc-text-gray-500 cc-text-sm">
                  No account connected
                </p>
              </div>
            ) : (
              <div className="cc-flex cc-flex-col cc-items-center cc-justify-center">
                <p className="cc-text-gray-500 cc-text-sm">
                  Select an account to view files
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThirdPartyHome;
