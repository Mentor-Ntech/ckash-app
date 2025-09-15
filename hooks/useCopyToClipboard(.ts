import { useState, useEffect } from 'react';
import { Platform, ToastAndroid } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

export const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copy = (text: string) => {
    if (!text) return;

    Clipboard.setString(text);

    // Show native toast on Android
    if (Platform.OS === 'android') {
      ToastAndroid.show('Copied to clipboard!', ToastAndroid.SHORT);
    }

    setCopied(true);

    // Reset copied state after 1.5 seconds (for custom tooltip/animation)
    setTimeout(() => setCopied(false), 1500);
  };

  return { copy, copied };
};
