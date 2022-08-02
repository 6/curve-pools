import React, { useState } from 'react';
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
  RadioGroup,
  Stack,
  Radio,
  Code,
  Show,
} from '@chakra-ui/react';
import lodash from 'lodash';
import { ExternalLinkIcon, TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  ReferenceLine,
  Bar,
} from 'recharts';
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
import { useLiquidityHistory } from '../../hooks/use-liquidity-history';

interface DashboardPoolItemProps {
  pool: CurvePoolForUi;
}
export const DashboardPoolItem = ({ pool }: DashboardPoolItemProps) => {
  const [txSortOrder, setTxSortOrder] = useState<string>('recent');
  const prominentTxs = useProminentTransactions({ pool });
  const exchangeRateHistory = useExchangeRateHistory({ pool });
  const liquidityHistory = useLiquidityHistory({ pool });
  const explorer = unauthedExplorers[pool.network].mainnet;

  return (
    <AccordionItem>
      <AccordionButton>
        <Show above="md">
          <Box flex="1" maxWidth="100px" textAlign="left">
            {lodash.capitalize(pool.network)}
          </Box>
        </Show>
        <Show above="sm">
          <Box flex="1" maxWidth="80px">
            <AvatarGroup size="xs" spacing="-0.7rem">
              {pool.coins.map((coin) => {
                return <Avatar key={coin.address} name={coin.symbol} src={coin.logoURL} />;
              })}
            </AvatarGroup>
          </Box>
        </Show>
        <Box flex="3" textAlign="left">
          <Text fontWeight="bold">
            {pool.displayName}
            {pool.isMetaPool && (
              <ChakraTooltip
                label={`Metapools allow for one token to trade with another underlying base pool (${
                  pool.coins.find((c) => c.isBasePoolLpToken)?.symbol ?? 'unknown'
                }).`}
              >
                <Badge ml="1" fontSize="0.6em" colorScheme="facebook" marginLeft="1">
                  Meta
                </Badge>
              </ChakraTooltip>
            )}
          </Text>
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
        <Heading fontSize="md" marginTop="5" marginBottom="5">
          Liquidity breakdown
        </Heading>
        {pool.coins.map((coin) => {
          return (
            <HStack key={coin.address} marginBottom="1">
              <Avatar size="xs" src={coin.logoURL} />
              <Text fontSize="md">{coin.symbol}</Text>
              <Text fontSize="md">
                {usdNoDecimalsFormatter.format(coin.totalUsdBalance.toNumber())}
              </Text>
              <Badge colorScheme={coin.balanceStatusColor}>
                {coin.balanceStatus.split('_').join(' ')}
              </Badge>
              <Show above="md">
                <Text fontSize="md" flex="1" textAlign="right">
                  Current weight: {coin.poolWeightFormatted}{' '}
                  <i>(Ideal : {pool.idealPoolWeightFormatted})</i>
                </Text>
              </Show>
            </HStack>
          );
        })}
        <Box marginTop="5">
          <Link href={explorer.getAddressURL(pool.address)} isExternal color="blue.400">
            View Pool on {explorer.name} <ExternalLinkIcon mx="2px" />
          </Link>
        </Box>
        <Heading fontSize="md" marginTop="10" marginBottom="3">
          Exchange rate (last 7 days)
        </Heading>
        {!pool.isMetaPool && exchangeRateHistory && !exchangeRateHistory.isMissingData ? (
          <>
            <Text color="gray.500" marginBottom="5">
              Exchange rates between assets in this pool. Based on actual rates received from
              <Code>TokenExchange</Code> events (swaps) done by users.
            </Text>
            <ResponsiveContainer height={300} width={'100%'}>
              <LineChart
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
                  return (
                    <Line key={i} type="monotone" dataKey={label} stroke={color} dot={false} />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </>
        ) : (
          <Text color="gray.500">
            {pool.network !== 'ethereum'
              ? 'Data only available for Ethereum mainnet-based pools.'
              : pool.assetTypeName === CurveAssetTypeName.UNKNOWN
              ? 'Data not available for pools with uncorrelated assets.'
              : pool.isMetaPool
              ? 'Data not available for metapools, as the TokenExchangeUnderlying function is not yet indexed.'
              : exchangeRateHistory?.isMissingData
              ? 'Data is missing from exchange rate history. This pool uses TokenExchangeUnderlying function which is not yet indexed.'
              : 'No recent data found.'}
          </Text>
        )}

        <Heading fontSize="md" marginTop="10" marginBottom="3">
          Liquidity history (last 7 days)
        </Heading>
        {liquidityHistory ? (
          <>
            <Text color="gray.500" marginBottom="5">
              Daily USD delta in <Code>AddLiquidity</Code> + <Code>RemoveLiquidity</Code> events.
              This excludes changes to liquidity caused by <Code>TokenExchange</Code> events
              (swaps).
            </Text>
            <ResponsiveContainer height={300} width={'100%'}>
              <BarChart
                stackOffset="sign"
                data={liquidityHistory.dataPoints}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis dataKey="date" domain={['dataMin', 'dataMax']} name="Date" />
                <YAxis
                  type="number"
                  // domain={['dataMin - 0.001', 'dataMax + 0.001']}
                  tickFormatter={(rate) => usdCompactFormatter.format(rate)}
                />
                <Tooltip />
                <Legend wrapperStyle={{ position: 'relative' }} />
                <ReferenceLine y={0} stroke="#000" />
                {liquidityHistory.seriesLabels.map((label, i) => {
                  const color = ['green', 'blue', 'purple', 'pink', 'red', 'orange'][i];
                  return <Bar key={i} dataKey={label} fill={color} stackId="stack" />;
                })}
              </BarChart>
            </ResponsiveContainer>
          </>
        ) : (
          <Text color="gray.500">Not enough data found, or no data available.</Text>
        )}

        <Heading fontSize="md" marginTop="10" marginBottom="5">
          Large transactions (last 7 days, &gt;={' '}
          {usdCompactFormatter.format(PROMINENT_TRANSACTIONS_MINIMUM_USD_THRESHOLD.toNumber())})
        </Heading>
        {prominentTxs.length === 0 ? (
          <Text marginBottom="5">
            No recent transactions greater than{' '}
            {usdNoDecimalsFormatter.format(PROMINENT_TRANSACTIONS_MINIMUM_USD_THRESHOLD.toNumber())}{' '}
            found.
          </Text>
        ) : (
          <>
            <HStack marginTop="5" marginBottom="5">
              <Text>Sort by:</Text>
              <RadioGroup onChange={setTxSortOrder} value={txSortOrder}>
                <Stack direction="row">
                  <Radio value={'recent'}>Recent</Radio>
                  <Radio value={'largest'}>Largest</Radio>
                </Stack>
              </RadioGroup>
            </HStack>
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
                  {(txSortOrder === 'largest'
                    ? lodash.orderBy(prominentTxs, (tx) => tx.totalUsdAmount.toNumber(), 'desc')
                    : prominentTxs
                  ).map((tx, i) => {
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
                      <Tr key={i}>
                        <Td>
                          <Badge colorScheme={eventColor}>{readableEventType}</Badge>
                        </Td>
                        <Td>
                          {lodash.sortBy(tx.tokens, 'symbol').map((token, i) => {
                            let icon;
                            let amountText;
                            if (token.type === CurveLiquidityImpact.ADD) {
                              icon = <TriangleUpIcon color="green.300" />;
                            } else {
                              icon = <TriangleDownIcon color="red.300" />;
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
                              <HStack key={i} paddingTop="1" paddingBottom="1">
                                <Avatar size="2xs" src={token.logoURL} />
                                <Text>
                                  {token.symbol} {icon} {amountText}
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
          </>
        )}
      </AccordionPanel>
    </AccordionItem>
  );
};
