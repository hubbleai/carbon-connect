import React, { useEffect, useState } from 'react';
import { Table, Column, InfiniteLoader, AutoSizer } from 'react-virtualized';
import { toast } from 'react-toastify';
import { useCarbon } from '../contexts/CarbonContext';
import { HiArrowLeft } from 'react-icons/hi';
import { FixedSizeList as List } from 'react-window';
import FileData from './FileData';
import { getUserFiles, revokeAccessToDataSource } from 'carbon-connect-js';
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
  const [files, setFiles] = useState([]);
  const [hasMoreFiles, setHasMoreFiles] = useState(true);
  const [offset, setOffset] = useState(0);

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

    // if (integrationName !== 'NOTION' && connected.length !== 0) {
    //   const syncedAccount = connected.find(
    //     (account) => account.data_source_type === integrationName
    //   );
    //   setViewSelectedAccountData(syncedAccount || null);
    // }
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
      setOffset(offset + count);
    }
  };

  const isRowLoaded = ({ index }) => {
    return !!files[index];
  };

  const fetchRelevantFiles = async (dataSourceType) => {
    const userFilesResponse = await getUserFiles({
      accessToken: accessToken,
      environment: 'DEVELOPMENT',
      filters: {
        source: dataSourceType,
      },
    });

    if (userFilesResponse.status === 200) {
      console.log('userFilesResponse', userFilesResponse);
    }
  };

  useEffect(() => {
    if (integrationName === 'LOCAL_FILES') fetchRelevantFiles(['LOCAL_FILES']);
    else if (integrationName === 'WEB_SCRAPER')
      fetchRelevantFiles(['WEB_SCRAPE']);
    else if (integrationName === 'NOTION')
      fetchRelevantFiles(['NOTION', 'NOTION_DATABASE']);
    else fetchRelevantFiles([integrationName]);
  }, []);

  const dateCellRenderer = ({ cellData }) => {
    // Format date using moment.js or JavaScript's Date object
    const dateString = new Date(cellData).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const timeString = new Date(cellData).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    return dateString + ' ' + timeString;
  };

  const statusCellRenderer = ({ cellData }) => {
    return <span className="">{cellData}</span>; // Add your own styling for statusPill
  };

  return (
    <div className="cc-h-full cc-w-full cc-flex cc-flex-col">
      <div className="cc-flex cc-flex-row cc-w-full cc-h-28 cc-items-center cc-px-4 cc-justify-between cc-bg-gray-200 cc-rounded-[6px] cc-space-x-2">
        <div className="cc-flex cc-flex-row cc-items-center cc-space-x-4">
          <HiArrowLeft
            onClick={() => {
              if (!entryPoint) setActiveStep(1);
              else setActiveStep(0);
            }}
            className="cc-cursor-pointer cc-h-6 cc-w-6 cc-text-gray-400"
          />

          <div className="cc-flex cc-bg-white cc-border cc-rounded-md cc-w-28 cc-h-28 cc-translate-y-6 cc-items-center cc-justify-center">
            {integrationData?.icon}
          </div>

          <div className="cc-flex cc-flex-col cc-space-y-2 cc-mr-2">
            <div className="cc-flex cc-space-x-2 cc-text-xl cc-items-center cc-text-black">
              <p>{integrationData?.name}</p>
            </div>
            <div className="cc-text-xs cc-text-gray-500 cc-truncate">
              {integrationData?.description}
            </div>
          </div>

          {!isLoading && connected?.length === 0 ? (
            <button
              className="cc-bg-black cc-text-white cc-cursor-pointer cc-py-2 cc-px-4 cc-text-sm cc-rounded-md"
              onClick={() => handleServiceOAuthFlow(integrationData)}
            >
              Connect account
            </button>
          ) : (
            <select
              className="cc-py-2 cc-px-4 cc-rounded-md cc-w-44"
              onChange={(e) => {
                const selectedAccount = connected.find(
                  (account) =>
                    account.data_source_external_id === e.target.value
                );
                setViewSelectedAccountData(selectedAccount || null);
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
                <div className="cc-w-full cc-grow cc-h-full cc-flex">
                  <InfiniteLoader
                    isRowLoaded={isRowLoaded}
                    loadMoreRows={loadMoreRows}
                    rowCount={hasMoreFiles ? files.length + 1 : files.length}
                  >
                    {({ onRowsRendered, registerChild }) => (
                      <Table
                        width={688}
                        height={300}
                        headerHeight={20}
                        rowHeight={30}
                        rowCount={files.length}
                        rowGetter={({ index }) => files[index]}
                        onRowsRendered={onRowsRendered}
                        ref={registerChild}
                        onRowClick={({ index }) => setSelectedRowIndex(index)}
                        rowClassName={({ index }) =>
                          index === selectedRowIndex ? 'selectedRow' : ''
                        }
                      >
                        <Column label="File Name" dataKey="name" width={288} />
                        <Column
                          label="Status"
                          dataKey="sync_status"
                          width={200}
                          cellRenderer={statusCellRenderer}
                        />
                        <Column
                          label="Last Sync Time"
                          dataKey="last_sync"
                          width={200}
                          cellRenderer={dateCellRenderer}
                        />
                      </Table>
                    )}
                  </InfiniteLoader>
                </div>
                // <List
                //   height={375}
                //   itemCount={viewSelectedAccountData.synced_files.length}
                //   itemSize={35}
                //   width={'100%'}
                // >
                //   {({ index, style }) => (
                //     <FileData
                //       style={style}
                //       file={viewSelectedAccountData.synced_files[index]}
                //     />
                //   )}
                // </List>
              ))}

            {activeTab === 'config' && (
              <div className="cc-flex cc-flex-row cc-w-full cc-border cc-rounded-md cc-border-gray-500 cc-mt-2 cc-px-4 cc-py-2 cc-items-center">
                <h1 className="cc-grow cc-font-semibold">Disconnect Account</h1>
                <button
                  className="cc-text-red-600 cc-bg-red-200 cc-px-4 cc-py-2 cc-font-semibold cc-rounded-md cc-flex cc-items-center cc-space-x-2 cc-cursor-pointer"
                  onClick={async () => {
                    console.log(
                      'Seclected Datasource: ',
                      viewSelectedAccountData
                    );
                    setIsRevokingDataSource(true);
                    const revokeAccessResponse = await revokeAccessToDataSource(
                      {
                        accessToken: accessToken,
                        environment: 'DEVELOPMENT',
                        dataSourceId: viewSelectedAccountData.id,
                      }
                    );
                    if (revokeAccessResponse.status === 200) {
                      console.log(
                        'Revoke Access Response: ',
                        revokeAccessResponse
                      );
                      toast.success('Successfully disconnected account');
                      setIsRevokingDataSource(false);
                      setViewSelectedAccountData(null);
                      setActiveStep(1);
                    } else {
                      console.log(
                        'Revoke Access Response: ',
                        revokeAccessResponse
                      );
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
