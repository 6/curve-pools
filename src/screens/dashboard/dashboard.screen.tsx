import React from 'react';
import { Container, Heading, Text, Center, Accordion } from '@chakra-ui/react';
import { useProminentTransactions } from '../../hooks/use-prominent-transactions';
import { useTopPools } from '../../hooks/use-top-pools';
import { DashboardPoolItem } from './dashboard-pool-item.component';
import { usdNoDecimalsFormatter } from '../../utils/number-formatters';
import { CURVE_NETWORKS, TOP_POOLS_MINIMUM_TVL_THRESHOLD } from '../../utils/curve.constants';

export const DashboardScreen = () => {
  const topPools = useTopPools();

  console.log('top pools:', topPools);

  const prominentTxs = useProminentTransactions({ pool: topPools[0] });

  console.log('prominent txs:', prominentTxs);

  return (
    <Container maxW="900px" paddingTop="10" paddingBottom="10">
      <Heading fontSize="4xl" textAlign="center">
        🕵
      </Heading>
      <Heading paddingTop="2" fontSize="3xl" textAlign="center">
        Curve Pool Scanner
      </Heading>
      <Center>
        <Text
          marginTop="5"
          marginBottom="5"
          fontSize="xl"
          textAlign="center"
          maxW="md"
          alignSelf="center"
        >
          Explore the top Curve.fi pools, identify imbalances, and find large changes in liquidity.
        </Text>
      </Center>
      <Accordion allowToggle>
        {topPools.map((pool) => {
          return <DashboardPoolItem key={`${pool.network}-${pool.id}`} pool={pool} />;
        })}
      </Accordion>
      <Center>
        <Text marginTop="5" fontSize="md" textAlign="center">
          Displaying a total of {topPools.length} pools with a minimum TVL of
          {' ' + usdNoDecimalsFormatter.format(TOP_POOLS_MINIMUM_TVL_THRESHOLD.toNumber())}.
        </Text>
      </Center>
      <Center>
        <Text fontSize="md" textAlign="center">
          Supported networks: {CURVE_NETWORKS.join(', ')}.
        </Text>
      </Center>
      <Center>
        <Text fontSize="md" textAlign="center">
          Data last updated: TODO.
        </Text>
      </Center>
    </Container>
  );
};
