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
import { useSettings } from "../settings/SettingsContext";
import { format } from "date-fns";
import { useSettingsJobExecution } from "../settingJobExecution/SettingJobExecutionContext";
import { useErpToEntbipJobSync } from "./hooks/useErpToEntbipJobSync";

interface JobsProviderProps {
  children: ReactNode;
}

const JobsContext = createContext({} as JobsContextType);

function JobsProvider({ children }: JobsProviderProps) {
  const { connection } = useSettings();
  const { jobs, startJob, updateSetJobs } = useJobProcess();
  const { jobsErp, startJobToTransferFileFromErptoEntbip } =
    useErpToEntbipJobSync();
  const { checked, executionInterval } = useSettingsJobExecution();

  const [selectedDate, setSelectedDate] = useState<Date | unknown>(new Date());
  const [isIntervalStartJobs, setIsIntervalStartJobs] = useState(false);
  const [arrayAllActiveTables, setAllActiveTablesStore] = useState<ITables[]>(
    []
  );
  const [arrayActiveTablesStore, setArrayActiveTablesStore] = useState<
    ITables[]
  >([]);

  const [arrayActiveTablesRemote, setArrayActiveTablesRemote] = useState<
    ITables[]
  >([]);

  const interval: number = parseInt(executionInterval) * 60;

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

  useEffect(() => {
    if (connection && checked) {
      const intervalId = setInterval(async () => {
        const elepsedTime = JSON.parse(
          localStorage.getItem("elapsedTime:jobs")!
        );
        if (elepsedTime >= 2) {
          localStorage.setItem(
            "elapsedTime:jobs",
            (elepsedTime - 1).toString()
          );
        } else {
          localStorage.setItem("elapsedTime:jobs", interval.toString());
        }

        if (elepsedTime == 1) {
          setIsIntervalStartJobs(true);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [connection, checked, interval]);

 /*  useEffect(() => {
    const storeCode = localStorage.getItem("storeCode:local")!;
    function cycleToStartJobs() {
      if (isIntervalStartJobs) {
        arrayActiveTablesStore.forEach(async (item: ITables) => {
          const queryTable = {
            table: item.tableName,
            storeCode: storeCode,
          };
          await startJob(queryTable);
        });

     arrayActiveTablesRemote.forEach(async (item: ITables) => {
          const queryTable = {
            table: item.tableName,
            storeCode: storeCode,
          };

          await startJobToTransferFileFromErptoEntbip(queryTable);
        });

        setIsIntervalStartJobs(false);
      }
    }
    cycleToStartJobs();
  }, [
    isIntervalStartJobs,
    arrayActiveTablesStore,
    arrayActiveTablesRemote,
    startJob,
    startJobToTransferFileFromErptoEntbip,
  ]); */


  useEffect(() => {
    const storeCode = localStorage.getItem("storeCode:local")!;
  
    async function cycleToStartJobs() {
      if (isIntervalStartJobs) {
        const startStoreJobs = arrayActiveTablesStore.map((item: ITables) => {
          const queryTable = {
            table: item.tableName,
            storeCode: storeCode,
          };
          return startJob(queryTable);
        });
  
        const startRemoteJobs = arrayActiveTablesRemote.map((item: ITables) => {
          const queryTable = {
            table: item.tableName,
            storeCode: storeCode,
          };
          return startJobToTransferFileFromErptoEntbip(queryTable);
        });
  
        // Esperar todos os jobs serem processados antes de finalizar
        await Promise.all([...startStoreJobs, ...startRemoteJobs]);
  
        setIsIntervalStartJobs(false);
      }
    }
  
    cycleToStartJobs();
  }, [isIntervalStartJobs, arrayActiveTablesStore, arrayActiveTablesRemote, startJob, startJobToTransferFileFromErptoEntbip]);
  

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
