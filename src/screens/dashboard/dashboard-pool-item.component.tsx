import React from 'react';
import {
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  AccordionIcon,
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  HStack,
  Heading,
  Link,
  Text,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { CurvePoolForUi, PoolBalanceStatus } from '../../hooks/use-top-pools';
import { useProminentTransactions } from '../../hooks/use-prominent-transactions';
import { usdNoDecimalsFormatter } from '../../utils/number-formatters';
import { PROMINENT_TRANSACTIONS_MINIMUM_USD_THRESHOLD } from '../../utils/curve.constants';
import { unauthedExplorers } from '../../utils/unauthed-explorers';
import { useExchangeRateHistory } from '../../hooks/use-exchange-rate-history';
import moment from 'moment';

interface DashboardPoolItemProps {
  pool: CurvePoolForUi;
}
export const DashboardPoolItem = ({ pool }: DashboardPoolItemProps) => {
  const prominentTxs = useProminentTransactions({ pool });
  const badgeColor = {
    [PoolBalanceStatus.SEVERE]: 'red',
    [PoolBalanceStatus.MODERATE]: 'orange',
    [PoolBalanceStatus.MINOR]: 'yellow',
    [PoolBalanceStatus.GOOD]: 'green',
  }[pool.balanceStatus];

  const exchangeRateHistory = useExchangeRateHistory({ pool });

  console.log(`ex history for ${pool.shortName ?? pool.name}`, exchangeRateHistory);

  return (
    <AccordionItem>
      <AccordionButton>
        <Box flex="1" maxWidth="80px">
          <AvatarGroup size="xs" spacing="-0.7rem">
            {pool.coins.map((coin) => {
              return <Avatar key={coin.address} name={coin.symbol} src={coin.logoURL} />;
            })}
          </AvatarGroup>
        </Box>
        <Box flex="3" textAlign="left">
          {pool.network}: {pool.shortName ?? pool.name ?? pool.id} (
          {pool.coins.map((coin) => coin.symbol).join('+')})
        </Box>
        <Box flex="1" textAlign="right">
          {pool.usdTotalFormatted}{' '}
          <Badge colorScheme={badgeColor}>
            {pool.balanceStatus === PoolBalanceStatus.GOOD
              ? pool.balanceStatus
              : `${pool.balanceStatus} imbalance`}
          </Badge>
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
        <Heading fontSize="md" marginTop="5">
          Exchange rate (last 7 days)
        </Heading>
        {exchangeRateHistory ? (
          <LineChart
            width={500}
            height={300}
            data={exchangeRateHistory.dataPoints}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis
              dataKey="date"
              // domain={['dataMin', 'dataMax']}
              name="Date"
              type="category"
              allowDuplicatedCategory={false}
            />
            <YAxis
              type="number"
              domain={['dataMin - 0.02', 'dataMax + 0.02']}
              tickFormatter={(rate) => rate.toFixed(3)}
            />
            <Tooltip />
            <Legend />
            {exchangeRateHistory.seriesLabels.map((label, i) => {
              const color = ['green', 'blue', 'purple', 'pink', 'red', 'orange'][i];
              return <Line type="monotone" dataKey={label} stroke={color} />;
            })}
          </LineChart>
        ) : (
          <Text>No data</Text>
        )}

        <Heading fontSize="md" marginTop="5">
          Large recent transactions
        </Heading>
        {prominentTxs.length === 0 ? (
          <Text>
            No recent transactions greater than{' '}
            {usdNoDecimalsFormatter.format(PROMINENT_TRANSACTIONS_MINIMUM_USD_THRESHOLD.toNumber())}{' '}
            found
          </Text>
        ) : (
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Type</Th>
                  <Th>Details</Th>
                  <Th isNumeric>USD value</Th>
                  <Th isNumeric>Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {prominentTxs.map((tx) => {
                  return (
                    <Tr>
                      <Td>{tx.type}</Td>
                      <Td>TODO: details</Td>
                      <Td isNumeric>{tx.totalUsdFormatted}</Td>
                      <Td isNumeric>
                        <Link
                          href={unauthedExplorers[pool.network].mainnet.getTransactionURL(tx.hash)}
                          isExternal
                        >
                          {tx.timestampMoment.fromNow()}
                          <ExternalLinkIcon mx="2px" />
                        </Link>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </AccordionPanel>
    </AccordionItem>
  );
};
