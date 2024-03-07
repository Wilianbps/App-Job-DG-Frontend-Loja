import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { apiLoja, apiRetaguarda } from "../services/axios";
import axios from "axios";
import { useStartJob } from "./job/hooks/useStartJob";

interface IPropsDatabase {
  baseURL?: string;
  server: string;
  database: string;
  user: string;
  password: string;
}

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
  connection: boolean;
  formDataLocal: IPropsDatabase;
  formDataRemote: IPropsDatabase;
  loadingTestConnectionLocalEnvironment: boolean;
  loadingTestConnectionRemoteEnvironment: boolean;
  setJobs: React.Dispatch<React.SetStateAction<IJob[]>>;
  updateSetJobs: (newJobs: IJob[]) => void;
  handleSelectDate: (date: Date | unknown) => void;
  configDatabase: (data: IPropsDatabase, database: string) => void;

  updateStateSnackbarTestConnectionLocalEnvironment: (
    status: boolean,
    type: string,
    message: string
  ) => void;
  snackbarTestConnectionLocalEnvironment: {
    status: boolean;
    type: string;
    message: string;
  };

  snackbarTestConnectionRemoteEnvironment: {
    status: boolean;
    type: string;
    message: string;
  };
}

interface JobsProviderProps {
  children: ReactNode;
}

export const JobsContext = createContext({} as JobsContextType);

export function JobsProvider({ children }: JobsProviderProps) {
  const startJob = useStartJob();
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | unknown>(new Date());
  const [statusConnectionDatabaseLocal, setStatusConnectionDatabaseLocal] =
    useState(JSON.parse(localStorage.getItem("connectionDB:local")!));

  const [statusConnectionDatabaseRemote, setStatusConnectionDatabaseRemote] =
    useState(JSON.parse(localStorage.getItem("connectionDB:remote")!));

  /* const [connection, setConnection] = useState(
    statusConnectionDatabaseLocal && statusConnectionDatabaseRemote
  ); */

  const [formDataLocal, setFormDataLocal] = useState<IPropsDatabase>(
    {} as IPropsDatabase
  );

  const [formDataRemote, setFormDataRemote] = useState<IPropsDatabase>(
    {} as IPropsDatabase
  );

  //Loading Test Connection
  const [
    loadingTestConnectionLocalEnvironment,
    setLoadingTestConnectionLocalEnvironment,
  ] = useState(false);

  const [
    loadingTestConnectionRemoteEnvironment,
    setLoadingTestConnectionRemoteEnvironment,
  ] = useState(false);

  //Snackbar Test Connection
  const [
    snackbarTestConnectionLocalEnvironment,
    setSnackbarTestConnectionLocalEnvironment,
  ] = useState({ status: false, type: "", message: "" });

  const [
    snackbarTestConnectionRemoteEnvironment,
    setSnackbarTestConnectionRemoteEnvironment,
  ] = useState({ status: false, type: "", message: "" });

  const connection = useMemo(() => {
    return statusConnectionDatabaseLocal && statusConnectionDatabaseRemote;
  }, [statusConnectionDatabaseLocal, statusConnectionDatabaseRemote]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "connectionDB:local") {
        const newValue = event.newValue;
        if (newValue !== null) {
          setStatusConnectionDatabaseLocal(JSON.parse(newValue));
        }
      } else if (event.key === "connectionDB:remote") {
        const newValue = event.newValue;
        if (newValue !== null) {
          setStatusConnectionDatabaseRemote(JSON.parse(newValue));
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [statusConnectionDatabaseLocal, statusConnectionDatabaseRemote]);

  function updateStateSnackbarTestConnectionLocalEnvironment(
    status: boolean,
    type: string,
    message: string
  ) {
    setSnackbarTestConnectionLocalEnvironment({
      status,
      type,
      message,
    });

    setSnackbarTestConnectionRemoteEnvironment({
      status,
      type,
      message,
    });
  }

  async function testConnectionDatabase(database: string) {
    if (database === "local") {
      await apiLoja
        .get("test-connection-database")
        .then((response) => {
          if (response.status === 200) {
            localStorage.setItem("connectionDB:local", "true");

            setLoadingTestConnectionLocalEnvironment(false);
            setSnackbarTestConnectionLocalEnvironment({
              status: true,
              type: "success",
              message: response.data.message,
            });
          }
        })
        .catch((error) => {
          if (error.response) {
            localStorage.setItem("connectionDB:local", "false");

            setLoadingTestConnectionLocalEnvironment(false);
            setSnackbarTestConnectionLocalEnvironment({
              status: true,
              type: "error",
              message: error.response.data.message,
            });
          }
        });
    }

    if (database === "remote") {
      await apiRetaguarda
        .get("test-connection-database")
        .then((response) => {
          if (response.status === 200) {
            localStorage.setItem("connectionDB:remote", "true");

            setLoadingTestConnectionRemoteEnvironment(false);
            setSnackbarTestConnectionRemoteEnvironment({
              status: true,
              type: "success",
              message: response.data.message,
            });
          }
        })
        .catch((error) => {
          if (error.response) {
            localStorage.setItem("connectionDB:remote", "false");

            setLoadingTestConnectionRemoteEnvironment(false);
            setSnackbarTestConnectionRemoteEnvironment({
              status: true,
              type: "error",
              message: error.response.data.message,
            });
          }
        });
    }
  }

  async function configDatabase(data: IPropsDatabase, database: string) {
    if (database === "local") {
      setLoadingTestConnectionLocalEnvironment(true);
      await apiLoja.post("configuracao-conexao-db", data).then((response) => {
        if (response.status === 200) {
          testConnectionDatabase("local");
        }
      });
    }

    if (database === "remote") {
      setLoadingTestConnectionRemoteEnvironment(true);
      const baseURL = data.baseURL;
      localStorage.setItem("baseURL:local", baseURL!);

      const stringConnection = {
        server: data.server,
        database: data.database,
        user: data.user,
        password: data.password,
      };

      setLoadingTestConnectionRemoteEnvironment(true);

      await axios
        .post(`${baseURL}configuracao-conexao-db`, stringConnection)
        .then((response) => {
          if (response.status === 200) {
            testConnectionDatabase("remote");
          }
        })
        .catch(() => {
          localStorage.setItem("connectionDB:local", "false");
          setLoadingTestConnectionRemoteEnvironment(false);
          setSnackbarTestConnectionLocalEnvironment({
            status: true,
            type: "error",
            message: "URL do servidor de destino inválida!",
          });
        });
    }
  }

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

  const updateStatusJobUser = useCallback(
    async (status: number) => {
      const id = localStorage.getItem("jobId:user")!;
      const statusJob = status === 200 ? "processado" : "cancelado";

      const response = await apiLoja.put(
        `jobs/users/${id}?status=${statusJob}`
      );

      setJobs([...jobs, response.data]);

      localStorage.removeItem("jobId:user");
      idJobActive.current = "";
    },
    [jobs]
  );

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
      searchUsersOnStage();
    } else {
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
    }
  }, [idJobActive, newDate, searchUsersOnStage]);

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
            await startJobTableUser();
            localStorage.setItem(
              "lastAPICallTime:jobsUser",
              currentTime.toString()
            );
            localStorage.setItem("callFlag:jobsUser", "true");
          } else {
            localStorage.setItem("callFlag:jobsUser", "false");
          }
          // Se não houve chamada anterior ou se já passaram 5 minutos desde a última chamada
        }
      };

      checkLastApiJobsUserCallTime();

      const interval = setInterval(checkLastApiJobsUserCallTime, 30000);

      return () => clearInterval(interval);
    }
  }, [connection]); 

  async function getConfigEnvironmentLocal() {
    const response = await apiLoja.get("form-data-config");
    setFormDataLocal(response.data);
  }

  async function getConfigEnvironmentRemote() {
    const response = await apiRetaguarda.get("form-data-config");
    setFormDataRemote(response.data);
  }

  useEffect(() => {
    getConfigEnvironmentLocal();
    getConfigEnvironmentRemote();
  }, []);

  useEffect(() => {
    loadJobsByDateSelected();
  }, [loadJobsByDateSelected]);

  return (
    <JobsContext.Provider
      value={{
        jobs,
        setJobs,
        updateSetJobs,
        selectedDate,
        connection,
        handleSelectDate,
        configDatabase,
        formDataLocal,
        formDataRemote,
        loadingTestConnectionLocalEnvironment,
        loadingTestConnectionRemoteEnvironment,
        updateStateSnackbarTestConnectionLocalEnvironment,
        snackbarTestConnectionLocalEnvironment,
        snackbarTestConnectionRemoteEnvironment,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
}
