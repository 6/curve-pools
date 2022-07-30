import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { DashboardScreen } from './screens/dashboard/dashboard.screen';

export const App = () => {
  return (
    <ChakraProvider resetCSS>
      <DashboardScreen />
    </ChakraProvider>
  );
};
