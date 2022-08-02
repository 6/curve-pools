import React from 'react';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { theme } from './theme';
import { DashboardScreen } from './screens/dashboard/dashboard.screen';

export const App = () => {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <DashboardScreen />
    </ChakraProvider>
  );
};
