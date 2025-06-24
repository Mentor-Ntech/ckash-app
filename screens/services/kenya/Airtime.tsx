import * as React from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native'
import { RootStackScreenProps } from '../../types'
import NoteIcon from '../../../assets/icons/note-icon.svg'
import { useWalletClient } from '@divvi/mobile'
import { useTokens } from '../../../utils'
import ContactIcon from '../../../assets/icons/contact-icon.svg'
import {
  calculateTotalUsdValue,
  getRatedAmount,
  getRatedAmountToLocalCurrency,
  sendTransactionStable,
} from '../../../lib/cKash'
import { PRETIUM_ADDRESS } from '../../../constants/constant'
import { TokenBalance } from 'src/tokens/slice'
import ContactList from '../../../components/ContactList'
import PrimaryButton from '../../../components/PrimaryButton'
import InputField from '../../../components/InputField'
import { useContactPicker } from '../../../hooks/useContactPicker'

import { ContactPickerModal } from '../../../components/ContactPickerModal'

interface SavedContact {
  phone: string
  name: string
}

interface AmountOption {
  value: number
  label: string
}

export default function BuyAirtime(
  _props: RootStackScreenProps<'KenyaBuyAirtime'>,
) {
  const [phoneNumber, setPhoneNumber] = React.useState<string>('')
  const [selectedAmount, setSelectedAmount] = React.useState<number | null>(
    null,
  )
  const [customAmount, setCustomAmount] = React.useState<string>('')
  const [activeTab, setActiveTab] = React.useState<'saved' | 'recent'>('saved')

  const { data: walletClient } = useWalletClient({ networkId: 'celo-mainnet' })
  const [localBalance, setLocalBalance] = React.useState<number>(0.0)

  const { tokens, cUSDToken } = useTokens()

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

  const amountOptions: AmountOption[] = [
    { value: 100, label: 'KES 100' },
    { value: 200, label: 'KES 200' },
    { value: 500, label: 'KES 500' },
    { value: 1000, label: 'KES 1000' },
    { value: 2000, label: 'KES 2000' },
    { value: 5000, label: 'KES 5000' },
  ]

  const [savedContacts] = React.useState<SavedContact[]>([
    { phone: '0701707772', name: 'Ronex' },
    { phone: '0703449363', name: 'Saint Brisa' },
  ])

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '')
    // Format as XXXX XXX XXXX
    const formatted = cleaned.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3')
    setPhoneNumber(formatted)
  }

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (text: string) => {
    setCustomAmount(text)
    setSelectedAmount(null)
  }

  const handleBuyAirtime = async () => {
    try {
      const amount = selectedAmount || parseFloat(customAmount)
      if (!amount || !phoneNumber) {
        Alert.alert('Error', 'Please select an amount and enter phone number')
        return
      }

      if (true) {
        const calculatedAmount = await getRatedAmount(amount, 'KES')

        const txHash = await sendTransactionStable({
          to: cUSDToken?.address as `0x${string}`,
          recipient: PRETIUM_ADDRESS as `0x${string}`,
          from: walletClient?.account?.address as `0x${string}`,
          amount: calculatedAmount.toString(),
          feeCurrency: cUSDToken?.address as `0x${string}`,
          tokenBalance: cUSDToken as TokenBalance,
          type: 'cip64',
        })
        console.log('The txHash is ', txHash)
        Alert.alert('Success', `Airtime purchase successful! Hash: ${txHash}`)
      }
    } catch (error) {
      console.log('THE ERROR', error)
      Alert.alert('Error', `Transaction failed: ${error}`)
    }
  }

  const selectContact = (contact: SavedContact) => {
    setPhoneNumber(contact.phone)
  }

  React.useEffect(() => {
    if (!tokens || tokens.length === 0) return
    let totalUsdValue = calculateTotalUsdValue(tokens)
    getRatedAmountToLocalCurrency(Number(totalUsdValue), 'KES').then(
      (value: any) => setLocalBalance(Number(value)),
    )
  }, [tokens])

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Amount Selection Card */}
      <View style={styles.amountCard}>
        <Text style={styles.cardTitle}>Choose Amount (KES)</Text>
        <View style={styles.amountOptionsGrid}>
          {amountOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.amountOption,
                selectedAmount === option.value && styles.amountOptionSelected,
              ]}
              onPress={() => handleAmountSelect(option.value)}
            >
              <Text
                style={[
                  styles.amountOptionText,
                  selectedAmount === option.value &&
                    styles.amountOptionTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Amount Input */}
        <View style={styles.customAmountSection}>
          <View style={styles.customAmountHeader}>
            <Text style={styles.customAmountLabel}>Input an Amount (KES)</Text>
            <Text style={styles.balanceText}>KES {localBalance}</Text>
          </View>
          <TextInput
            style={styles.customAmountInput}
            value={customAmount}
            onChangeText={handleCustomAmountChange}
            placeholder="KES 100"
            placeholderTextColor="#A0A0A0"
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Phone Number Input */}
      <View style={styles.phoneSection}>
        <Text style={styles.phoneLabel}>Phone Number</Text>
        <InputField
          value={phoneNumber}
          onChangeText={handlePhoneChange}
          placeholder="0816 057 3659"
          keyboardType="phone-pad"
          maxLength={13}
          icon={<ContactIcon width={24} height={24} />}
          onIconPress={openContactPicker}
        />
        <TouchableOpacity
          style={styles.noteContainer}
          onPress={openContactPicker}
        >
          <NoteIcon width={16} height={16} style={styles.noteIcon} />
          <Text style={styles.noteText}>
            All mobile networks are supported - Tap to select from contacts
          </Text>
        </TouchableOpacity>
      </View>

      {/* Continue Button */}
      <PrimaryButton onPress={handleBuyAirtime} label="Continue" />

      {/* Contact Picker Modal */}
      <ContactPickerModal
        visible={isModalVisible}
        onClose={closeContactPicker}
        onContactSelect={handleContactSelect}
      />

      {/* Contacts Section */}
      <ContactList
        contacts={savedContacts}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onContactSelect={selectContact}
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
  amountCard: {
    backgroundColor: '#EFF3FF',
    borderWidth: 1,
    borderColor: '#AEC5FF',
    borderRadius: 8,
    padding: 24,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 8,
  },
  amountOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amountOption: {
    borderRadius: 8,
    padding: 16,
    width: '31%',
    borderWidth: 1,
    borderColor: '#B2C7FF',
    marginBottom: 8,
    backgroundColor: '#DAE3FF',
  },
  amountOptionSelected: {
    backgroundColor: '#2B5CE6',
  },
  amountOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'black',
  },
  amountOptionTextSelected: {
    color: 'white',
  },
  customAmountSection: {
    marginTop: 8,
  },
  customAmountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  customAmountLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  balanceText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'black',
  },
  customAmountInput: {
    backgroundColor: '#DAE3FF',
    borderWidth: 1,
    borderColor: '#B2C7FF',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 4,
  },
  phoneSection: {
    padding: 16,
    marginBottom: 16,
  },
  phoneLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 8,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteIcon: {
    marginRight: 4,
  },
  noteText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
})
