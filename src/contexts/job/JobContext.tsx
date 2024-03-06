import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { apiLoja } from "../../services/axios";
import { IJob, JobsContextType } from "./interfaces";
import { useJobProcess } from "./hooks/useJobProcess";
import { useSettings } from "../settings/SettingsContext";

interface JobsProviderProps {
  children: ReactNode;
}

const JobsContext = createContext({} as JobsContextType);

function JobsProvider({ children }: JobsProviderProps) {
  const { connection } = useSettings();
  const { startJob } = useJobProcess();

  const [jobs, setJobs] = useState<IJob[]>([]);

  const [selectedDate, setSelectedDate] = useState<Date | unknown>(new Date());

    function updateSetJobs(newJobs: IJob[]) {
    setJobs(newJobs);
  }

  function handleSelectDate(date: Date | unknown) {
    console.log("entrou aqui", date);
    setSelectedDate(date);
  }

  const loadJobsByDateSelected = useCallback(async () => {
    if (selectedDate instanceof Date) {
      const date = selectedDate.toISOString().split("T")[0];
      const response = await apiLoja.get(`jobs?startTime=${date}`);
      setJobs(response.data);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadJobsByDateSelected();
  }, [loadJobsByDateSelected]);

  useEffect(() => {
    if (connection) {
      const checkLastApiJobsUserCallTime = async () => {
        const lastAPICallTime = JSON.parse(
          localStorage.getItem("lastAPICallTime:jobsUser")!
        );
        const currentTime = new Date().getTime();
        if (
          !lastAPICallTime ||
          currentTime - parseInt(lastAPICallTime) >= 60000
        ) {
          const callFlag = localStorage.getItem("callFlag:jobsUser");

          if (!callFlag || callFlag === "false") {
            await startJob();
            localStorage.setItem(
              "lastAPICallTime:jobsUser",
              currentTime.toString()
            );
            localStorage.setItem("callFlag:jobsUser", "true");
          } else {
            localStorage.setItem("callFlag:jobsUser", "false");
          }
        }
      };

      checkLastApiJobsUserCallTime();

      const interval = setInterval(checkLastApiJobsUserCallTime, 30000);

      return () => clearInterval(interval);
    }
  }, []);

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
