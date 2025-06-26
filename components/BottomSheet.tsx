import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet'; // Import BottomSheetView and BottomSheetBackdrop
import React, { useCallback } from 'react'; // Import useCallback
import { View, Text, StyleSheet } from 'react-native';
import { rate } from './TokenSelectorSheet';

interface Props {
  forwardedRef: React.RefObject<BottomSheetModal>;
  title?: string;
  description?: string;
  currencyRate: rate;
  children?: React.ReactNode;
  snapPoints?: (string | number)[];
  onClose?: () => void;
}

export const CustomBottomSheet = ({
  forwardedRef,
  title,
  description,
  currencyRate,
  children,
  snapPoints = ['80%'], 
  onClose,
}: Props) => {
  console.log("THE ITTE",forwardedRef)
  
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0} 
        disappearsOnIndex={-1} 
        enableTouchThrough={false} 
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={forwardedRef}
      index={0} 
      snapPoints={snapPoints}
      onDismiss={onClose} 
      backdropComponent={renderBackdrop} 
      
    >
      {/* Use BottomSheetView for the content wrapper */}
      <BottomSheetView style={styles.contentContainer}>
        {title && <Text style={styles.title}>{title}</Text>}
        {currencyRate && <Text style={styles.description}>Rate: * $1.00 = {currencyRate.amount} { currencyRate.country}</Text>}
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 20,
    flex: 1, 
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    color: 'gray',
    marginBottom: 10, 
  },
});

