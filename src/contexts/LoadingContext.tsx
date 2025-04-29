import { createContext, PropsWithChildren, useContext, useState } from "react";

type LoadingContextProps = {
  loading: boolean;
  setLoading: (l: boolean) => void;
};

export const LoadingContext = createContext<LoadingContextProps>({
  loading: false,
  setLoading: (l: boolean) => {},
});

export function LoadingProvider({ children }: PropsWithChildren) {
  const [loading, setLoading] = useState(false);
  const contextProps: LoadingContextProps = {
    loading,
    setLoading,
  };

  return (
    <LoadingContext.Provider value={contextProps}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoadingContext() {
  const ctx = useContext(LoadingContext);
  return ctx;
}
