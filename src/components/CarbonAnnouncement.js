import React, { useState } from 'react';
import { HiLockClosed, HiLink } from 'react-icons/hi';
import '../index.css';
import carbonLogo from '../carbon.svg';

const CarbonAnnouncement = ({ orgName, brandIcon, setActiveStep }) => {
  return (
    <div className="cc-flex cc-flex-col cc-h-full cc-items-center cc-justify-between">
      <div className="cc-flex cc-pt-8 -cc-space-x-2">
        <img
          src={brandIcon}
          alt={`${orgName} Icon`}
          className="cc-rounded-full cc-border cc-w-16"
        />

        <img
          src={carbonLogo}
          alt="Carbon Icon"
          className="cc-rounded-full cc-border cc-w-16"
        ></img>
      </div>
      <h1 className="cc-text-xl cc-font-light">
        <span className="cc-font-normal">{orgName}</span> uses{' '}
        <span className="cc-font-normal">Carbon</span> <br />
        to connect your data.
      </h1>

      <ul className="">
        <li className="cc-flex cc-flex-row cc-items-start cc-w-full cc-space-x-2 cc-py-2 cc-px-4">
          <HiLockClosed className="cc-w-5 cc-h-5 cc-mr-1 cc-text-gray-400 cc-mt-1" />
          <div className="cc-flex cc-flex-col cc-gap-y-1">
            <h1 className="cc-text-base cc-font-medium">Private</h1>
            <p className="cc-text-sm cc-font-normal cc-text-gray-400">
              Your credentials will never be made available to {orgName}.
            </p>
          </div>
        </li>
        <li className="cc-flex cc-flex-row cc-items-start cc-w-full cc-space-x-2 cc-py-2 cc-px-4">
          <HiLink className="cc-w-7 cc-h-7 cc-mr-1 cc-text-gray-400" />
          <div className="cc-flex cc-flex-col cc-gap-y-1">
            <h1 className="cc-text-md cc-font-medium">Secure</h1>
            <p className="cc-text-sm cc-font-normal cc-text-gray-400">
              You can select to give {orgName} access to specific information
              only.
            </p>
          </div>
        </li>
      </ul>

      <div className="cc-flex cc-flex-col cc-space-y-3 cc-w-full cc-items-center">
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
        <button
          className="cc-w-full cc-h-12 cc-flex cc-flex-row cc-bg-black cc-text-white cc-items-center cc-justify-center cc-rounded-md cc-cursor-pointer"
          onClick={() => setActiveStep(1)}
        >
          <p>Connect</p>
        </button>
      </div>
    </div>
  );
};

export default CarbonAnnouncement;
