import * as React from 'react'
import { navigate } from '@divvi/mobile'
import { RootStackScreenProps } from './types'
import { View, StyleSheet, Text, FlatList, Pressable, Dimensions } from 'react-native'
import SimpleDropdown from '../components/ui/SimpleDropdown'

import tw from 'twrnc'
import { services } from '../constants/constant'

const { width: screenWidth } = Dimensions.get('window')

export default function ServiceScreen(_props: RootStackScreenProps<'Service'>) {
  const [selectedCountry, setSelectedCountry] = React.useState('Kenya')
  // Dropdown state
  const [dropdownItems] = React.useState([
    { label: '🇰🇪 Kenya', value: 'Kenya' },
    { label: '🇺🇬 Uganda', value: 'Uganda' },
    { label: '🇬🇭 Ghana', value: 'Ghana' },
    { label: '🇳🇬 Nigeria', value: 'Nigeria' },
  ])

  const handleCountrySelect = (value: string) => {
    setSelectedCountry(value)
  }

  // Calculate card width based on screen size
  const getCardWidth = () => {
    const padding = 32 // Total horizontal padding (16 * 2)
    const gap = 32 // Total gap between 3 cards (16 * 2)
    const availableWidth = screenWidth - padding - gap
    return availableWidth / 3
  }

  const cardWidth = getCardWidth()

  return (
    <View style={styles.container}>
      {/**Countries */}
      <View style={styles.countries_selection}>
        <Text
          style={{ fontFamily: 'Heebo-Medium', fontSize: 18, color: '#1B1A46' }}
        >
          Utilities
        </Text>
        <View
          style={{ backgroundColor: 'transparent', width: '40%', zIndex: 1000 }}
        >
          <SimpleDropdown
            items={dropdownItems}
            selectedValue={selectedCountry}
            onSelect={handleCountrySelect}
            dropdownStyle="h-6 w-22 border-transparent bg-[#8DADFE] ml-14 rounded-[2px] flex-row items-center justify-between px-2"
            textStyle="text-xs text-black flex-1 font-normal"
            dropdownListStyle="bg-[#8DADFE] rounded-md rounded-[2px] border border-[#7A96FE]"
            itemStyle="px-2 py-2.5 border-b border-[#7A96FE]/30"
            selectedItemStyle="bg-[#6B8BFE] px-2 py-2.5 border-[#5A7BFE]"
            itemTextStyle="text-xs text-black font-normal"
            selectedItemTextStyle="text-xs text-white font-medium"
            maxHeight={160}
          />
        </View>
      </View>

      {/**Services */}
      <View style={styles.services}>
        <FlatList
          data={services[selectedCountry]}
          keyExtractor={(index) => index.toString()}
          style={{ width: '100%' }}
          showsHorizontalScrollIndicator={false}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
          numColumns={3}
          renderItem={({ item }) => (
            <Pressable
              key={item.name}
              onPress={() => {
                console.log(`Navigate to ${item.navigate}`)
                navigate(item.navigate)
              }}
              style={[
                tw`justify-center items-center bg-[#C0D0FF] rounded border border-[#AEC5FF]`,
                {
                  width: cardWidth,
                  paddingVertical: screenWidth < 380 ? 8 : 10, // Responsive padding
                  paddingHorizontal: screenWidth < 380 ? 4 : 8, // Responsive padding
                }
              ]}
            >
              <item.icon 
                width={screenWidth < 380 ? 50 : 60} 
                height={screenWidth < 380 ? 35 : 40} 
              />
              <Text
                style={{
                  fontSize: screenWidth < 380 ? 9 : 10, // Responsive font size
                  textAlign: 'center',
                  fontFamily: 'Heebo-Medium',
                  fontWeight: '600',
                  color: '#002586',
                  lineHeight: screenWidth < 380 ? 14 : 16, // Responsive line height
                  marginTop: 4,
                }}
              >
                {item.name}
              </Text>
            </Pressable>
          )}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  countries_selection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  services: {
    flex: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
