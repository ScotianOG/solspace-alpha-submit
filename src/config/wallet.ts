// This is a stub file to allow the build process to complete
// It will be ignored in the actual Netlify deployment

import React from 'react';
import type { ReactNode } from 'react';

interface WalletProviderProps {
  children: ReactNode;
}

export const SonicWalletProvider = (props: WalletProviderProps): React.ReactElement => {
  return React.createElement(React.Fragment, null, props.children);
};
