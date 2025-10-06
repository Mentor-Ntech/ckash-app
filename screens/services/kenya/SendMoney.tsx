import * as React from 'react'
import {
  View,
  TextInput,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { RootStackScreenProps } from '../../types'
import { useWalletClient } from '@divvi/mobile'
import { TransactionRequestEIP1559 } from 'viem'
import { TransactionRequestCIP64 } from 'viem/chains'
import debounce from 'lodash.debounce'
import { useTokens } from '../../../utils'
import { TokenBalance } from 'src/tokens/slice'
import {
  calculateTotalUsdValue,
  getRatedAmount,
  getRatedAmountToLocalCurrency,
  validateAccount,
  getCurrencyRate 
} from '../../../lib/cKash'
import { useSend } from '../../../hooks/useSend'
import { ContactPickerModal } from '../../../components/ContactPickerModal'
import AlertModal from '../../../components/AlertModal'
import MpesaIcon from '../../../assets/icons/mpesa-icon.svg'
import ContactListIcon from '../../../assets/icons/list-icon.svg'
import PrimaryButton from '../../../components/PrimaryButton'
import InputField from '../../../components/InputField'
import { useContactPicker } from '../../../hooks/useContactPicker'
import { TokenSelectorRef, TokenSelectorSheet } from '../../../components/TokenSelectorSheet'

export type TransactionRequest = (
  | TransactionRequestCIP64
  | TransactionRequestEIP1559
) & {
  _estimatedGasUse?: bigint
  _baseFeePerGas?: bigint
}

export default function SendMoney(
  _props: RootStackScreenProps<'KenyaSendMoney'>,
) {
  const [phoneNumber, setPhoneNumber] = React.useState<string>('')
  const { data: walletClient } = useWalletClient({ networkId: 'celo-mainnet' })
  const [amount, setAmount] = React.useState<string>('')
  const [tokenAmount, setTokenAmount] = React.useState<string>('')
  const { sendMoney, loading, isError } = useSend()
  const [localBalance, setLocalBalance] = React.useState<number>(0.0)
  const [localCurrencyRate, setlocalCurrencyRate] = React.useState<number>(0.0)

  const { tokens, cUSDToken } = useTokens()
  const [modalVisible, setModalVisible] = React.useState(false)
  const [accountName, setAccountName] = React.useState<string | null>(null)

  const [selectedToken, setSelectedToken] = React.useState<TokenBalance | null>(null)
    const [openBottom,setOpenBottom]= React.useState<boolean>(true)
    const tokenSheetRef = React.useRef<TokenSelectorRef>(null)

  const {
    openContactPicker,
    closeContactPicker,
    isModalVisible,
    handleContactSelect,
  } = useContactPicker({
    onContactSelect: (formattedNumber: string) => {
      setPhoneNumber(formattedNumber)
    },
  })

  const openSheet = () => {
    tokenSheetRef.current?.open() 
    setOpenBottom(false)
  };

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '')
    setPhoneNumber(cleaned)
  }

  const fetchTokenAmount = React.useCallback(
    debounce(async (text: string) => {
      const numericValue = parseFloat(text)
      if (isNaN(numericValue)) {
        setTokenAmount('0')
        return
      }

      try {
        const ratedAmountToDeduct = await getRatedAmount(numericValue, 'KES')
        setTokenAmount(ratedAmountToDeduct.toString())
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error)
      }
    }, 500), // Delay in ms
    [],
  )

  const handleAmountChange = (text: string) => {
    setAmount(text)
    if (!text || isNaN(Number(text))) {
      setTokenAmount('')
      return
    }
    fetchTokenAmount(text)
  }
  const handleSendMoney = async () => {
    try {
      if (!tokenAmount || tokenAmount == null || tokenAmount == undefined) {
        Alert.alert('Please provide Amount')
        return
      }
      // const { response } =
        await sendMoney({
        shortcode: phoneNumber,
        ratedTokenAmount: tokenAmount,
        rawAmount: amount,
        type: 'MOBILE',
        mobileNetwork: 'Safaricom',
        country_code_refund:"KES",
        tokenBalance: selectedToken as TokenBalance,
        from: walletClient?.account?.address as `0x${string}`,
        to: selectedToken?.address as `0x${string}`,
        feeCurrency: selectedToken?.feeCurrencyAdapterAddress?selectedToken?.feeCurrencyAdapterAddress:selectedToken?.address as `0x${string}`,
        tokenDecimal:selectedToken?.decimals as number
      })
      //console.log('THE RESPONSE', response)
      setModalVisible(true)
    } catch (error) {
      console.log('THE ERROR', error)
      setModalVisible(true);
    }
  }

  const account_name = async (shortcode: string) => {
    try {
      const result = await validateAccount({
        shortcode: shortcode,
        mobile_network: 'Safaricom',
      })

      setAccountName(result || null)
    } catch (error) {
      setAccountName(null)
    }
  }

  React.useEffect(() => {
    if (phoneNumber.length >= 10) {
      account_name(phoneNumber)
    } else {
      setAccountName(null)
    }
  }, [phoneNumber])

  const resetForm = () => {
    setPhoneNumber('')
    setAmount('')
    setTokenAmount('')
    setAccountName(null)
    setSelectedToken(null)
    setOpenBottom(true)
  }

  

  React.useEffect(() => {
    getCurrencyRate("KES").then((value) =>
    setlocalCurrencyRate(value))

    if (!tokens || tokens.length === 0) return
    let totalUsdValue = calculateTotalUsdValue(tokens)
    getRatedAmountToLocalCurrency(Number(totalUsdValue), 'KES').then((value) =>
      setLocalBalance(Number(value)),
    )
  }, [tokens])
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Bank Selection Card */}
      <View style={styles.bankCard}>
        <Text style={styles.bankTitle}>Select Bank</Text>
        <View style={styles.bankLogoContainer}>
          <MpesaIcon width={200} height={40} />
          <Text style={styles.bankName}>M-pesa</Text>
        </View>

        <Text style={styles.inputLabel}>Mobile Number</Text>
        <InputField
          value={phoneNumber}
          onChangeText={handlePhoneChange}
          placeholder="0701707772"
          keyboardType="phone-pad"
          maxLength={15}
          icon={<ContactListIcon width={24} height={24} />}
          onIconPress={openContactPicker}
        />
        {phoneNumber && (
          <Text style={styles.accountNameText}>
            Account name: {accountName}
          </Text>
        )}
      </View>

      {/* Amount Input */}
      <View style={styles.amountSection}>
        <View style={styles.amountHeader}>
          <Text style={styles.amountLabel}>Enter Amount (KES)</Text>
          <Text style={styles.balanceText}>KES {localBalance}</Text>
        </View>
        <TextInput
          style={styles.amountInput}
          value={amount}
          onChangeText={handleAmountChange}
          placeholder="KES 100"
          placeholderTextColor="#A0A0A0"
          keyboardType="numeric"
        />
        <Text style={styles.limitText}>(min: 20 , max 250,000)</Text>
      </View>

      

      {openBottom?<PrimaryButton onPress={openSheet}
              disabled={!amount ||
                isNaN(Number(amount)) ||
                Number(amount) < 20 ||
                !phoneNumber?.trim()
                }
              label="Continue" isLoading={loading} />:<PrimaryButton onPress={handleSendMoney}
              disabled={!amount ||
                isNaN(Number(amount)) ||
                !phoneNumber?.trim() ||
               
                Number(amount) < 20 ||                 
                !selectedToken||
                !tokenAmount ||
                isNaN(Number(tokenAmount)) ||
                Number(tokenAmount) <= 0}
              label="Send" isLoading={loading} />}
            
      {/* Contact Picker Modal */}
      <ContactPickerModal
        visible={isModalVisible}
        onClose={closeContactPicker}
        onContactSelect={handleContactSelect}
      />

           <TokenSelectorSheet
              ref={tokenSheetRef}
        tokens={tokens}
        usdRate={{country:"KES",amount:localCurrencyRate}}
              onSelect={(token) => setSelectedToken(token)}
            />

      <AlertModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
          resetForm()
        }}
        title={isError ? 'Transaction Failed' : 'Transaction Successful'}
        amount={amount ? `Amount: ${amount} KES` : ''}
        iconType={isError ? 'error' : 'success'}
        loading={loading}
        accountName={accountName ? `Recipient: ${accountName}` : ''}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 16,
  },
  bankCard: {
    backgroundColor: '#EFF3FF',
    borderWidth: 1,
    borderColor: '#AEC5FF',
    borderRadius: 8,
    padding: 24,
    marginBottom: 16,
  },
  bankTitle: {
    textAlign: 'left',
    fontFamily: 'Heebo-Medium',
    fontSize: 14,
    marginBottom: 8,
    color: '#1B1A46',
  },
  bankLogoContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  bankName: {
    marginLeft: 80,
    marginTop: 4,
    fontFamily: 'Heebo-Medium',
    fontSize: 14,
    color: '#1B1A46',
  },
  inputLabel: {
    textAlign: 'left',
    marginTop: 24,
    marginBottom: 8,
    fontFamily: 'Heebo-Medium',
    fontSize: 14,
    color: '#1B1A46',
  },
  accountNameText: {
    textAlign: 'left',
    fontFamily: 'Heebo-Regular',
    fontSize: 14,
    color: '#1B1A46',
  },
  amountSection: {
    marginBottom: 16,
  },
  amountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  amountLabel: {
    textAlign: 'left',
    fontWeight: '500',
    fontSize: 14,
    color: '#1B1A46',
  },
  balanceText: {
    textAlign: 'left',
    fontFamily: 'Heebo-Medium',
    fontSize: 14,
    color: '#1B1A46',
  },
  amountInput: {
    backgroundColor: '#DAE3FF',
    borderWidth: 1,
    borderColor: '#B2C7FF',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 4,
  },
  limitText: {
    color: '#EEA329',
    fontSize: 12,
  },
})
