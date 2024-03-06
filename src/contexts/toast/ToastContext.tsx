import { createContext, useContext, useState } from "react";
import { SettingsProviderProps, ToastContextType } from "./interfaces.tsx";

const ToastContext = createContext({} as ToastContextType);

function ToastProvider({ children }: SettingsProviderProps) {
  //State Loading
  const [
    loadingTestConnectionLocalEnvironment,
    setLoadingTestConnectionLocalEnvironment,
  ] = useState(false);

  const [
    loadingTestConnectionRemoteEnvironment,
    setLoadingTestConnectionRemoteEnvironment,
  ] = useState(false);

  //toast Test Connection
  const [
    toastTestConnectionLocalEnvironment,
    setToastTestConnectionLocalEnvironment,
  ] = useState({ status: false, type: "", message: "" });

  const [
    toastTestConnectionRemoteEnvironment,
    setToastTestConnectionRemoteEnvironment,
  ] = useState({ status: false, type: "", message: "" });

  function updateLoadingTestConnectionLocalEnvironment(status: boolean) {
    setLoadingTestConnectionLocalEnvironment(status);
  }

  function updateLoadingTestConnectionRemoteEnvironment(status: boolean) {
    setLoadingTestConnectionRemoteEnvironment(status);
  }

  function updateToastTestConnectionLocalEnvironment(
    status: boolean,
    type: string,
    message: string
  ) {
    setToastTestConnectionLocalEnvironment({ status, type, message });
  }

  function updateToastTestConnectionRemoteEnvironment(
    status: boolean,
    type: string,
    message: string
  ) {
    setToastTestConnectionRemoteEnvironment({ status, type, message });
  }

  return (
    <ToastContext.Provider
      value={{
        loadingTestConnectionLocalEnvironment,
        loadingTestConnectionRemoteEnvironment,
        toastTestConnectionLocalEnvironment,
        toastTestConnectionRemoteEnvironment,
        updateLoadingTestConnectionLocalEnvironment,
        updateLoadingTestConnectionRemoteEnvironment,
        updateToastTestConnectionLocalEnvironment,
        updateToastTestConnectionRemoteEnvironment,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

function useToast() {
  const context = useContext(ToastContext);
  return context;
}

export { ToastContext, ToastProvider, useToast };
