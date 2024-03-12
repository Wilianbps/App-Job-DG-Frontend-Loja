import { JobsProvider } from "../contexts/job/JobContext";
import { SettingJobExecutionProvider } from "./settingJobExecution/SettingJobExecutionContex";
import { SettingProvider } from "./settings/SettingsContext";
import { ToastProvider } from "./toast/ToastContext";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <SettingProvider>
        <SettingJobExecutionProvider>
          <JobsProvider>{children}</JobsProvider>
        </SettingJobExecutionProvider>
      </SettingProvider>
    </ToastProvider>
  );
}
