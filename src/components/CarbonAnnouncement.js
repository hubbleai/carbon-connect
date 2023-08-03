import React from 'react';
import PropTypes from 'prop-types';
import { HiLockClosed, HiLink } from 'react-icons/hi';
import '../index.css';
import carbonLogo from '../carbon.svg';
import { useCarbonAuth } from '../contexts/AuthContext';

const Feature = ({ Icon, title, children }) => (
  <li className="cc-flex cc-flex-row cc-items-start cc-w-full cc-space-x-2 cc-py-2 cc-px-4">
    <Icon className="cc-w-7 cc-h-7 cc-mr-1 cc-text-gray-400" />
    <div className="cc-flex cc-flex-col cc-gap-y-1">
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
  const {
    orgName,
    brandIcon,
    primaryBackgroundColor,
    primaryTextColor,
    entryPoint,
    entryPointIntegrationObject,
    handleServiceOAuthFlow,
    whiteLabelingData,
    tosURL,
    privacyPolicyURL,
  } = useCarbonAuth();

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
        if (entryPointIntegrationObject?.data_source_type === 'GOOGLE_DOCS') {
          let googleDocsIndex = activeIntegrations.findIndex(
            (integration) => integration.data_source_type === 'GOOGLE_DOCS'
          );
          if (googleDocsIndex !== -1) {
            setActiveStep(entryPointIntegrationObject?.data_source_type);
            return;
          }
        }
        handleServiceOAuthFlow(entryPointIntegrationObject);
      }
    } else {
      setActiveStep(1);
    }
  };

  return (
    <div className="cc-flex cc-flex-col cc-h-full cc-items-center cc-justify-between">
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
            <span className="cc-font-normal">Carbon</span>
            <p>
              to connect{' '}
              {entryPointIntegrationObject?.announcementName ? (
                <span className="cc-font-normal">
                  {entryPointIntegrationObject?.name}
                </span>
              ) : (
                <span>your data</span>
              )}
            </p>
          </div>
        </div>
      )}
      <ul className="">
        <Feature Icon={HiLockClosed} title="Private">
          Your credentials will never be made available to {orgName}.
        </Feature>
        <Feature Icon={HiLink} title="Secure">
          You can select to give {orgName} access to specific information only.
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

        <button
          className="cc-w-full cc-h-12 cc-flex cc-flex-row cc-items-center cc-justify-center cc-rounded-md cc-cursor-pointer"
          style={{
            backgroundColor: primaryBackgroundColor,
            color: primaryTextColor,
          }}
          onClick={handleButtonClick}
        >
          <p>Connect</p>
        </button>
      </div>
    </div>
  );
};

CarbonAnnouncement.propTypes = {
  setActiveStep: PropTypes.func.isRequired,
};

export default CarbonAnnouncement;
