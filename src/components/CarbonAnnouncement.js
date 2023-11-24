import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { HiLockClosed, HiLink, HiX } from 'react-icons/hi';
import '../index.css';
import carbonLogo from '../carbon.svg';
import { useCarbon } from '../contexts/CarbonContext';
import { darkenColor } from '../utils/helpers';
import * as Dialog from '@radix-ui/react-dialog';

const Feature = ({ Icon, title, children }) => (
  <li className="cc-flex cc-flex-row cc-items-start cc-w-full cc-space-x-2 cc-py-2 cc-px-4 cc-text-black">
    <div className="cc-w-1/12">
      <Icon className="cc-w-6 cc-h-6 cc-mr-1 cc-text-gray-400" />
    </div>
    {/* <div className="cc-w-1/12"></div> */}
    <div className="cc-flex cc-flex-col cc-gap-y-1 cc-w-10/12">
      <h1 className="cc-text-base cc-font-medium">{title}</h1>
      <p className="cc-text-sm cc-font-normal cc-text-gray-400">{children}</p>
    </div>
  </li>
);

Feature.propTypes = {
  Icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const CarbonAnnouncement = ({ setActiveStep, activeIntegrations }) => {
  const [connectButtonHoveredState, setConnectButtonHoveredState] =
    useState(false);

  const {
    orgName,
    brandIcon,
    primaryBackgroundColor,
    primaryTextColor,
    secondaryBackgroundColor,
    secondaryTextColor,
    entryPoint,
    entryPointIntegrationObject,
    handleServiceOAuthFlow,
    whiteLabelingData,
    tosURL,
    privacyPolicyURL,
    navigateBackURL,
    manageModalOpenState,
    backButtonText,
  } = useCarbon();

  const isEntryPoint = Boolean(entryPoint);
  const isWhiteLabeledOrg = Boolean(whiteLabelingData?.remove_branding);
  const isWhiteLabeledEntryPoint = Boolean(
    isEntryPoint &&
      whiteLabelingData?.integrations &&
      whiteLabelingData?.integrations?.[entryPoint]
  );

  const handleButtonClick = () => {
    if (entryPointIntegrationObject?.active) {
      if (!entryPointIntegrationObject?.requiresOAuth) {
        setActiveStep(entryPointIntegrationObject.data_source_type);
      } else {
        if (entryPointIntegrationObject?.multiStep) {
          setActiveStep(entryPointIntegrationObject.data_source_type);
          return;
        }
        handleServiceOAuthFlow(entryPointIntegrationObject);
      }
    } else {
      setActiveStep(1);
    }
  };

  const navigateBack = () => {
    if (navigateBackURL) window.open(navigateBackURL, '_self');
    else manageModalOpenState(false);
  };

  return (
    <div className="cc-flex cc-flex-col cc-items-center cc-relative cc-h-full">
      <Dialog.Title className="cc-text-lg cc-mb-4 cc-font-medium cc-w-full cc-absolute">
        <div className="cc-w-full cc-flex cc-items-center cc-space-x-4">
          <h1 className="cc-grow"></h1>
          <HiX
            onClick={() => manageModalOpenState(false)}
            className="cc-cursor-pointer cc-h-5 cc-w-5"
            style={{
              color: primaryTextColor,
            }}
          />
        </div>
      </Dialog.Title>
      <div className="cc-flex cc-flex-col cc-h-full cc-items-center cc-justify-between cc-p-6">
        <div className="cc-flex cc-pt-8 -cc-space-x-2">
          <img
            src={brandIcon}
            alt={`${orgName} Icon`}
            className="cc-rounded-full cc-border cc-w-16"
          />
          {!isWhiteLabeledOrg && (
            <img
              src={carbonLogo}
              alt="Carbon Icon"
              className="cc-rounded-full cc-border cc-w-16"
            />
          )}
        </div>
        {isWhiteLabeledOrg ? (
          <div className="cc-text-xl cc-font-light cc-w-full cc-flex cc-justify-center cc-items-center cc-text-center">
            <div>
              <span className="cc-font-normal">{orgName}</span>
              <span> wants to access your data </span>
              {entryPointIntegrationObject?.announcementName && (
                <>
                  <span>on</span>
                  <span className="cc-font-normal">
                    {` ${entryPointIntegrationObject?.name}`}
                  </span>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="cc-text-xl cc-font-light cc-w-full cc-flex cc-justify-center cc-items-center cc-text-center">
            <div>
              <span className="cc-font-normal">{orgName}</span>
              <span> uses </span>
              <span className="cc-font-normal">Carbon </span>
              <span>
                to connect{' '}
                {entryPointIntegrationObject?.announcementName ? (
                  <span className="cc-font-normal">
                    {entryPointIntegrationObject?.name}
                  </span>
                ) : (
                  <span>your data</span>
                )}
              </span>
            </div>
          </div>
        )}
        <ul className="">
          <Feature Icon={HiLockClosed} title="Private">
            Your credentials will never be made available to {orgName}
          </Feature>
          <Feature Icon={HiLink} title="Secure">
            {isWhiteLabeledOrg
              ? `By connecting, your data is securely shared with ${orgName} and 3rd parties like OpenAI.`
              : `By connecting with Carbon, your data is securely shared with ${orgName} and 3rd parties like OpenAI.`}
          </Feature>
        </ul>
        <div className="cc-flex cc-flex-col cc-space-y-3 cc-w-full cc-items-center">
          {isWhiteLabeledOrg ? (
            <p className="cc-text-xs cc-text-center cc-text-gray-400">
              {`By continuing, you agree to ${
                isWhiteLabeledEntryPoint ? orgName + "'s" : 'the following'
              }`}

              <br></br>
              <a
                href={tosURL || 'https://carbon.ai/terms'}
                target="_blank"
                className="cc-cursor-pointer"
              >
                <u>Terms of Service</u>
              </a>
              {` and `}
              <a
                href={privacyPolicyURL || 'https://carbon.ai/privacy'}
                target="_blank"
                className="cc-cursor-pointer"
              >
                <u>Privacy Policy</u>
              </a>
              {`.`}
            </p>
          ) : (
            <p className="cc-text-xs cc-text-center cc-text-gray-400">
              {`By continuing, you agree to Carbon's`}
              <br></br>
              <a
                href="https://carbon.ai/terms"
                target="_blank"
                className="cc-cursor-pointer"
              >
                <u>Terms of Service</u>
              </a>
              {` and `}
              <a
                href="https://carbon.ai/privacy"
                target="_blank"
                className="cc-cursor-pointer"
              >
                <u>Privacy Policy</u>
              </a>
              {`.`}
            </p>
          )}

          {entryPoint === 'GOOGLE_DRIVE' ? (
            <div
              className="cc-bg-google-blue cc-w-52 cc-h-11 cc-rounded-sm cc-shadow-md cc-relative cc-cursor-pointer hover:cc-shadow-lg active:cc-bg-button-active-blue cc-flex cc-flex-row cc-p-0.5 cc-space-x-[1.125rem] cc-items-center"
              onClick={handleButtonClick}
            >
              <div className="cc-bg-white cc-w-10 cc-h-10 cc-rounded-sm cc-flex">
                <img
                  className="cc-w-5 cc-h-5 cc-items-center cc-justify-center cc-m-auto"
                  src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                  alt="Google logo"
                />
              </div>
              <p className="cc-text-white cc-text-sm cc-items-center cc-justify-center cc-font-roboto cc-font-medium">
                <b>Sign in with Google</b>
              </p>
            </div>
          ) : (
            <button
              className="cc-w-full cc-h-12 cc-flex cc-flex-row cc-items-center cc-justify-center cc-rounded-md cc-cursor-pointer"
              style={{
                backgroundColor: connectButtonHoveredState
                  ? darkenColor(primaryBackgroundColor, -10)
                  : primaryBackgroundColor,

                color: primaryTextColor,
              }}
              onClick={handleButtonClick}
              onMouseEnter={() => setConnectButtonHoveredState(true)}
              onMouseLeave={() => setConnectButtonHoveredState(false)}
            >
              <p>Connect</p>
            </button>
          )}

          {navigateBackURL && (
            <p
              className="cc-flex cc-flex-row cc-items-center cc-justify-center cc-cursor-pointer cc-text-xs hover:cc-underline"
              style={{
                color: secondaryTextColor,
              }}
              onClick={navigateBack}
            >
              {backButtonText || 'Go back'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

CarbonAnnouncement.propTypes = {
  setActiveStep: PropTypes.func.isRequired,
};

export default CarbonAnnouncement;
