import React, { useEffect, useState } from 'react';

import { darkenColor } from '../utils/helpers';

import * as Dialog from '@radix-ui/react-dialog';
import { HiArrowLeft, HiUpload, HiInformationCircle } from 'react-icons/hi';
import { toast } from 'react-toastify';

import '../index.css';
import { BASE_URL, onSuccessEvents } from '../constants';
import { LuLoader2 } from 'react-icons/lu';
import { useCarbon } from '../contexts/CarbonContext';

function GitbookScreen({
    setActiveStep,
    entryPoint,
    environment,
    tags,
    onSuccess,
    onError,
    primaryBackgroundColor,
    primaryTextColor,
}) {
    const [organization, setOrganization] = useState('');
    const [gbToken, setGBToken] = useState('');
    const [submitButtonHoveredState, setSubmitButtonHoveredState] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [service, setService] = useState(null);

    useEffect(() => {
        setService(
            processedIntegrations.find(
                (integration) => integration.id === 'GITBOOK'
            )
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
        prependFilenameToChunks,
    } = useCarbon();

    const connectGitbookAccount = async () => {
        try {
            if (!organization) {
                toast.error("Please enter your organization's name.");
                return;
            }
            if (!gbToken) {
                toast.error('Please enter your access token.');
                return;
            }
            onSuccess({
                status: 200,
                data: null,
                action: onSuccessEvents.INITIATE,
                event: onSuccessEvents.INITIATE,
                integration: 'GITBOOK',
            });
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
            const syncFilesOnConnection = service?.syncFilesOnConnection ?? true

            const requestObject = {
                organization: organization,
                access_token: gbToken,
                tags: tags,
                chunk_size: chunkSize,
                chunk_overlap: overlapSize,
                skip_embedding_generation: skipEmbeddingGeneration,
                embedding_model: embeddingModelValue,
                generate_sparse_vectors: generateSparseVectorsValue,
                prepend_filename_to_chunks: prependFilenameToChunksValue,
                sync_files_on_connection: syncFilesOnConnection
            };

            const response = await authenticatedFetch(
                `${BASE_URL[environment]}/integrations/gitbook`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Token ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestObject),
                }
            );

            const responseData = await response.json();

            if (response.status === 200) {
                onSuccess({
                    status: 200,
                    data: null,
                    action: onSuccessEvents.ADD,
                    event: onSuccessEvents.ADD,
                    integration: 'GITBOOK',
                });
                setIsLoading(false);
                toast.info('Gitbook sync initiated.');
                setGBToken('')
                setOrganization('')
            } else {
                toast.error(responseData.detail);
                setIsLoading(false);
                onError({
                    status: 400,
                    data: [{ message: responseData.detail }],
                    action: onSuccessEvents.ERROR,
                    event: onSuccessEvents.ERROR,
                    integration: 'GITBOOK',
                });
            }
        } catch (error) {
            toast.error('Error connecting your Gitbook. Please try again.');
            setIsLoading(false);
            onError({
                status: 400,
                data: [
                    { message: 'Error connecting your Gitbook. Please try again.' },
                ],
                action: onSuccessEvents.ERROR,
                event: onSuccessEvents.ERROR,
                integration: 'GITBOOK',
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
                            Please enter the Gitbook{' '}
                            <span className="cc-bg-gray-200 cc-px-1 cc-py-0.5 cc-rounded cc-font-mono cc-text-red-400">
                                Organization name
                            </span>{' '}
                            and{' '}
                            <span className="cc-bg-gray-200 cc-px-1 cc-py-0.5 cc-rounded cc-font-mono cc-text-red-400">
                                access token
                            </span>{' '}
                            of the account you wish to connect.
                        </span>

                        <div className="cc-flex cc-space-x-2 cc-items-center cc-w-full cc-h-10">
                            <input
                                type="text"
                                className="cc-p-2 cc-flex-grow cc-text-gray-700 cc-text-sm cc-border-4 cc-border-gray-400"
                                style={{ borderRadius: '0.375rem' }}
                                placeholder="Organization"
                                value={organization}
                                onChange={(e) => setOrganization(e.target.value)}
                            />
                        </div>
                        <div className="cc-flex cc-space-x-2 cc-items-center cc-w-full cc-h-10">
                            <input
                                type="text"
                                className="cc-p-2 cc-flex-grow cc-text-gray-700 cc-text-sm cc-border-4 cc-border-gray-400"
                                style={{ borderRadius: '0.375rem' }}
                                placeholder="Token"
                                value={gbToken}
                                onChange={(e) => setGBToken(e.target.value)}
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
                        By connecting to Gitbook, you are providing us with access to your
                        Gitbook account with the level of permissions your access token has.
                        We will use this access to import your data into Carbon. We will not modify your data in any way.
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
                    onClick={connectGitbookAccount}
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

export default GitbookScreen;
