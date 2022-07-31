import React, { useState } from 'react';
import { Decimal } from 'decimal.js';
import {
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  AccordionIcon,
  Box,
  Image,
  HStack,
  Text,
} from '@chakra-ui/react';
import { CurvePoolForUi } from '../../hooks/use-top-pools';

interface DashboardPoolItemProps {
  pool: CurvePoolForUi;
}
export const DashboardPoolItem = ({ pool }: DashboardPoolItemProps) => {
  const [hiddenCoins, setHiddenCoins] = useState<Array<string>>([]);

  return (
    <AccordionItem>
      <h2>
        <AccordionButton>
          <Box flex="3" textAlign="left">
            {pool.network}: {pool.shortName ?? pool.name ?? pool.id}
          </Box>
          <Box flex="1" textAlign="right">
            {pool.usdTotalFormatted} - {pool.balanceStatus}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel pb={4}>
        {pool.coins.map((coin) => {
          return (
            <HStack key={coin.address}>
              <Image
                hidden={hiddenCoins.includes(coin.address.toLowerCase())}
                src={coin.logoURL}
                onError={() => setHiddenCoins([...hiddenCoins, coin.address.toLowerCase()])}
                maxH="5"
              />
              <Text fontSize="md">{coin.symbol}</Text>
              <Text fontSize="md">{coin.totalUsdBalanceFormatted}</Text>
              <Text fontSize="md">
                {coin.balanceStatus} (current: {coin.poolWeightFormatted}, ideal:
                {pool.idealPoolWeightFormatted}, change:{' '}
                {coin.poolWeightVsIdealPercentageChangeFormatted})
              </Text>
            </HStack>
          );
        })}
      </AccordionPanel>
    </AccordionItem>
  );
};
