import React, { useEffect, useState } from 'react';

import { darkenColor } from '../utils/helpers';

import * as Dialog from '@radix-ui/react-dialog';
import { HiArrowLeft, HiUpload, HiInformationCircle } from 'react-icons/hi';
import { toast } from 'react-toastify';

import '../index.css';
import { BASE_URL, onSuccessEvents, SYNC_FILES_ON_CONNECT } from '../constants';
import { LuLoader2 } from 'react-icons/lu';
import { useCarbon } from '../contexts/CarbonContext';

function SalesforceScreen({
    setActiveStep,
    entryPoint,
    environment,
    tags,
    onSuccess,
    onError,
    primaryBackgroundColor,
    primaryTextColor,
}) {
    const [salesforceDomain, setSalesforceDomain] = useState('');
    const [submitButtonHoveredState, setSubmitButtonHoveredState] =
        useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [service, setService] = useState(null);

    useEffect(() => {
        setService(
            processedIntegrations.find((integration) => integration.id === 'SALESFORCE')
        );
    }, [processedIntegrations]);

    const {
        accessToken,
        processedIntegrations,
        topLevelChunkSize,
        topLevelOverlapSize,
        defaultChunkSize,
        defaultOverlapSize,
        authenticatedFetch,
        secondaryBackgroundColor,
        secondaryTextColor,
        embeddingModel,
        generateSparseVectors,
        prependFilenameToChunks
    } = useCarbon();

    const fetchOauthURL = async () => {
        try {
            if (!salesforceDomain) {
                toast.error('Please enter your salesforce domain.');
                return;
            }
            setIsLoading(true);
            const chunkSize =
                service?.chunkSize || topLevelChunkSize || defaultChunkSize;
            const overlapSize =
                service?.overlapSize || topLevelOverlapSize || defaultOverlapSize;
            const skipEmbeddingGeneration = service?.skipEmbeddingGeneration || false;
            const embeddingModelValue =
                service?.embeddingModel || embeddingModel || null;
            const generateSparseVectorsValue =
                service?.generateSparseVectors || generateSparseVectors || false;
            const prependFilenameToChunksValue =
                service?.prependFilenameToChunks || prependFilenameToChunks || false;
            const syncFilesOnConnection = service?.syncFilesOnConnection ?? SYNC_FILES_ON_CONNECT

            const domain = salesforceDomain
                .replace('https://www.', '')
                .replace('http://www.', '')
                .replace('https://', '')
                .replace('http://', '')
                .replace(/\/$/, '')
                .trim();

            const requestObject = {
                tags: tags,
                service: service?.data_source_type,
                chunk_size: chunkSize,
                chunk_overlap: overlapSize,
                skip_embedding_generation: skipEmbeddingGeneration,
                salesforce_domain: domain,
                embedding_model: embeddingModelValue,
                generate_sparse_vectors: generateSparseVectorsValue,
                prepend_filename_to_chunks: prependFilenameToChunksValue,
                sync_files_on_connection: syncFilesOnConnection
            };

            const response = await authenticatedFetch(
                `${BASE_URL[environment]}/integrations/oauth_url`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Token ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestObject),
                }
            );

            const oAuthURLResponseData = await response.json();

            if (response.status === 200) {
                onSuccess({
                    status: 200,
                    data: null,
                    action: onSuccessEvents.INITIATE,
                    event: onSuccessEvents.INITIATE,
                    integration: 'SALESFORCE',
                });
                setIsLoading(false);
                const oauthWindow = window.open('', '_blank');
                oauthWindow.location.href = oAuthURLResponseData.oauth_url;
            } else {
                toast.error(oAuthURLResponseData.detail);
                setIsLoading(false);
                onError({
                    status: 400,
                    data: [{ message: oAuthURLResponseData.detail }],
                    action: onSuccessEvents.ERROR,
                    event: onSuccessEvents.ERROR,
                    integration: 'SALESFORCE',
                });
            }
        } catch (error) {
            toast.error('Error getting oAuth URL. Please try again.');
            setIsLoading(false);
            onError({
                status: 400,
                data: [{ message: 'Error getting oAuth URL. Please try again.' }],
                action: onSuccessEvents.ERROR,
                event: onSuccessEvents.ERROR,
                integration: 'SALESFORCE',
            });
        }
    };

    return (
        <div className="cc-flex cc-flex-col cc-h-[540px] cc-items-center cc-relative">
            <Dialog.Title className="cc-text-lg cc-mb-4 cc-font-medium cc-w-full">
                <div className="cc-w-full cc-flex cc-items-center cc-relative cc-justify-center">
                    <HiArrowLeft
                        onClick={() => setActiveStep(entryPoint ? 0 : 1)}
                        className="cc-cursor-pointer cc-h-6 cc-w-6 cc-text-gray-400 cc-absolute cc-left-0"
                    />
                    {service?.icon}
                </div>
            </Dialog.Title>

            <>
                <div className="py-4 cc-flex cc-grow cc-w-full">
                    <div className="cc-flex cc-flex-col cc-justify-start cc-h-full cc-items-start cc-w-full cc-space-y-4">
                        <span className="cc-text-sm">
                            Please enter the Salesforce{' '}
                            <span className="cc-bg-gray-200 cc-px-1 cc-py-0.5 cc-rounded cc-font-mono cc-text-red-400">
                                domain
                            </span>{' '}
                            of the account you wish to connect. Do not include scheme, path, or trailing slashes.
                        </span>

                        <div className="cc-flex cc-space-x-2 cc-items-center cc-w-full cc-h-10">
                            <input
                                type="text"
                                className="cc-p-2 cc-flex-grow cc-text-gray-700 cc-text-sm cc-border-4 cc-border-gray-400"
                                style={{ borderRadius: '0.375rem' }}
                                placeholder="domain.my.salesforce.com"
                                value={salesforceDomain}
                                onChange={(e) => setSalesforceDomain(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <p
                    className="cc-flex cc-text-gray-500 cc-p-2 cc-space-x-2 cc-bg-gray-100 cc-rounded-md cc-mb-2 cc-items-center"
                    style={{
                        color: secondaryTextColor,
                        backgroundColor: secondaryBackgroundColor,
                    }}
                >
                    <HiInformationCircle className="cc-w-8 cc-h-8" />
                    <span className="text-xs">
                        By connecting to Salesforce, you are providing us with access to your
                        Salesforce user profile and Knowledge articles. We do not modify any data.
                    </span>
                </p>

                <button
                    className={`cc-w-full cc-h-12 cc-flex cc-flex-row cc-items-center cc-justify-center cc-rounded-md cc-cursor-pointer cc-space-x-2`}
                    style={{
                        backgroundColor: submitButtonHoveredState
                            ? darkenColor(primaryBackgroundColor, -10)
                            : primaryBackgroundColor,
                        color: primaryTextColor,
                    }}
                    onClick={fetchOauthURL}
                    onMouseEnter={() => setSubmitButtonHoveredState(true)}
                    onMouseLeave={() => setSubmitButtonHoveredState(false)}
                >
                    {isLoading ? (
                        <LuLoader2 className={`cc-animate-spin`} />
                    ) : (
                        <HiUpload />
                    )}
                    <p>Connect</p>
                </button>
            </>
        </div>
    );
}

export default SalesforceScreen;
