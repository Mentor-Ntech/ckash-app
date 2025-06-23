import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet'; // Import BottomSheetView and BottomSheetBackdrop
import React, { useCallback } from 'react'; // Import useCallback
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  forwardedRef: React.RefObject<BottomSheetModal>;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  snapPoints?: (string | number)[];
  onClose?: () => void;
}

export const CustomBottomSheet = ({
  forwardedRef,
  title,
  description,
  children,
  snapPoints = ['80%'], // Added '60%' as a common second snap point example
  onClose,
}: Props) => {
  console.log("THE ITTE",forwardedRef)
  // Memoized backdrop component for better performance and to ensure it appears
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0} // Backdrop appears when sheet is at index 0 or higher
        disappearsOnIndex={-1} // Backdrop disappears when sheet is fully closed
        enableTouchThrough={false} // Prevents touches from passing through the backdrop
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={forwardedRef}
      index={0} // Ensure it starts open at the first snap point
      snapPoints={snapPoints}
      onDismiss={onClose} // Called when the sheet is completely closed/dismissed
      backdropComponent={renderBackdrop} // Add the backdrop component
      // Consider adding enableDynamicSizing={false} if you have fixed content height issues
      // enableDynamicSizing={false}
    >
      {/* Use BottomSheetView for the content wrapper */}
      <BottomSheetView style={styles.contentContainer}>
        {title && <Text style={styles.title}>{title}</Text>}
        {description && <Text style={styles.description}>{description}</Text>}
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 20,
    flex: 1, // Add flex: 1 to the content container to help it expand
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    color: 'gray',
    marginBottom: 10, // Added some margin for spacing
  },
});

