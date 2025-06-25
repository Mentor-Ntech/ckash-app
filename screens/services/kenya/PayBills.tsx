import * as React from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native'
import { RootStackScreenProps } from '../../types'
import { useSend } from '../../../hooks/useSend'
import { useTokens } from '../../../utils'
import { useWalletClient } from '@divvi/mobile'
import { calculateTotalUsdValue, getRatedAmount, getRatedAmountToLocalCurrency } from '../../../lib/cKash'
import debounce from 'lodash.debounce'
import { TokenBalance } from 'src/tokens/slice'
import AlertModal from '../../../components/AlertModal'
import NoteIcon from '../../../assets/icons/note-icon.svg'
import ListIcon from '../../../assets/icons/list-icon.svg'
import tw from 'twrnc'
import PrimaryButton from '../../../components/PrimaryButton'
import InputField from '../../../components/InputField'
import { TokenSelectorRef, TokenSelectorSheet } from '../../../components/TokenSelectorSheet'

export default function MPESAPaybills(
  _props: RootStackScreenProps<'KenyaPayBills'>,
) {
  const [paybillNumber, setPaybillNumber] = React.useState<string>('')
  const [accountNumber, setAccountNumber] = React.useState<string>('')
  const [amount, setAmount] = React.useState<string>('')
  const [modalVisible, setModalVisible] = React.useState(false)
  const { data: walletClient } = useWalletClient({ networkId: 'celo-mainnet' })
  const [tokenAmount, setTokenAmount] = React.useState<string>('')
  const [localBalance, setLocalBalance] = React.useState<number>(0.0)
  
  const { sendMoney, loading,isError } = useSend()
  const { cUSDToken, tokens } = useTokens()
  
const [selectedToken, setSelectedToken] = React.useState<TokenBalance | null>(null)
    const [openBottom,setOpenBottom]= React.useState<boolean>(true)
  const tokenSheetRef = React.useRef<TokenSelectorRef>(null)
  

  const openSheet = () => {
    tokenSheetRef.current?.open() 
    setOpenBottom(false)
  };

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

  const resetForm = () => {
    setAccountNumber('')
    setAmount('')
    setTokenAmount('')
    setPaybillNumber('')
  }
  const handleSendMoney = async () => {
    try {
      if (!accountNumber.trim() ||
      !paybillNumber.trim() ||
      !tokenAmount ||
      isNaN(Number(tokenAmount)) ||
      Number(tokenAmount) <= 0) {
        Alert.alert('Please provide valid payment details')
        return
      }

      const { response } = await sendMoney({
        shortcode: paybillNumber,
        ratedTokenAmount: tokenAmount,
        rawAmount: amount,
        account_number: accountNumber,
        type: 'PAYBILL',
        mobileNetwork: 'Safaricom',
        tokenBalance: selectedToken as TokenBalance,
        from: walletClient?.account?.address as `0x${string}`,
        to: selectedToken?.address as `0x${string}`,
        feeCurrency: selectedToken?.address as `0x${string}`,
        tokenDecimal:selectedToken?.decimals as number
      })
      console.log('THE RESPONSE', response)
      setModalVisible(true)
    } catch (error) {
      console.log('THE ERROR', error)
      Alert.alert(`${error}`)
    }
  }

  React.useEffect(() => {
      if (!tokens || tokens.length === 0) return
      let totalUsdValue = calculateTotalUsdValue(tokens)
      getRatedAmountToLocalCurrency(Number(totalUsdValue), 'KES').then((value) =>
        setLocalBalance(Number(value)),
      )
    }, [tokens])

  return (
    <ScrollView
      style={tw`flex-1 bg-qhitw px-4`}
      showsVerticalScrollIndicator={false}
    >
      {/* Form Container */}
      <View
        style={tw`bg-[#EFF3FF] border border-[#AEC5FF] rounded-lg p-6 mb-4`}
      >
        {/* Paybill Number Section */}
        <View style={tw`mb-4`}>
          <Text style={tw`text-sm text-gray-900 font-medium mb-2`}>
            Paybill Number
          </Text>
          <InputField
            value={paybillNumber}
            onChangeText={setPaybillNumber}
            placeholder="Enter paybill number"
            keyboardType="numeric"
            icon={<ListIcon width={0} height={0} style={tw`mr-4`} />}
          />
        </View>

        {/* Account Number Section */}
        <View style={tw`mb-4`}>
          <Text style={tw`text-sm text-gray-900 font-medium mb-2`}>
            Account Number
          </Text>
          <InputField
            value={accountNumber}
            onChangeText={setAccountNumber}
            placeholder="Enter account number"
            keyboardType="numeric"
          />
        </View>

        {/* Amount Section */}
        <View style={tw`mb-4`}>
          <View style={tw`flex-row justify-between items-center mb-2`}>
            <Text style={tw`text-sm text-gray-900 font-medium`}>Amount</Text>
<Text
            style={{
              textAlign: 'left',
              fontFamily: 'Heebo-Medium',
              fontSize: 14,
              color: '#1B1A46',
            }}
          >
            KES {localBalance}
          </Text>
          </View>
          <View
            style={tw`flex-row items-center bg-white border border-[#DAE3FF] rounded py-2 mb-2 bg-[#DAE3FF]`}
          >
            <TextInput
              style={tw`flex-1 font-size-10 pl-5  text-[#333] `}
              value={amount}
              onChangeText={handleAmountChange}
              placeholder="Enter amount"
              placeholderTextColor="#A0A0A0"
              keyboardType="numeric"
            />
          </View>
          <Text style={tw`text-xs text-[#EEA329] font-medium`}>
            (min: 20 max 250,000)
          </Text>
        </View>

        {/* Continue Button */}
        {/* <PrimaryButton onPress={handleSendMoney}
          disabled={!amount ||
            isNaN(Number(amount)) ||
            Number(amount) < 20 || 
            !tokenAmount ||
            isNaN(Number(tokenAmount)) ||
            Number(tokenAmount) <= 0}
          label="Continue" isLoading={loading} /> */}
        
        {openBottom?<PrimaryButton onPress={openSheet}
                      disabled={!amount ||
                        isNaN(Number(amount)) ||
                        Number(amount) < 20 || 
                        !paybillNumber.trim() ||
                        !accountNumber.trim()
                        
                        }
                      label="Continue" isLoading={loading} />:<PrimaryButton onPress={handleSendMoney}
                      disabled={!amount ||
                        isNaN(Number(amount)) ||                      
                       
                        Number(amount) < 20 ||                 
                        !selectedToken||
                        !tokenAmount ||
                        !paybillNumber.trim() ||
                        !accountNumber.trim()||
                        isNaN(Number(tokenAmount)) ||
                        Number(tokenAmount) <= 0}
                      label="Send" isLoading={loading} />}

        {/* Disclaimer */}
        <View style={tw`flex-row items-center`}>
          <NoteIcon width={16} height={16} style={tw`mr-1`} />
          <Text style={tw`text-[10px] text-gray-700 font-medium`}>
            Payment made to the wrong PayBill number is non-refundable
          </Text>
        </View>
      </View>

<TokenSelectorSheet
              ref={tokenSheetRef}
              tokens={tokens}
              onSelect={(token) => setSelectedToken(token)}
            />

      <AlertModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
          resetForm()
        }}
        title={isError?"Transaction Failed":"Transaction Successful"}
        amount={amount ? `Amount: ${amount} KES` : ''}
        iconType={isError?"error":"success"}
        loading={loading}
        accountName={accountNumber ? `Recipient: ${accountNumber}` : ''}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 8,
  },
  backButton: {
    marginRight: 16,
  },
  backArrow: {
    fontSize: 24,
    color: '#333',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    backgroundColor: '#E8F0FF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  copyButton: {
    padding: 4,
  },
  copyIcon: {
    fontSize: 16,
    color: '#2B5CE6',
  },
  amountSection: {
    marginBottom: 32,
  },
  amountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    color: '#333',
    fontWeight: '700',
  },
  limitText: {
    fontSize: 12,
    color: '#FF8C00',
    marginTop: 8,
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: '#2B5CE6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 4,
  },
  disclaimerIcon: {
    fontSize: 14,
    marginRight: 8,
    marginTop: 2,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
})
