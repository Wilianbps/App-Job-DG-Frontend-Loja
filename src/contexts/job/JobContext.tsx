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

interface JobsProviderProps {
  children: ReactNode;
}

const JobsContext = createContext({} as JobsContextType);

function JobsProvider({ children }: JobsProviderProps) {
  const { connection } = useSettings();
  const { jobs, startJob, updateSetJobs } = useJobProcess();
  const { checked, executionInterval } = useSettingsJobExecution();

  const [selectedDate, setSelectedDate] = useState<Date | unknown>(new Date());
  const [isIntervalStartJobs, setIsIntervalStartJobs] = useState(false);
  const [arrayAllActiveTables, setAllActiveTablesStore] = useState<ITables[]>(
    []
  );
  const [arrayActiveTablesStore, setActiveTablesStore] = useState<ITables[]>(
    []
  );

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
      setActiveTablesStore(response.data);
    }
  }

  useEffect(() => {
    getActiveTablesStore();
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

  useEffect(() => {
    function cycleToStartJobs() {
      if (isIntervalStartJobs) {
        arrayActiveTablesStore.forEach((item: ITables) => {
          const queryTable = {
            table: item.tableName,
            storeCode: "000008",
          };
          startJob(queryTable);
        });

        setIsIntervalStartJobs(false);
      }
    }
    cycleToStartJobs();
  }, [isIntervalStartJobs, arrayActiveTablesStore, startJob]);

  return (
    <JobsContext.Provider
      value={{
        jobs,
        updateSetJobs,
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
