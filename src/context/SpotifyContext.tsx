import { createContext, useContext,  ReactNode } from 'react';
import {useCheckUserToken} from "../hooks/HasSpotifyToken.tsx";

const SpotifyContext = createContext<ReturnType<typeof useCheckUserToken> | undefined>(undefined);

export function SpotifyProvider({ children }: { children: ReactNode }) {
    const auth = useCheckUserToken();
  
    return <SpotifyContext.Provider value={auth}>{children}</SpotifyContext.Provider>;
  }
  export function useSpotify() {
    const context = useContext(SpotifyContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  }