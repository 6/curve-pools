import React from 'react';
import { Container, Heading, Text, Center, Wrap } from '@chakra-ui/react';
import { useProminentTransactions } from '../../hooks/use-prominent-transactions';
import { useTopPools } from '../../hooks/use-top-pools';

export const DashboardScreen = () => {
  const topPools = useTopPools();

  console.log('top pools:', topPools);

  const prominentTxs = useProminentTransactions({ pool: topPools[0] });

  console.log('prominent txs:', prominentTxs);

  return (
    <Container maxW="800px" paddingTop="10">
      <Heading fontSize="3xl" textAlign="center">
        Curve Pools Scanner
      </Heading>
      <Center>
        <Text marginTop="5" fontSize="xl" textAlign="center" maxW="md" alignSelf="center">
          Explore the top Curve.fi pools, identify imbalances, and find large changes in liquidity.
        </Text>
      </Center>
    </Container>
  );
};
