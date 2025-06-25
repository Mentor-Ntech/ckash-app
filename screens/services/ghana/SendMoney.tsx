import * as React from 'react'
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native'
import { RootStackScreenProps } from '../../types'
import { useSend } from '../../../hooks/useSend'
import { useTokens } from '../../../utils'
import { useWalletClient } from '@divvi/mobile'
import {
  getExchangeRate,
  getRatedAmount,
  getRatedAmountToLocalCurrency,
  calculateTotalUsdValue,
  validateAccount,
} from '../../../lib/cKash'
import debounce from 'lodash.debounce'
import { TokenBalance } from 'src/tokens/slice'
import AlertModal from '../../../components/AlertModal'
import PrimaryButton from '../../../components/PrimaryButton'
import InputField from '../../../components/InputField'
import { MobileNetwork } from '../../../api/types'
import MtnIcon from '../../../assets/icons/mtn-icon.svg'
import AirtelTigoIcon from '../../../assets/icons/airteltigo-icon.svg'
import TelecelIcon from '../../../assets/icons/telecel-icon.svg'
import ContactListIcon from '../../../assets/icons/list-icon.svg'
import { useContactPicker } from '../../../hooks/useContactPicker'
import { ContactPickerModal } from '../../../components/ContactPickerModal'
import { TokenSelectorRef, TokenSelectorSheet } from '../../../components/TokenSelectorSheet'

interface Bank {
  id: string
  name: string
  logo: React.ComponentType<any>
}

export default function GhanaSendMoney(
  _props: RootStackScreenProps<'GhanaSendMoney'>,
) {
  const [selectedBank, setSelectedBank] = React.useState<Bank | null>(null)
  const [accountNumber, setAccountNumber] = React.useState<string>('')
  const [accountName, setAccountName] = React.useState<string | null>(null)
  const [amount, setAmount] = React.useState<string>('')
  const [modalVisible, setModalVisible] = React.useState(false)
  const { data: walletClient } = useWalletClient({ networkId: 'celo-mainnet' })

  const [tokenAmount, setTokenAmount] = React.useState<string>('')
  const [localBalance, setLocalBalance] = React.useState<number>(0.0)



  const { sendMoney, loading, isError } = useSend()

  const { tokens, cUSDToken } = useTokens()

  const [selectedToken, setSelectedToken] = React.useState<TokenBalance | null>(null)
        const [openBottom,setOpenBottom]= React.useState<boolean>(true)
      const tokenSheetRef = React.useRef<TokenSelectorRef>(null)
      
    
      const openSheet = () => {
        tokenSheetRef.current?.open() 
        setOpenBottom(false)
      };

  const {
    openContactPicker,
    closeContactPicker,
    isModalVisible,
    handleContactSelect,
  } = useContactPicker({
    onContactSelect: (formattedNumber: string) => {
      setAccountNumber(formattedNumber)
    },
  })

  const fetchTokenAmount = React.useCallback(
    debounce(async (text: string) => {
      const numericValue = parseFloat(text)
      if (isNaN(numericValue)) {
        setTokenAmount('0')
        return
      }

      try {
        const ratedAmountToDeduct = await getRatedAmount(numericValue, 'GHS')
        console.log('RATE AMOUNT', ratedAmountToDeduct)
        const rate = await getExchangeRate('GHS')
        console.log('RATE RATE', rate)
        setTokenAmount(ratedAmountToDeduct.toString())
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error)
      }
    }, 500), // Delay in ms
    [],
  )

  const banks: Bank[] = [
    { id: 'mtn', name: 'MTN', logo: MtnIcon },
    { id: 'telecel', name: 'Telcel', logo: TelecelIcon },
    { id: 'airteltigo', name: 'AirtelTigo', logo: AirtelTigoIcon },
  ]

  const handleBankSelect = (bank: Bank) => {
    setSelectedBank(bank)
  }

  const handleAccountNumberChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '')
    setAccountNumber(cleaned)
  }

  const account_name = async (shortcode: string) => {
    try {
      const result = await validateAccount({
        shortcode: shortcode,
        mobile_network: selectedBank?.name as MobileNetwork,
        country_code: 'GHS',
      })
      setAccountName(result || null)
    } catch (error) {
      setAccountName(null)
    }
  }

  React.useEffect(() => {
    if (accountNumber.length >= 10 && selectedBank) {
      account_name(accountNumber)
    } else {
      setAccountName(null)
    }
  }, [accountNumber, selectedBank])

  React.useEffect(() => {
    if (!tokens || tokens.length === 0) return
    let totalUsdValue = calculateTotalUsdValue(tokens)
    getRatedAmountToLocalCurrency(Number(totalUsdValue), 'GHS').then((value) =>
      setLocalBalance(Number(value)),
    )
  }, [tokens])

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
    setAccountName(null)
  }

  const handleSendMoney = async () => {
    try {
      if (
        !tokenAmount ||
        tokenAmount == null ||
        tokenAmount == undefined ||
        !accountName
      ) {
        Alert.alert('All Fields required')
        return
      }
      if (!selectedBank) {
        Alert.alert('Please Select Mobile Network')
        return
      }
      const { response } = await sendMoney({
        shortcode: accountNumber,
        account_name: accountName,
        ratedTokenAmount: tokenAmount,
        rawAmount: amount,
        country_code: 'GHS',
        type: 'MOBILE',
        mobileNetwork: selectedBank?.name as MobileNetwork,
        tokenBalance: selectedToken as TokenBalance,
        from: walletClient?.account?.address as `0x${string}`,
        to: selectedToken?.address as `0x${string}`,
        feeCurrency: selectedToken?.feeCurrencyAdapterAddress?selectedToken?.feeCurrencyAdapterAddress:selectedToken?.address as `0x${string}`,
        tokenDecimal:selectedToken?.decimals as number
      })
      console.log('THE RESPONSE', response)
      setModalVisible(true)
    } catch (error) {
      console.log('THE ERROR', error)
      Alert.alert(`${error}`)
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Bank Selection Section */}
      <View style={styles.bankSelectionCard}>
        <Text style={styles.sectionTitle}>Select Network</Text>
        <View style={styles.bankRow}>
          {banks.map((bank) => {
            const LogoComponent = bank.logo
            return (
              <TouchableOpacity
                key={bank.id}
                style={[
                  styles.bankButton,
                  selectedBank?.id === bank.id && styles.bankButtonSelected,
                ]}
                onPress={() => handleBankSelect(bank)}
              >
                <LogoComponent width={24} height={24} style={styles.bankLogo} />
                <Text
                  style={[
                    styles.bankText,
                    selectedBank?.id === bank.id && styles.bankTextSelected,
                  ]}
                >
                  {bank.name}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        <Text style={styles.inputLabel}>Account Number/Mobile Number</Text>
        <InputField
          value={accountNumber}
          onChangeText={handleAccountNumberChange}
          placeholder="Enter account number"
          keyboardType="numeric"
          maxLength={15}
          icon={<ContactListIcon width={24} height={24} />}
          onIconPress={openContactPicker}
        />

        {accountName && (
          <Text style={styles.accountNameText}>
            Account name: {accountName}
          </Text>
        )}
      </View>

      {/* Amount Section */}
      <View style={styles.amountSection}>
        <View style={styles.amountHeader}>
          <Text style={styles.amountLabel}>Enter Amount (GHS)</Text>
          <Text style={styles.balanceText}>GHS {localBalance}</Text>
        </View>
        <TextInput
          style={styles.amountInput}
          value={amount}
          onChangeText={handleAmountChange}
          placeholder="GHS 10"
          placeholderTextColor="#A0A0A0"
          keyboardType="numeric"
        />
        <Text style={styles.limitText}>(min: ₵5 max ₵1,000)</Text>
      </View>

      {/* Continue Button */}
      {/* <PrimaryButton
        onPress={handleSendMoney}
        label="Continue"
        disabled={
          !amount ||
          isNaN(Number(amount)) ||
          !accountNumber ||
          !accountName ||
          Number(amount) < 5 ||
          !selectedBank?.name ||
          !tokenAmount ||
          isNaN(Number(tokenAmount)) ||
          Number(tokenAmount) <= 0
        }
        isLoading={loading}
      /> */}

      {openBottom?<PrimaryButton onPress={openSheet}
                          disabled={!amount ||
                            isNaN(Number(amount)) ||
                            !accountNumber ||
                            !accountName ||
                            Number(amount) < 5 || 
                            !selectedBank?.name                      
                            }
                          label="Continue" isLoading={loading} />:<PrimaryButton onPress={handleSendMoney}
                          disabled={!amount ||
                            isNaN(Number(amount)) ||
                            !accountNumber ||
                            !accountName ||
                            Number(amount) < 5 || 
                            !selectedBank?.name  ||                
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
                    onSelect={(token) => setSelectedToken(token)}
            />
            

      <AlertModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
          resetForm()
        }}
        title={isError ? 'Transaction Failed' : 'Transaction Successful'}
        amount={amount ? `Amount: ${amount} GHS` : ''}
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
  bankSelectionCard: {
    backgroundColor: '#EFF3FF',
    borderWidth: 1,
    borderColor: '#AEC5FF',
    borderRadius: 8,
    padding: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    textAlign: 'left',
    fontWeight: '500',
    fontSize: 14,
    marginBottom: 8,
    color: '#1B1A46',
  },
  bankRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bankButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    flex: 1,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  bankButtonSelected: {
    borderColor: '#2563EB',
  },
  bankLogo: {
    marginBottom: 4,
  },
  bankText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  bankTextSelected: {
    color: '#2563EB',
  },
  inputLabel: {
    textAlign: 'left',
    marginTop: 24,
    marginBottom: 8,
    fontWeight: '500',
    fontSize: 14,
    color: '#1B1A46',
  },
  accountNameText: {
    textAlign: 'left',
    marginTop: 8,
    fontWeight: '500',
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
    fontWeight: '500',
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
