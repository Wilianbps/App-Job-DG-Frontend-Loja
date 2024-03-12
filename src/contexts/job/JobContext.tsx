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

interface JobsProviderProps {
  children: ReactNode;
}

const JobsContext = createContext({} as JobsContextType);

function JobsProvider({ children }: JobsProviderProps) {
  const { connection } = useSettings();
  const { jobs, startJob, updateSetJobs } = useJobProcess();

  const [selectedDate, setSelectedDate] = useState<Date | unknown>(new Date());
  const [isIntervalStartJobs, setIsIntervalStartJobs] = useState(false);
  const [arrayTables, setArrayTables] = useState<ITables[]>([]);

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

  async function getActiveTables() {
    const queryPams = {
      status: 1,
      type: "LOJA",
    };
    const response = await apiRetaguarda.get("active-store-tables", {
      params: queryPams,
    });

    setArrayTables(response.data);
  }

  useEffect(() => {
    getActiveTables();
  }, []);

  useEffect(() => {
    if (connection) {
      const intervalId = setInterval(async () => {
        const elepsedTime = JSON.parse(
          localStorage.getItem("elapsedTime:jobs")!
        );
        /*      console.log(elepsedTime); */
        if (elepsedTime <= 29) {
          localStorage.setItem(
            "elapsedTime:jobs",
            (elepsedTime + 1).toString()
          );
        } else {
          localStorage.setItem("elapsedTime:jobs", "1");
        }

        if (elepsedTime == 30) {
          setIsIntervalStartJobs(true);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [connection, startJob, arrayTables]);

  useEffect(() => {
    function cycleToStartJobs() {
      if (isIntervalStartJobs) {
        arrayTables.forEach((item: ITables) => {
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
  }, [isIntervalStartJobs, arrayTables, startJob]);

  return (
    <JobsContext.Provider
      value={{
        jobs,
        updateSetJobs,
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
