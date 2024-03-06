import { JobsProvider } from "../contexts/job/JobContext";
import { SettingProvider } from "./settings/SettingsContext";
import { ToastProvider } from "./toast/ToastContext";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <SettingProvider>
        <JobsProvider>{children}</JobsProvider>
      </SettingProvider>
    </ToastProvider>
  );
}
