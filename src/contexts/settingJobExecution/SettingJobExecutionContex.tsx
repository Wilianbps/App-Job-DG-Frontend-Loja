import { createContext, useContext, useEffect, useState } from "react";
import {
  SettingJobExecutionContextType,
  SettingJobExecutionProps,
  SettingJobExecutionProviderProps,
} from "./interfaces";
import { apiLoja } from "../../services/axios";

const SettingJobExecutionContext = createContext(
  {} as SettingJobExecutionContextType
);

function SettingJobExecutionProvider({
  children,
}: SettingJobExecutionProviderProps) {
  const [settingJobExecution, setSettingJobExecution] =
    useState<SettingJobExecutionProps>({} as SettingJobExecutionProps);

  async function getSettingJobExecution() {
    const response = await apiLoja.get("setting-job-execution");
    setSettingJobExecution(response.data[0]);
  }

  useEffect(() => {
    getSettingJobExecution();
  }, []);

  return (
    <SettingJobExecutionContext.Provider value={{ settingJobExecution }}>
      {children}
    </SettingJobExecutionContext.Provider>
  );
}

function useSettingsJobExecution() {
  const context = useContext(SettingJobExecutionContext);
  return context;
}

export {
  SettingJobExecutionContext,
  SettingJobExecutionProvider,
  useSettingsJobExecution,
};
