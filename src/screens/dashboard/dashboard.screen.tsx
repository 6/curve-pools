import React from 'react';
import lodash from 'lodash';
import {
  Container,
  Heading,
  Text,
  Center,
  Accordion,
  Box,
  Image,
  HStack,
  useColorMode,
  Button,
  Tooltip,
  Link,
  Show,
  Code,
} from '@chakra-ui/react';
import { useTopPools } from '../../hooks/use-top-pools';
import { DashboardPoolItem } from './dashboard-pool-item.component';
import { usdNoDecimalsFormatter } from '../../utils/number-formatters';
import { CURVE_NETWORKS, TOP_POOLS_MINIMUM_TVL_THRESHOLD } from '../../utils/curve.constants';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { lastUpdatedMoment } from '../../processed-data/last-updated';

export const DashboardScreen = () => {
  const topPools = useTopPools();
  const { colorMode, toggleColorMode } = useColorMode();

  console.log('top pools:', topPools);

  return (
    <Container maxW="900px" paddingTop="5" paddingBottom="10">
      <HStack>
        <Box flex="1" textAlign="right">
          <Tooltip label={colorMode === 'light' ? 'Enable dark mode' : 'Enable light mode'}>
            <Button onClick={toggleColorMode}>
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
          </Tooltip>
        </Box>
      </HStack>
      <Center>
        <Image src="/detective.png" width="40px" />
      </Center>
      <Heading paddingTop="3" fontSize="3xl" textAlign="center">
        Curve Pool Scanner
      </Heading>
      <Center>
        <Text
          marginTop="5"
          marginBottom="7"
          fontSize="xl"
          textAlign="center"
          maxW="md"
          alignSelf="center"
        >
          Explore the top{' '}
          <Link href="https://curve.fi" isExternal>
            <u>Curve.fi</u>
          </Link>{' '}
          pools, identify imbalances, and find large changes in liquidity.
        </Text>
      </Center>
      <HStack marginBottom="1">
        <Show above="md">
          <Box flex="1" maxWidth="100px" paddingLeft="15px">
            <Text fontWeight="bold">Network</Text>
          </Box>
        </Show>
        <Box flex="1" maxWidth="80px" paddingLeft="10px">
          <Text fontWeight="bold">Pool</Text>
        </Box>
        <Box flex="1" textAlign="right" paddingRight="45px">
          <Text fontWeight="bold">Liquidity</Text>
        </Box>
      </HStack>
      <Accordion allowToggle>
        {topPools.map((pool) => {
          return <DashboardPoolItem key={`${pool.network}-${pool.id}`} pool={pool} />;
        })}
      </Accordion>
      <Center>
        <Text marginTop="8" fontSize="md" textAlign="center">
          Showing <b>{topPools.length}</b> pools with a minimum TVL of{' '}
          <b>{usdNoDecimalsFormatter.format(TOP_POOLS_MINIMUM_TVL_THRESHOLD.toNumber())}</b>.
        </Text>
      </Center>
      <Center>
        <Text marginTop="1" fontSize="md" textAlign="center">
          Supported networks: {CURVE_NETWORKS.map(lodash.capitalize).join(', ')}
        </Text>
      </Center>
      <Center>
        <Text marginTop="1" fontSize="md" textAlign="center">
          Data last updated: <Code>{lastUpdatedMoment.utc().format()}</Code> (
          {lastUpdatedMoment.fromNow()})
        </Text>
      </Center>
    </Container>
  );
};
