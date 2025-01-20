import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { apiLoja, apiRetaguarda } from "../../services/axios";
import { ITables, JobsContextType } from "./interfaces";
import { useJobProcess } from "./hooks/useJobProcess";
import { format } from "date-fns";
import { useErpToEntbipJobSync } from "./hooks/useErpToEntbipJobSync";
import { useSettings } from "../settings/SettingsContext";
import { useSettingsJobExecution } from "../settingJobExecution/SettingJobExecutionContext";

interface JobsProviderProps {
  children: ReactNode;
}

const JobsContext = createContext({} as JobsContextType);

function JobsProvider({ children }: JobsProviderProps) {
  const { jobs, startJob, updateSetJobs } = useJobProcess();
  const { jobsErp, startJobToTransferFileFromErptoEntbip } =
    useErpToEntbipJobSync();
    const { checked } = useSettingsJobExecution();
  const { connection } = useSettings();

  const [selectedDate, setSelectedDate] = useState<Date | unknown>(new Date());

  const [arrayAllActiveTables, setAllActiveTablesStore] = useState<ITables[]>(
    []
  );
  const [arrayActiveTablesStore, setArrayActiveTablesStore] = useState<
    ITables[]
  >([]);

  const [arrayActiveTablesRemote, setArrayActiveTablesRemote] = useState<
    ITables[]
  >([]);

  function handleSelectDate(date: Date | unknown) {
    setSelectedDate(date);
  }

  const loadJobsByDateSelected = useCallback(async () => {
    if (selectedDate instanceof Date) {
      const date = format(selectedDate, "yyyy-MM-dd");
      const url = `jobs?startTime=${date}`;
      const response = await apiLoja.get(url);
      if (JSON.stringify(jobs) !== JSON.stringify(response.data)) {
        updateSetJobs(response.data);
      }
    }
  }, [selectedDate, jobs, updateSetJobs]);

  useEffect(() => {
    loadJobsByDateSelected();
  }, [loadJobsByDateSelected]);

  async function getAllActiveTables() {
    const queryPams = {
      status: 1,
    };

    const response = await apiRetaguarda.get("all-active-tables", {
      params: queryPams,
    });
    if (Array.isArray(response.data)) {
      setAllActiveTablesStore(response.data);
    }
  }

  async function getActiveTablesStore() {
    const queryPams = {
      status: 1,
      type: "LOJA",
    };
    const response = await apiRetaguarda.get("active-store-tables", {
      params: queryPams,
    });

    if (Array.isArray(response.data)) {
      setArrayActiveTablesStore(response.data);
    }
  }

  async function getActiveTablesRemote() {
    const queryPams = {
      status: 1,
      type: "RETAGUARDA",
    };
    const response = await apiLoja.get("active-store-tables", {
      params: queryPams,
    });

    if (Array.isArray(response.data)) {
      setArrayActiveTablesRemote(response.data);
    }
  }

  useEffect(() => {
    getActiveTablesStore();
    getActiveTablesRemote();
    getAllActiveTables();
  }, []);

    const handleJobExecution = useCallback(async () => {
      const storeCode = localStorage.getItem("storeCode:local")!;
    
      // Executa um job de cada vez para tabelas locais
      for (const item of arrayActiveTablesStore) {
        const queryTable = {
          table: item.tableName,
          storeCode: storeCode,
        };
        console.log("Iniciando job para tabela local:", queryTable);
    
        // Aqui o código aguarda o início do job antes de passar para o próximo
        await startJob(queryTable);
      }
    
      // Executa um job de cada vez para tabelas remotas
      for (const item of arrayActiveTablesRemote) {
        const queryTable = {
          table: item.tableName,
          storeCode: storeCode,
        };
        console.log("Iniciando job para tabela remota:", queryTable);
    
        // Aguarda o início do job antes de passar para o próximo
        await startJobToTransferFileFromErptoEntbip(queryTable);
      }
    }, [arrayActiveTablesStore, arrayActiveTablesRemote, startJob, startJobToTransferFileFromErptoEntbip]);

  useEffect(() => {
    // Conectar ao WebSocket do servidor na porta 3335
    const socket = new WebSocket("ws://localhost:3004");

    // Quando a conexão for aberta
    socket.onopen = () => {
      console.log("Conectado ao servidor WebSocket");
    };

    // Quando uma mensagem for recebida
    socket.onmessage = (event) => {
      console.log("Mensagem recebida:", event.data);

      // Verificar se a mensagem é "ExecutarJob"
      if (event.data === "ExecutarJobs") {
        if (connection && checked) {
          handleJobExecution();
          console.log("Comando para executar os jobs recebido");
        }
      
        // Aqui você pode chamar a função que executa os jobs
      }
    };

    // Quando ocorrer um erro
    socket.onerror = (error) => {
      console.log("Erro no WebSocket:", error);
    };

    // Quando a conexão for fechada
    socket.onclose = () => {
      console.log("Conexão WebSocket fechada");
    };

    // Retornar a função de limpeza para fechar o WebSocket quando o componente for desmontado
    return () => {
      socket.close();
    };
  }, [handleJobExecution]);

  // Função para iniciar os jobs

  return (
    <JobsContext.Provider
      value={{
        jobs,
        jobsErp,
        arrayAllActiveTables,
        selectedDate,
        handleSelectDate,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
}

function useJob() {
  const context = useContext(JobsContext);
  return context;
}

export { JobsProvider, JobsContext, useJob };
