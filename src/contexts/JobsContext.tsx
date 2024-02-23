import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { apiLoja, apiRetaguarda } from "../services/axios";

interface IJob {
  id: string;
  name: string;
  startTime: string;
  table: string;
  action: string;
  status: string;
}

interface JobsContextType {
  jobs: IJob[];
  selectedDate: Date | unknown;
  updateSetJobs: (newJobs: IJob[]) => void;
  handleSelectDate: (date: Date | unknown) => void;
}

interface JobsProviderProps {
  children: ReactNode;
}

export const JobsContext = createContext({} as JobsContextType);

export function JobsProvider({ children }: JobsProviderProps) {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | unknown>(new Date());

  const idJobActive = useRef("");

  function updateSetJobs(newJobs: IJob[]) {
    setJobs(newJobs);
  }

  function handleSelectDate(date: Date | unknown) {
    setSelectedDate(date);
  }

  const loadJobsByDateSelected = useCallback(async () => {
    if (selectedDate instanceof Date) {
      const date = selectedDate.toISOString().split("T")[0];
      const response = await apiLoja.get(`jobs?startTime=${date}`);
      setJobs(response.data);
    }
  }, [selectedDate]);

  const updateStatusJobUser = useCallback(async (status: number) => {
    const id = localStorage.getItem("jobId:user")!;
    const statusJob = status === 200 ? "processado" : "cancelado";

    const response = await apiLoja.put(`jobs/users/${id}?status=${statusJob}`);

    setJobs([...jobs, response.data]);

    localStorage.removeItem("jobId:user");
    idJobActive.current = "";
  }, [jobs]);

  const updateStatusOnStage = useCallback(
    async (dataUsers: []) => {
      await apiRetaguarda
        .post("users", dataUsers)
        .then((response) => {
          const status = response.status;

          updateStatusJobUser(status);
        })
        .catch((error) => {
          if (error.response) {
            const status = error.response.status;
            updateStatusJobUser(status);
          }
        });
    },
    [updateStatusJobUser]
  );

  const addUsersInTableStore = useCallback(
    async (dataUsers: []) => {
      await apiLoja
        .post("users", dataUsers)
        .then(() => {
          updateStatusOnStage(dataUsers);
        })
        .catch((error) => {
          if (error.response) {
            const status = error.response.status;
            updateStatusJobUser(status);
          }
        });
    },
    [updateStatusJobUser, updateStatusOnStage]
  );

  const searchUsersOnStage = useCallback(async () => {
    const fetchUsers = await apiRetaguarda.get("users", {
      params: { table: "USUARIO_DGCS", storeCode: "000008" },
    });

    if (fetchUsers.data.length > 0) {
      const users = fetchUsers.data;
      addUsersInTableStore(users);
    } else {
      updateStatusJobUser(200);
    }
  }, [updateStatusJobUser, addUsersInTableStore]);

  const newDate = new Date().toISOString();

  const startJobTableUser = useCallback(async () => {
    if (idJobActive.current) {
      return searchUsersOnStage();
    }

    const newJob = {
      name: "006",
      startTime: newDate,
      table: "USUARIO_DGCS",
      action: "",
      status: "em execução",
    };

    const response = await apiLoja.post("jobs/users", newJob);
    setJobs((state) => [...state, response.data]);

    idJobActive.current = response.data.id;

    localStorage.setItem("jobId:user", idJobActive.current);

    searchUsersOnStage();
  }, [idJobActive, newDate, searchUsersOnStage]);

/*     useEffect(() => {
    const interval = setInterval(async () => {
      await startJobTableUser();
    }, 30000);

    return () => clearInterval(interval);
  }, [startJobTableUser]); */

  useEffect(() => {
    loadJobsByDateSelected();
  }, [loadJobsByDateSelected]);

  return (
    <JobsContext.Provider
      value={{ jobs, updateSetJobs, selectedDate, handleSelectDate }}
    >
      {children}
    </JobsContext.Provider>
  );
}
