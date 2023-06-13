import React, { useState } from 'react';
import { HiLockClosed, HiLink } from 'react-icons/hi';
import '../index.css';
import carbonLogo from '../carbon.svg';

const CarbonAnnouncement = ({ setActiveStep }) => {
  return (
    <div
      className="flex flex-col h-full items-center justify-between "
      //   style={{
      //     height: '100%',
      //     display: 'flex',
      //     flexDirection: 'column',
      //     justifyContent: 'space-between',
      //     alignItems: 'center',
      //   }}
    >
      <div
        className="flex pt-8 -space-x-2"
        // style={{
        //   display: 'flex',
        //   paddingTop: '2rem',
        // }}
      >
        <img
          src="/assets/images/icon-integration.png"
          alt="Rubber Icon"
          className="rounded-full border w-16"
          //   style={{
          //     borderRadius: '9999px',
          //     border: '1px solid #E5E7EB',
          //     width: '4rem',
          //   }}
        />

        <img
          src={carbonLogo}
          alt="Carbon Icon"
          className="rounded-full border w-16"
          //   style={{
          //     borderRadius: '9999px',
          //     border: '1px solid #E5E7EB',
          //     width: '4rem',
          //   }}
        ></img>
      </div>
      <h1
        className="text-xl font-light"
        // style={{
        //   textAlign: 'center',
        //   fontSize: '1.25rem',
        //   fontWeight: '300',
        //   lineHeight: '1.75rem',
        // }}
      >
        <span
          className="font-normal"
          //   style={{
          //     fontWeight: '400',
          //   }}
        >
          Rubber
        </span>{' '}
        uses{' '}
        <span
          className="font-normal"
          //   style={{
          //     fontWeight: '400',
          //   }}
        >
          Carbon
        </span>{' '}
        <br />
        to connect your data.
      </h1>

      <ul className="">
        <li
          className="flex flex-row items-start w-full space-x-2 py-2 px-4"
          //   style={{
          //     display: 'flex',
          //     flexDirection: 'row',
          //     alignItems: 'start',
          //     width: '100%',
          //     gap: '0.5rem',
          //     paddingTop: '0.5rem',
          //     paddingBottom: '0.5rem',
          //     paddingLeft: '1rem',
          //     paddingRight: '1rem',
          //   }}
        >
          <HiLockClosed
            className="w-5 h-5 mr-1 text-gray-400 mt-1"
            // style={{
            //   width: '1.25rem',
            //   height: '1.25rem',
            //   marginRight: '0.25rem',
            //   marginTop: '0.25rem',
            //   color: '#9CA3AF',
            // }}
          />
          <div
            className="flex flex-col gap-y-1"
            // style={{
            //   display: 'flex',
            //   flexDirection: 'column',
            //   rowGap: '0.25rem',
            // }}
          >
            <h1
              className="text-base font-medium"
              //   style={{
              //     fontSize: '1rem',
              //     lineHeight: '1.5rem',
              //     fontWeight: '500',
              //   }}
            >
              Private
            </h1>
            <p
              className="text-sm font-normal text-gray-400"
              //   style={{
              //     fontSize: '0.875rem',
              //     lineHeight: '1.25rem',
              //     fontWeight: '400',
              //     color: '#9CA3AF',
              //   }}
            >
              Your credentials will never be made available to Rubber.
            </p>
          </div>
        </li>
        <li
          className="flex flex-row items-start w-full space-x-2 py-2 px-4"
          //   style={{
          //     display: 'flex',
          //     flexDirection: 'row',
          //     alignItems: 'start',
          //     width: '100%',
          //     gap: '0.5rem',
          //     paddingTop: '0.5rem',
          //     paddingBottom: '0.5rem',
          //     paddingLeft: '1rem',
          //     paddingRight: '1rem',
          //   }}
        >
          <HiLink
            className="w-7 h-7 mr-1 text-gray-400"
            // style={{
            //   width: '1.75rem',
            //   height: '1.75rem',
            //   marginRight: '0.25rem',
            //   color: '#9CA3AF',
            // }}
          />
          <div
            className="flex flex-col gap-y-1"
            // style={{
            //   display: 'flex',
            //   flexDirection: 'column',
            //   rowGap: '0.25rem',
            // }}
          >
            <h1
              className="text-md font-medium"
              //   style={{
              //     fontSize: '1rem',
              //     lineHeight: '1.5rem',
              //     fontWeight: '500',
              //   }}
            >
              Secure
            </h1>
            <p
              className="text-sm font-normal text-gray-400"
              //   style={{
              //     fontSize: '0.875rem',
              //     lineHeight: '1.25rem',
              //     fontWeight: '400',
              //     color: '#9CA3AF',
              //   }}
            >
              You can select to give Rubber access to specific information only.
            </p>
          </div>
        </li>
      </ul>

      <div
        className="flex flex-col space-y-3 w-full items-center"
        // style={{
        //   display: 'flex',
        //   flexDirection: 'column',
        //   rowGap: '0.75rem',
        //   width: '100%',
        //   alignItems: 'center',
        // }}
      >
        <p
          className="text-xs text-center text-gray-400"
          //   style={{
          //     fontSize: '0.75rem',
          //     lineHeight: '1rem',
          //     fontWeight: '400',
          //     color: '#9CA3AF',
          //     textAlign: 'center',
          //   }}
        >
          {`By continuing, you agree to Carbon's`}
          <br></br>
          <u>{`User Terms and Privacy Policy.`}</u>
        </p>
        <button
          className="w-full h-12 flex flex-row bg-black text-white items-center justify-center rounded-md cursor-pointer"
          //   style={{
          //     width: '100%',
          //     height: '3rem',
          //     display: 'flex',
          //     flexDirection: 'row',
          //     backgroundColor: '#000000',
          //     color: '#FFFFFF',
          //     alignItems: 'center',
          //     justifyContent: 'center',
          //     borderRadius: '0.375rem',
          //     cursor: 'pointer',
          //   }}
          onClick={() => setActiveStep(1)}
        >
          <p>Connect</p>
        </button>
      </div>
    </div>
  );
};

export default CarbonAnnouncement;
