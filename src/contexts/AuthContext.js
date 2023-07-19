import React, { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext();
import { BsGoogle, BsCloudUpload } from 'react-icons/bs';
import { RxNotionLogo } from 'react-icons/rx';
import { CgWebsite } from 'react-icons/cg';
import { FaIntercom } from 'react-icons/fa';

const integrationsList = [
  {
    id: 'notion',
    subpath: 'notion',
    name: 'Notion',
    icon: <RxNotionLogo className="cc-w-8 cc-h-8" />,
    description: 'Lets your users connect their Notion accounts to Carbon.',
    active: true,
    data_source_type: 'NOTION',
    requiresOAuth: true,
  },
  {
    active: true,
    name: 'Google Docs',
    subpath: 'google',
    id: 'googleDocs',
    description: 'Lets your users connect their Google Docs to Carbon.',
    scope: 'docs',
    icon: <BsGoogle className="cc-w-7 cc-h-7" />,
    data_source_type: 'GOOGLE_DOCS',
    requiresOAuth: true,
  },
  {
    active: true,
    name: 'Intercom',
    subpath: 'intercom',
    id: 'intercom',
    description: 'Lets your users connect their Intercom to Carbon.',
    icon: <FaIntercom className="cc-w-7 cc-h-7" />,
    data_source_type: 'INTERCOM',
    requiresOAuth: true,
  },
  {
    active: true,
    name: 'Web Scraper',
    subpath: 'scraper',
    id: 'webScraper',
    description: 'Lets your users Scrape websites to Carbon.',
    icon: <CgWebsite className="cc-w-7 cc-h-7" />,
    data_source_type: 'WEB_SCRAPER',
    requiresOAuth: false,
  },
  // {
  //   active: true,
  //   name: 'Google Drive',
  //   subpath: 'google',
  //   id: 'googleDrive',
  //   description: 'Lets your users connect their Google Docs to Carbon.',
  //   scope: 'drive',
  //   icon: <BsGoogle className="cc-w-7 cc-h-7" />,
  // },
  // {
  //   active: true,
  //   name: 'Gmail',
  //   subpath: 'google',
  //   id: 'gmail',
  //   description: 'Lets your users connect their Google Docs to Carbon.',
  //   scope: 'gmail',
  //   icon: <BsGoogle className="cc-w-7 cc-h-7" />,
  // },
  // {
  //   active: false,
  //   name: 'Slack',
  //   subpath: 'slack',
  //   id: 'slack',
  //   description: 'Lets your users connect their Slack accounts to Carbon.',
  //   icon: <SiSlack className="cc-w-7 cc-h-7" />,
  // },
  // {
  //   active: false,
  //   name: 'Discord',
  //   subpath: 'discord',
  //   id: 'discord',
  //   description: 'Lets your users connect their Discord accounts to Carbon.',
  //   icon: <BsDiscord className="cc-w-7 cc-h-7" />,
  // },
  {
    active: true,
    name: 'File Upload',
    subpath: 'local',
    id: 'local_files',
    description: 'Lets your users upload local files to Carbon.',
    icon: <BsCloudUpload className="cc-w-7 cc-h-7" />,
    data_source_type: 'LOCAL_FILES',
    requiresOAuth: false,
  },
];

export const AuthProvider = ({
  children,
  tokenFetcher,
  enabledIntegrations,
  orgName,
  brandIcon,
  environment,
  entryPoint,
  tags,
  maxFileSize,
  onSuccess,
  onError,
  primaryBackgroundColor,
  primaryTextColor,
  secondaryBackgroundColor,
  secondaryTextColor,
  allowMultipleFiles,
}) => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchTokens = async () => {
    try {
      setLoading(true);
      const response = await tokenFetcher();

      setAccessToken(response.access_token);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  const contextValues = {
    accessToken,
    setAccessToken,
    fetchTokens,
    enabledIntegrations,
    orgName,
    brandIcon,
    environment,
    entryPoint,
    tags,
    maxFileSize,
    onSuccess,
    onError,
    primaryBackgroundColor,
    primaryTextColor,
    secondaryBackgroundColor,
    secondaryTextColor,
    allowMultipleFiles,
  };

  return (
    <AuthContext.Provider value={contextValues}>
      {children}
    </AuthContext.Provider>
  );
};

export const useCarbonAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useCarbonAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
