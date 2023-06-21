import React, { useState } from 'react';
import { HiLockClosed, HiLink } from 'react-icons/hi';
import '../index.css';
import carbonLogo from '../carbon.svg';

const CarbonAnnouncement = ({ orgName, brandIcon, setActiveStep }) => {
  return (
    <div className="flex flex-col h-full items-center justify-between ">
      <div className="flex pt-8 -space-x-2">
        <img
          src={brandIcon}
          alt="Rubber Icon"
          className="rounded-full border w-16"
        />

        <img
          src={carbonLogo}
          alt="Carbon Icon"
          className="rounded-full border w-16"
        ></img>
      </div>
      <h1 className="text-xl font-light">
        <span className="font-normal">{orgName}</span> uses{' '}
        <span className="font-normal">Carbon</span> <br />
        to connect your data.
      </h1>

      <ul className="">
        <li className="flex flex-row items-start w-full space-x-2 py-2 px-4">
          <HiLockClosed className="w-5 h-5 mr-1 text-gray-400 mt-1" />
          <div className="flex flex-col gap-y-1">
            <h1 className="text-base font-medium">Private</h1>
            <p className="text-sm font-normal text-gray-400">
              Your credentials will never be made available to Rubber.
            </p>
          </div>
        </li>
        <li className="flex flex-row items-start w-full space-x-2 py-2 px-4">
          <HiLink className="w-7 h-7 mr-1 text-gray-400" />
          <div className="flex flex-col gap-y-1">
            <h1 className="text-md font-medium">Secure</h1>
            <p className="text-sm font-normal text-gray-400">
              You can select to give Rubber access to specific information only.
            </p>
          </div>
        </li>
      </ul>

      <div className="flex flex-col space-y-3 w-full items-center">
        <p className="text-xs text-center text-gray-400">
          {`By continuing, you agree to Carbon's`}
          <br></br>
          <u>{`User Terms and Privacy Policy.`}</u>
        </p>
        <button
          className="w-full h-12 flex flex-row bg-black text-white items-center justify-center rounded-md cursor-pointer"
          onClick={() => setActiveStep(1)}
        >
          <p>Connect</p>
        </button>
      </div>
    </div>
  );
};

export default CarbonAnnouncement;
