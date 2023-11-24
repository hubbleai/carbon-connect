import React, { useEffect, useState } from 'react';
import { useCarbon } from '../contexts/CarbonContext';
import { HiArrowLeft } from 'react-icons/hi';
import { FixedSizeList as List } from 'react-window';
import FileData from './FileData';

const ThirdPartyHome = ({
  integrationName,
  activeIntegrations,
  setActiveStep,
}) => {
  const [integrationData, setIntegrationData] = useState(null);
  const [connected, setConnected] = useState([]);
  const [canConnectMore, setCanConnectMore] = useState(false);
  const [viewSelectedAccountData, setViewSelectedAccountData] = useState(null);

  const { accessToken, processedIntegrations, entryPoint } = useCarbon();

  useEffect(() => {
    console.log('processedIntegrations');
    const integrationData = processedIntegrations.find(
      (integration) => integration.id === integrationName
    );
    setIntegrationData(integrationData);
  }, [processedIntegrations]);

  useEffect(() => {
    console.log('activeIntegrations');
    const connected = activeIntegrations.filter(
      (integration) => integration.data_source_type === integrationName
    );
    setConnected(connected);
  }, [activeIntegrations]);

  useEffect(() => {
    console.log('connected');
    if (integrationName === 'NOTION') setCanConnectMore(true);
    else if (connected.length !== 0) setCanConnectMore(false);
    else setCanConnectMore(true);

    if (integrationName !== 'NOTION' && connected.length !== 0) {
      const syncedAccount = connected.find(
        (account) => account.data_source_type === integrationName
      );
      setViewSelectedAccountData(syncedAccount || null);
    }
  }, [connected, integrationName]);

  return (
    <div className="cc-h-full cc-w-full cc-flex cc-flex-col">
      <div className="cc-flex cc-flex-row cc-w-full cc-h-28 cc-items-center cc-px-4 cc-justify-between cc-bg-gray-200 cc-rounded-[6px]">
        <div className="cc-flex cc-flex-row cc-items-center cc-space-x-4">
          <HiArrowLeft
            onClick={() => {
              if (!entryPoint) setActiveStep(1);
              else setActiveStep(0);
            }}
            className="cc-cursor-pointer cc-h-6 cc-w-6 cc-text-gray-400"
          />

          <div className="cc-flex cc-flex-col cc-space-y-2">
            <div className="cc-flex cc-space-x-2 cc-text-xl cc-items-center cc-text-black">
              {integrationData?.icon}
              <p>{integrationData?.name}</p>
            </div>
            <div className="cc-text-xs cc-text-gray-500">
              {integrationData?.description}
            </div>
          </div>
        </div>

        {canConnectMore && (
          <button
            className="cc-bg-black cc-text-white cc-cursor-pointer cc-py-2 cc-px-4 cc-text-sm cc-rounded-md"
            onClick={() => handleServiceOAuthFlow(integrationData)}
          >
            Connect Account
          </button>
        )}
      </div>

      <div className="cc-grow cc-flex cc-flex-col cc-py-2 cc-px-4 cc-space-y-4">
        {integrationName === 'NOTION' && (
          <div className="cc-flex cc-flex-row cc-w-full cc-space-x-2 cc-items-center cc-justify-center">
            <label>{`Connected ${integrationData?.name} Account`}</label>
            <select
              className="cc-py-2 cc-px-4 cc-rounded-md cc-grow"
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
                  account.data_source_external_id.split('|')[1];
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
          </div>
        )}

        {viewSelectedAccountData ? (
          <div className="cc-flex-col cc-flex cc-overflow-y-auto">
            <List
              height={375} // Adjust height as needed
              itemCount={viewSelectedAccountData.synced_files.length}
              itemSize={35} // Adjust item size as needed
              width={'100%'}
            >
              {({ index, style }) => (
                <FileData
                  style={style}
                  file={viewSelectedAccountData.synced_files[index]}
                />
              )}
            </List>
          </div>
        ) : (
          <div className="grow cc-w-full cc-h-full cc-items-center cc-justify-center cc-flex cc-bg-red-500">
            No Account Selected
          </div>
        )}
      </div>
    </div>
  );
};

export default ThirdPartyHome;
