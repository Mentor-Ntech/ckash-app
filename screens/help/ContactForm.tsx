import * as React from 'react'
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Linking,
} from 'react-native'
import { RootStackScreenProps } from '../types'
import InputField from '../../components/InputField'
import PrimaryButton from '../../components/PrimaryButton'
import Button from '../../components/ui/Button'
import tw from 'twrnc'
import { colors, typeScale } from '../../utils'
import GmailIcon from '../../assets/icons/gmail-icon.svg'
import AlertModal from '../../components/AlertModal'
import ZendeskService from '../../lib/zendesk'

export default function ContactForm(
  _props: RootStackScreenProps<'ContactForm'>,
) {
  const [message, setMessage] = React.useState('')
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showSuccessModal, setShowSuccessModal] = React.useState(false)

  const handleSubmit = async () => {
    if (!message.trim() || !name.trim() || !email.trim()) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Create Zendesk service instance
      const zendeskService = new ZendeskService()
      
      // Create support ticket
      const result = await zendeskService.createSupportTicket(
        name.trim(),
        email.trim(),
        message.trim()
      )
      
      if (result.success) {
        // Show success modal
        setShowSuccessModal(true)
        
        // Clear form fields
        setMessage('')
        setName('')
        setEmail('')
      } else {
        // Show error alert
        Alert.alert('Error', result.message || 'Failed to send message. Please try again.')
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUseEmailApp = () => {
    const email = 'support@ckash.app'
    const subject = 'Support Request'
    const body = 'Hello,\n\nI need help with the following:\n\n'
    
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    
    Linking.openURL(mailtoUrl).catch((err) => {
      Alert.alert('Error', 'Could not open email app. Please make sure you have an email app installed.')
    })
  }
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Message Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Message</Text>
        <TextInput
          style={styles.messageInput}
          placeholder="Please type your message here"
          placeholderTextColor="#A0A0A0"
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
      </View>

      {/* Name Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Name</Text>
        <InputField
          placeholder="Please enter your name"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Email Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Email</Text>
        <InputField
          placeholder="Enter your email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>



      {/* Submit Button */}
      <PrimaryButton
        label="Submit"
        onPress={handleSubmit}
        isLoading={isSubmitting}
        style={styles.submitButton}
      />

      {/* Separator */}
      <View style={styles.separatorContainer}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>or</Text>
        <View style={styles.separatorLine} />
      </View>

      {/* Use Email App Button */}
      <TouchableOpacity 
        style={styles.emailAppButtonContainer}
        onPress={handleUseEmailApp}
        activeOpacity={0.7}
      >
        <GmailIcon width={20} height={20} />
        <Text style={styles.emailAppButtonText}>Use Email App</Text>
      </TouchableOpacity>

      {/* Success Modal */}
      <AlertModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Ticket Created"
        iconType="success"
        accountName="Your support ticket has been created successfully. Our team will respond shortly."
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontFamily: 'Heebo-Bold',
    fontSize: 24,
    color: colors.contentPrimary,
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Heebo-Medium',
    fontSize: 16,
    color: colors.contentPrimary,
    marginBottom: 8,
  },
  messageInput: {
    backgroundColor: '#DAE3FF',
    borderWidth: 1,
    borderColor: '#DAE3FF',
    borderRadius: 8,
    padding: 16,
    minHeight: 120,
    fontFamily: 'Heebo-Regular',
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
  },

  submitButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  separatorText: {
    marginHorizontal: 16,
    color: '#666',
    fontFamily: 'Heebo-Medium',
    fontSize: 14,
  },
  emailAppButtonContainer: {
    backgroundColor: '#DAE3FF',
    borderWidth: 1,
    borderColor: '#AEC5FF',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emailAppButtonText: {
    color: colors.contentPrimary,
    fontFamily: 'Heebo-Medium',
    fontSize: 16,
  },
}) 