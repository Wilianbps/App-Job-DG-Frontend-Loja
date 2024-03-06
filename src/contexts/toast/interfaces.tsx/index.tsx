export interface ToastContextType {
  loadingTestConnectionLocalEnvironment: boolean;
  loadingTestConnectionRemoteEnvironment: boolean;
  toastTestConnectionLocalEnvironment: {
    status: boolean;
    type: string;
    message: string;
  };
  toastTestConnectionRemoteEnvironment: {
    status: boolean;
    type: string;
    message: string;
  };

  updateLoadingTestConnectionLocalEnvironment: (status: boolean) => void;
  updateLoadingTestConnectionRemoteEnvironment: (status: boolean) => void;
  updateToastTestConnectionLocalEnvironment: (
    status: boolean,
    type: string,
    message: string
  ) => void;
  updateToastTestConnectionRemoteEnvironment: (
    status: boolean,
    type: string,
    message: string
  ) => void;
}

export interface SettingsProviderProps {
  children: React.ReactNode;
}
