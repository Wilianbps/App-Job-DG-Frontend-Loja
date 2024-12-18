import { createContext, useContext, useEffect, useState } from "react";
import {
  SettingJobExecutionContextType,
  SettingJobExecutionProviderProps,
} from "./interfaces";
import { apiLoja } from "../../services/axios";

const SettingJobExecutionContext = createContext(
  {} as SettingJobExecutionContextType
);

function SettingJobExecutionProvider({
  children,
}: SettingJobExecutionProviderProps) {
  const [checked, setChecked] = useState<boolean>(false);
  const [executionInterval, setExecutionInterval] = useState<string>("");
  const [loadingSaveSettingsJobExecution, setLoadingSaveSettingsJobExecution] =
    useState(false);

  function updateStateChecked(checkedSwitch: boolean) {
    setChecked(checkedSwitch);
  }

  function updateStateInterval(interval: string) {
    setExecutionInterval(interval);
  }

  async function getSettingJobExecution() {
    const response = await apiLoja.get("setting-job-execution");
    const formatChecked = response.data[0].status == 1 ? true : false;
    setChecked(formatChecked);
    setExecutionInterval(response.data[0].interval);
  }

  async function updateSettingsJobExecution() {

    setLoadingSaveSettingsJobExecution(true);
    localStorage.removeItem("elapsedTime:jobs");
    setTimeout(async () => {
      const settings = {
        status: checked == true ? 1 : 0!,
        interval: parseInt(executionInterval),
      };
      console.log(settings)
      const response = await apiLoja.put(`setting-job-execution`, settings);

      console.log("chegou aqui", response.data[0])

      setChecked(response.data[0].status! == 1 ? true : false);
      setExecutionInterval(response.data[0].interval);
      setLoadingSaveSettingsJobExecution(false);
    }, 1000);
  }

  useEffect(() => {
    getSettingJobExecution();
  }, []);

  return (
    <SettingJobExecutionContext.Provider
      value={{
        updateSettingsJobExecution,
        updateStateChecked,
        updateStateInterval,
        checked,
        executionInterval,
        loadingSaveSettingsJobExecution,
      }}
    >
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
