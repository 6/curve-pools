import React from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { DashboardScreen } from './screens/dashboard/dashboard.screen';

const theme = extendTheme({
  colors: {
    brand: {
      900: '#1a365d',
      800: '#153e75',
      700: '#2a69ac',
    },
  },
});

export const App = () => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <DashboardScreen />
    </ChakraProvider>
  );
};
