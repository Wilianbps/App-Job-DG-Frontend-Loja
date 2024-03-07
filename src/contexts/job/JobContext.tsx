import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { apiLoja } from "../../services/axios";
import { JobsContextType } from "./interfaces";
import { useJobProcess } from "./hooks/useJobProcess";
import { useSettings } from "../settings/SettingsContext";
import { differenceInSeconds, format } from "date-fns";

interface JobsProviderProps {
  children: ReactNode;
}

const JobsContext = createContext({} as JobsContextType);

function JobsProvider({ children }: JobsProviderProps) {
  const { connection } = useSettings();
  const { jobs, startJob, updateSetJobs } = useJobProcess();

  const [selectedDate, setSelectedDate] = useState<Date | unknown>(new Date());

  function handleSelectDate(date: Date | unknown) {
    setSelectedDate(date);
  }

  const loadJobsByDateSelected = useCallback(async () => {
    if (selectedDate instanceof Date) {
      const date = format(selectedDate, 'yyyy-MM-dd');
      const response = await apiLoja.get(`jobs?startTime=${date}`);

      console.log("data", response.data)
      if (JSON.stringify(jobs) !== JSON.stringify(response.data)) {
        updateSetJobs(response.data);
      }
    }
  }, [selectedDate, jobs, updateSetJobs]);

  useEffect(() => {
    loadJobsByDateSelected();
  }, [loadJobsByDateSelected]);

  useEffect(() => {
    if (connection) {
      const intervalId = setInterval(async () => {
        const elepsedTime = JSON.parse(
          localStorage.getItem("elapsedTime:jobs")!
        );

        console.log(elepsedTime);
        if (elepsedTime <= 29) {
          localStorage.setItem(
            "elapsedTime:jobs",
            (elepsedTime + 1).toString()
          );
        } else {
          localStorage.setItem("elapsedTime:jobs", "1");
        }

        if (elepsedTime == 30) {
          await startJob();
          clearInterval(intervalId);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [connection, startJob]);

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
