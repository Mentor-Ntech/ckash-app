import { useDispatch, useSelector } from 'react-redux';
import type { RootnewState, AppnewDispatch } from '../store/store';
import { setCountry, toggleHideBalance, setHideBalance } from '../store/settingsSlice';

export const useSettings = () => {
    // const dispatch = useDispatch<AppDispatch>();
   
    // const country = useSelector((state: RootState) => state.settings?.country as string );
    // console.log("THE COUNTRY IS",country)
    // const hideBalance = useSelector((state: RootState) => state.settings?.hideBalance);
  
    // return {
    //   country,
    //   hideBalance,
    //   setCountry: (val: string) => dispatch(setCountry(val)),
    //   toggleHideBalance: () => dispatch(toggleHideBalance()),
    //   setHideBalance: (val: boolean) => dispatch(setHideBalance(val)),
  // };
  const dispatch = useDispatch<AppnewDispatch>();
   
  // Log the entire Redux state object directly from the selector
  const debugState = useSelector((state: RootnewState) => {
      console.log("--- DEBUGGING REDUX STATE ---");
      console.log("Full State object from useSelector:", state);
      if (!state.settings) {
          console.error("state.settings is UNDEFINED or NULL!");
      } else {
          console.log("state.settings content:", state.settings);
      }
      console.log("--- END DEBUG ---");
      return state; // Return the full state for potential further inspection, though not directly used for the values below
  })
  console.log("THE COUNTRY IS FINALLY (from useSettings hook Form DEBUG):", debugState);
  // Now, safely access the properties using the state from the main selector
  const country = useSelector((state: RootnewState) => state.settings?.country); // Removed 'as string' for pure debugging, although it's fine
  console.log("THE COUNTRY IS FINALLY (from useSettings):", country);

  const hideBalance = useSelector((state: RootnewState) => state.settings?.hideBalance);

  return {
    country: country as string, // Cast back for return type
    hideBalance: hideBalance as boolean, // Cast back for return type
    setCountry: (val: string) => dispatch(setCountry(val)),
    toggleHideBalance: () => dispatch(toggleHideBalance()),
    setHideBalance: (val: boolean) => dispatch(setHideBalance(val)),
  };
  };
