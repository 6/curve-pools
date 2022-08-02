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
  Tooltip as ChakraTooltip,
} from '@chakra-ui/react';
import lodash from 'lodash';
import { ExternalLinkIcon, QuestionIcon, TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { CurvePoolForUi, PoolBalanceStatus } from '../../hooks/use-top-pools';
import { useProminentTransactions } from '../../hooks/use-prominent-transactions';
import { usdCompactFormatter, usdNoDecimalsFormatter } from '../../utils/number-formatters';
import {
  CurveAssetTypeName,
  PROMINENT_TRANSACTIONS_MINIMUM_USD_THRESHOLD,
} from '../../utils/curve.constants';
import { unauthedExplorers } from '../../utils/unauthed-explorers';
import { useExchangeRateHistory } from '../../hooks/use-exchange-rate-history';
import moment from 'moment';
import { CurveLiquidityImpact, CurveTransactionType } from '../../utils/parse-transaction';

interface DashboardPoolItemProps {
  pool: CurvePoolForUi;
}
export const DashboardPoolItem = ({ pool }: DashboardPoolItemProps) => {
  const prominentTxs = useProminentTransactions({ pool });
  const exchangeRateHistory = useExchangeRateHistory({ pool });
  const explorer = unauthedExplorers[pool.network].mainnet;

  return (
    <AccordionItem>
      <AccordionButton>
        <Box flex="1" maxWidth="100px" textAlign="left">
          {lodash.capitalize(pool.network)}
        </Box>
        <Box flex="1" maxWidth="80px">
          <AvatarGroup size="xs" spacing="-0.7rem">
            {pool.coins.map((coin) => {
              return <Avatar key={coin.address} name={coin.symbol} src={coin.logoURL} />;
            })}
          </AvatarGroup>
        </Box>
        <Box flex="3" textAlign="left">
          <Text fontWeight="bold">{pool.shortName ?? pool.name ?? pool.id}</Text>
          <Text color="gray.500">{pool.coins.map((coin) => coin.symbol).join('+')}</Text>
        </Box>
        <Box flex="2" textAlign="right" paddingRight="10px">
          <Text fontWeight="bold">{pool.usdTotalFormatted}</Text>
          <Badge colorScheme={pool.balanceStatusColor}>
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
              <Badge colorScheme={coin.balanceStatusColor}>
                {coin.balanceStatus.split('_').join(' ')}
              </Badge>
              <Text fontSize="md" flex="1" textAlign="right">
                Current weight: {coin.poolWeightFormatted} Ideal weight:{' '}
                {pool.idealPoolWeightFormatted}
              </Text>
            </HStack>
          );
        })}
        <Box marginTop="5">
          <Link href={explorer.getAddressURL(pool.address)} isExternal color="blue.400">
            View Pool on {explorer.name} <ExternalLinkIcon mx="2px" />
          </Link>
        </Box>
        <Heading fontSize="md" marginTop="10" marginBottom="5">
          Exchange rate (last 7 days)
          {exchangeRateHistory?.isMissingData && (
            <Text color="red">
              Note: Exchange rate data for this pool is incomplete.{' '}
              <ChakraTooltip label="This pool uses the TokenExchangeUnderlying function which is not yet indexed.">
                <QuestionIcon />
              </ChakraTooltip>
            </Text>
          )}
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
              dataKey="timestamp"
              domain={['dataMin', 'dataMax']}
              name="Time"
              tickFormatter={(unixTime) => moment(unixTime * 1000).format('YYYY-MM-DD')}
              type="number"
            />
            <YAxis
              type="number"
              domain={['dataMin - 0.001', 'dataMax + 0.001']}
              tickFormatter={(rate) => rate.toFixed(3)}
            />
            <Tooltip labelFormatter={(t) => new Date(t * 1000).toLocaleString()} />
            <Legend wrapperStyle={{ position: 'relative' }} />
            {exchangeRateHistory.seriesLabels.map((label, i) => {
              const color = ['green', 'blue', 'purple', 'pink', 'red', 'orange'][i];
              return <Line type="monotone" dataKey={label} stroke={color} />;
            })}
          </LineChart>
        ) : (
          <Text>
            {pool.network !== 'ethereum'
              ? 'Data only available for Ethereum mainnet-based pools.'
              : pool.assetTypeName === CurveAssetTypeName.UNKNOWN
              ? 'This graph is not supported for pools with uncorrelated assets.'
              : 'No recent data found.'}
          </Text>
        )}

        <Heading fontSize="md" marginTop="10" marginBottom="2">
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
                  <Th>Event</Th>
                  <Th>Details</Th>
                  <Th isNumeric>Total USD value</Th>
                  <Th isNumeric>Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {prominentTxs.map((tx) => {
                  const readableEventType = {
                    [CurveTransactionType.EXCHANGE]: 'Exchange',
                    [CurveTransactionType.ADD_LIQUIDITY]: 'Add liquidity',
                    [CurveTransactionType.REMOVE_LIQUIDITY]: 'Remove liquidity',
                  }[tx.type];
                  const eventColor = {
                    [CurveTransactionType.EXCHANGE]: 'gray',
                    [CurveTransactionType.ADD_LIQUIDITY]: 'green',
                    [CurveTransactionType.REMOVE_LIQUIDITY]: 'orange',
                  }[tx.type];
                  const isBigAmount = tx.totalUsdAmount.greaterThanOrEqualTo(1000000);
                  return (
                    <Tr>
                      <Td>
                        <Badge colorScheme={eventColor}>{readableEventType}</Badge>
                      </Td>
                      <Td>
                        {tx.tokens.map((token) => {
                          let icon;
                          let text;
                          let amountText;
                          if (token.type === CurveLiquidityImpact.ADD) {
                            icon = <TriangleUpIcon color="green" />;
                            text = 'Added liquidity';
                          } else {
                            icon = <TriangleDownIcon color="red" />;
                            text = 'Removed liquidity';
                          }
                          if (
                            token.usdAmount &&
                            tx.tokens.length > 1 &&
                            tx.type !== CurveTransactionType.EXCHANGE
                          ) {
                            const amountPrefix =
                              token.type === CurveLiquidityImpact.ADD ? '+' : '-';
                            amountText = `${amountPrefix}${usdCompactFormatter.format(
                              token.usdAmount.toNumber(),
                            )}`;
                          }
                          return (
                            <HStack paddingTop="1" paddingBottom="1">
                              <Avatar size="2xs" src={token.logoURL} />
                              <Text fontWeight={isBigAmount ? 'bold' : 'normal'}>
                                {token.symbol}: {text} {icon} {amountText}
                              </Text>
                            </HStack>
                          );
                        })}
                      </Td>
                      <Td isNumeric>
                        <Text fontWeight={isBigAmount ? 'bold' : 'normal'}>
                          {tx.totalUsdFormatted}
                        </Text>
                      </Td>
                      <Td isNumeric>
                        <ChakraTooltip label={tx.timestampMoment.format('LLL')}>
                          <Link
                            href={unauthedExplorers[pool.network].mainnet.getTransactionURL(
                              tx.hash,
                            )}
                            isExternal
                            color="blue.400"
                          >
                            {tx.timestampMoment.fromNow()}
                            <ExternalLinkIcon mx="2px" />
                          </Link>
                        </ChakraTooltip>
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
