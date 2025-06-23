import * as React from 'react'
import tw from 'twrnc'
import { Pressable, Text, Dimensions } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const { width: screenWidth } = Dimensions.get('window')

interface ServiceButtonProps {
  name: string
  navigate: string
  icon: React.FC<{ width: number; height: number }>
}

export default function ServiceButton({
  name,
  navigate,
  icon: Icon,
}: ServiceButtonProps) {
  const navigation = useNavigation()

  // Responsive sizing based on screen width
  const getResponsiveStyles = () => {
    if (screenWidth < 380) {
      return {
        width: 100,
        iconWidth: 14,
        iconHeight: 18,
        fontSize: 9,
        paddingHorizontal: 8,
        paddingVertical: 12,
      }
    } else if (screenWidth < 420) {
      return {
        width: 108,
        iconWidth: 15,
        iconHeight: 19,
        fontSize: 9.5,
        paddingHorizontal: 10,
        paddingVertical: 14,
      }
    } else {
      return {
        width: 116,
        iconWidth: 16,
        iconHeight: 20,
        fontSize: 10,
        paddingHorizontal: 12,
        paddingVertical: 16,
      }
    }
  }

  const styles = getResponsiveStyles()

  return (
    <Pressable
      onPress={() => {
        console.log(`Navigate to ${navigate}`)
        navigation.navigate(navigate as never)
      }}
      style={[
        tw`justify-center items-center bg-[#C0D0FF] rounded border border-[#AEC5FF]`,
        {
          width: styles.width,
          paddingHorizontal: styles.paddingHorizontal,
          paddingVertical: styles.paddingVertical,
        }
      ]}
    >
      <Icon width={styles.iconWidth} height={styles.iconHeight} />
      <Text
        style={[
          tw`text-center font-medium text-[#002586] leading-4`,
          {
            fontSize: styles.fontSize,
          }
        ]}
      >
        {name}
      </Text>
    </Pressable>
  )
}
