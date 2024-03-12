export interface SettingJobExecutionContextType {
  settingJobExecution: SettingJobExecutionProps;
}

export interface SettingJobExecutionProviderProps {
  children: React.ReactNode;
}

export interface SettingJobExecutionProps {
  status: number;
  executionInterval: number;
}
