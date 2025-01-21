export interface SettingJobExecutionContextType {
  updateSettingsJobExecution: () => void;
  updateStateChecked: (checkedSwitch: boolean) => void;
  updateStateInterval: (interval: string) => void;
  checkJobsInExecution: () => void
  checked: boolean;
  executionInterval: string;
  loadingSaveSettingsJobExecution: boolean;
}

export interface SettingJobExecutionProviderProps {
  children: React.ReactNode;
}

export interface SettingJobExecutionProps {
  status: number;
  interval: number;
}
