import React from 'react';
import './index.css';
import { CarbonProvider, useCarbon } from './contexts/CarbonContext';
import { CarbonConnectProps } from './types';
declare const CarbonConnect: React.FC<CarbonConnectProps>;
export { CarbonConnect, CarbonProvider, useCarbon };
