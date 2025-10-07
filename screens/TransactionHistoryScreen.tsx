import React from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import { RootStackScreenProps } from './types'
import { colors } from '../utils'
import { navigate, useWalletClient } from '@divvi/mobile'
import PalmpayIcon from '../assets/icons/palmpay-icon.svg'
import Mpesa from '../assets/icons/mpesa-icon.svg'
import Moniepoint from '../assets/icons/moniepoint-icon.svg'
import Opay from '../assets/icons/opay-icon.svg'
import MTN from '../assets/icons/mtn-icon.svg'
import Airtel from '../assets/icons/airtel-icon.svg'
import Telcel from '../assets/icons/telecel-icon.svg'
import AirtelTigo from '../assets/icons/airteltigo-icon.svg'
import { useCkashReferral } from '../hooks/useReferral'
import {  OffchainTransaction } from '../api/types'
import { formatDate } from '../lib/date'

interface Transaction {
  id: string
  type: 'airtime' | 'send'
  title: string
  recipient?: string
  date: string
  amount: string
  currency: string
  isDebit: boolean
  status: 'success' | 'failed'
}

export type Network =
  | 'Safaricom'
  | 'MTN'
  | 'AirtelTigo'
  | 'Telcel'
  | 'Airtel'
  | 'Palmpay'
  | 'Moniepoint'
  | 'Opay';

const networkIcons: Record<Network, React.FC<any>> = {
  Safaricom: Mpesa,
  MTN,
  AirtelTigo,
  Telcel,
  Airtel,
  Palmpay: PalmpayIcon,
  Moniepoint,
  Opay,
};



const TransactionItem: React.FC<{ transaction: OffchainTransaction }> = ({ transaction }) => {
  const IconComponent = networkIcons[transaction.mobileNetwork as Network] || PalmpayIcon;


  const handleTransactionPress = () => {
    navigate('TransactionDetails', { transaction })
  }

  return (
    <TouchableOpacity 
      style={styles.transactionItem}
      onPress={handleTransactionPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <IconComponent width={40} height={40} />
      </View>
      <View style={styles.transactionDetails}>
      <Text style={styles.transactionTitle}>
  {transaction.mobileNetwork === "Safaricom"
    ? "Mpesa"
    : transaction.mobileNetwork}
</Text>

        <Text style={styles.transactionDate}>{formatDate(transaction.createdAt)}</Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={[styles.transactionAmount, { color: transaction.status === 'COMPLETE' ? '#FF4444' : '#00AA44' }]}>
          {transaction.receiptNumber}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

const TransactionSeparator: React.FC = () => <View style={styles.separator} />

export default function TransactionHistoryScreen(
  _props: Readonly<RootStackScreenProps<'TransactionHistory'>>,
) {

  const [transactions, setTransactions] = React.useState<OffchainTransaction[]>([]);

  
  const { data: walletClient } = useWalletClient({ networkId: 'celo-mainnet' });
    const address = walletClient?.account?.address;

  const { userOffchainTransactions } = useCkashReferral()

  const fetchTransactions = async () => {
    try {
      if (!address) return;
      const result = await userOffchainTransactions(address as `0x${string}`);
      if (result?.success) { 
        console.log("Results", result.transactions?.transactions);
      setTransactions(result.transactions?.transactions as OffchainTransaction[]);

      }
      
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };
  

  React.useEffect(() => {
    fetchTransactions();
  }, [address]);

   

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={TransactionSeparator}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundPrimary,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  iconContainer: {
    marginRight: 16,
  },
  transactionDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  transactionTitle: {
    fontFamily: 'Heebo-Medium',
    fontSize: 16,
    lineHeight: 20,
    color: colors.contentPrimary,
    marginBottom: 2,
  },
  transactionDate: {
    fontFamily: 'Heebo-Regular',
    fontSize: 14,
    lineHeight: 18,
    color: colors.contentSecondary,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontFamily: 'Heebo-Medium',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 56,
  },
})
