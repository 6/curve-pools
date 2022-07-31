import React from 'react';
import {
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  AccordionIcon,
  Avatar,
  AvatarGroup,
  Box,
  HStack,
  Text,
} from '@chakra-ui/react';
import { CurvePoolForUi } from '../../hooks/use-top-pools';

interface DashboardPoolItemProps {
  pool: CurvePoolForUi;
}
export const DashboardPoolItem = ({ pool }: DashboardPoolItemProps) => {
  return (
    <AccordionItem>
      <AccordionButton>
        <Box flex="1" maxWidth="80px" textAlign="center">
          <AvatarGroup size="xs" spacing="-0.7rem">
            {pool.coins.map((coin) => {
              return <Avatar key={coin.address} name={coin.symbol} src={coin.logoURL} />;
            })}
          </AvatarGroup>
        </Box>
        <Box flex="3" textAlign="left">
          <HStack>
            <Text>
              {pool.network}: {pool.shortName ?? pool.name ?? pool.id}
            </Text>
          </HStack>
        </Box>
        <Box flex="1" textAlign="right">
          {pool.usdTotalFormatted} - {pool.balanceStatus}
        </Box>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel pb={4}>
        {pool.coins.map((coin) => {
          return (
            <HStack key={coin.address} marginBottom="1">
              <Avatar size="xs" src={coin.logoURL} />
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
