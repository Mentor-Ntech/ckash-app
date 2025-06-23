import * as React from 'react'
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native'
import tw from 'twrnc'

interface PrimaryButtonProps {
  onPress: () => void
  label: string 
  style?: any
  textStyle?: any
  isLoading?: boolean,
  disabled?: boolean
}

export default function PrimaryButton({
  onPress,
  label,
  style,
  textStyle,
  isLoading,
  disabled
  
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      style={[tw`rounded-lg p-4 mb-4`,
        disabled ? tw`bg-[#DAE3FF]` : tw`bg-[#2B5CE6]`,
        style]}
      onPress={onPress}
      disabled={disabled}
    >
      {isLoading ? (
        <View style={tw`flex-row items-center justify-center`}>
        <ActivityIndicator size="small" color="#fff" style={tw`mr-2`} />
        <Text style={[tw`text-white font-semibold text-lg`, textStyle]}>
          Processing...
        </Text>
      </View>
      ) : (
        <Text style={[tw`text-white text-center font-semibold text-lg`, textStyle]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  )
}
