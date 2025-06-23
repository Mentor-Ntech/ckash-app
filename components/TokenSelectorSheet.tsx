// components/TokenSelectorSheet.tsx
import React, {
    useRef,
    useImperativeHandle,
    forwardRef,
  } from 'react'
  import {
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    View,
  } from 'react-native'
  import { BottomSheetModal } from '@gorhom/bottom-sheet'
 
  import { TokenBalance } from 'src/tokens/slice'
  import tw from 'twrnc'
import { CustomBottomSheet } from './BottomSheet'
  
  export interface TokenSelectorRef {
    open: () => void
  }
  
  interface Props {
    tokens: TokenBalance[]
    onSelect: (token: TokenBalance) => void
  }
  
  export const TokenSelectorSheet = forwardRef<TokenSelectorRef, Props>(
    ({ tokens, onSelect }, ref) => {
      const bottomSheetRef = useRef<BottomSheetModal>(null)
  
     
      useImperativeHandle(ref, () => ({
        open: () => {
          bottomSheetRef.current?.present()
        },
      }))
  
      const handleSelect = (token: TokenBalance) => {
        onSelect(token)
        bottomSheetRef.current?.close()
      }
  
      return (
        <CustomBottomSheet
          forwardedRef={bottomSheetRef}
          title="Send Crypto"
          description="Choose a token to send"
          
          onClose={() => {}}
        >
          <FlatList
            data={tokens.filter((item) =>
              ['cUSD', 'USDC', 'USD₮'].includes(item.symbol)
            )}
            keyExtractor={(item) => item.tokenId}
            contentContainerStyle={tw`pb-4`}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelect(item)}
                style={tw`flex-row items-center bg-white rounded-lg py-2 px-3 mb-2`}
              >
                <Image
                  source={{ uri: item.imageUrl }}
                  style={tw`w-10 h-10 mr-3 rounded-full`}
                  resizeMode="contain"
                />
                <View style={tw`flex-1`}>
                  <Text style={tw`font-bold text-sm text-[#0034BB]`}>
                    {item.symbol}
                  </Text>
                  <Text style={tw`text-xs text-gray-500`}>{item.name}</Text>
                </View>
                <View style={tw`items-end`}>
                  <Text style={tw`font-bold text-base text-[#0034BB]`}>
                    {Number(item.balance).toFixed(4)}
                  </Text>
                  <Text style={tw`text-xs text-gray-500`}>
                    $
                    {(
                      Number(item.balance) * Number(item.lastKnownPriceUsd)
                    ).toFixed(2)}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </CustomBottomSheet>
      )
    }
  )
  