import React from 'react';
import { NetworkErrorScreen } from '../NetworkErrorScreen';

export default function NetworkErrorTest() {
  return (
    <NetworkErrorScreen
      errorKey="networkFailure"
      onRetry={() => {
        console.log('Dev test: retry tapped');
      }}
    />
  );
}
