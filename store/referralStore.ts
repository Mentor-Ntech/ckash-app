// store/useReferralStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ReferralState {
    referralCode: string | null;
    referralLink: string | null;
    userAddress: string | null;
  setReferralCode: (code: string,link: string,userAddress:string) => void;
  clearReferralCode: () => void;
}

export const useReferralStore = create<ReferralState>()(
  persist(
    (set) => ({
          referralCode: null,
          referralLink: null,
          userAddress:null,

      setReferralCode: (code: string,referralLink:string,userAddress:string) => set({ referralCode: code ,referralLink:referralLink,userAddress:userAddress}),

      clearReferralCode: () => set({ referralCode: null,referralLink:null,userAddress:null }),
    }),
    {
      name: 'referral-storage', // storage key
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
