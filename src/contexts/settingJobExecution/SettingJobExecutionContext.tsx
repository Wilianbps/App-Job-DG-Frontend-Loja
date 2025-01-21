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

  async function checkJobsInExecution() {
    try {
      await apiLoja.put("check-job-in-execution");
    } catch (error) {
      console.log(error);
    }
  }

  async function getSettingJobExecution() {
    const response = await apiLoja.get("setting-job-execution");
    const formatChecked = response.data[0].status == 1 ? true : false;
    setChecked(formatChecked);
    setExecutionInterval(response.data[0].interval);
  }

  async function updateSettingsJobExecution() {
    setLoadingSaveSettingsJobExecution(true); // Ativa o loading

    setTimeout(async () => {
      try {
        const settings = {
          status: checked === true ? 1 : 0, // Ajusta o status com base no `checked`
          interval: parseInt(executionInterval), // Converte o intervalo para número
        };

        // Faz a requisição para o backend
        const response = await apiLoja.put(`setting-job-execution`, settings);

        // Atualiza os estados com os dados retornados
        setChecked(response.data[0].status === 1);
        setExecutionInterval(response.data[0].interval);
      } catch (error) {
        console.error("Erro ao atualizar configurações do job:", error);
      } finally {
        // Certifique-se de desativar o loading, independentemente do sucesso ou erro
        setLoadingSaveSettingsJobExecution(false);
      }
    }, 1000); // Adiciona o atraso de 1 segundo
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
        checkJobsInExecution,
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
