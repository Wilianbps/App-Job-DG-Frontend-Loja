import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  SettingsProviderProps,
  SettingsContextType,
  IPropsDatabase,
} from "./interfaces";
import { useToast } from "../toast/ToastContext";
import { apiLoja, apiRetaguarda } from "../../services/axios";
import axios from "axios";

const SettingsContext = createContext({} as SettingsContextType);

function SettingProvider({ children }: SettingsProviderProps) {
  const {
    updateLoadingTestConnectionLocalEnvironment,
    updateLoadingTestConnectionRemoteEnvironment,
    updateToastTestConnectionLocalEnvironment,
    updateToastTestConnectionRemoteEnvironment,
  } = useToast();

  const [statusConnectionDatabaseLocal, setStatusConnectionDatabaseLocal] =
    useState(JSON.parse(localStorage.getItem("connectionDB:local")!));

  const [statusConnectionDatabaseRemote, setStatusConnectionDatabaseRemote] =
    useState(JSON.parse(localStorage.getItem("connectionDB:remote")!));

  const connection = useMemo(() => {
    return statusConnectionDatabaseLocal && statusConnectionDatabaseRemote;
  }, [statusConnectionDatabaseLocal, statusConnectionDatabaseRemote]);

  //State Forms
  const [formDataLocal, setFormDataLocal] = useState<IPropsDatabase>(
    {} as IPropsDatabase
  );

  const [formDataRemote, setFormDataRemote] = useState<IPropsDatabase>(
    {} as IPropsDatabase
  );

  async function testConnectionDatabase(database: string) {
    if (database === "local") {
      await apiLoja
        .get("test-connection-database")
        .then((response) => {
          if (response.status === 200) {
            localStorage.setItem("connectionDB:local", "true");

            updateLoadingTestConnectionLocalEnvironment(false);
            updateToastTestConnectionLocalEnvironment(
              true,
              "success",
              response.data.message
            );

          }
        })
        .catch((error) => {
          if (error.response) {
            localStorage.setItem("connectionDB:local", "false");

            updateLoadingTestConnectionLocalEnvironment(false);
            updateToastTestConnectionLocalEnvironment(
              true,
              "error",
              error.response.data.message
            );
          }
        });
    }

    if (database === "remote") {
      const baseURL = localStorage.getItem("baseURL:local")!;
      

      await axios
        .get(`${baseURL}test-connection-database`)
        .then((response) => {
          if (response.status === 200) {
            localStorage.setItem("connectionDB:remote", "true");

            updateLoadingTestConnectionRemoteEnvironment(false);
            updateToastTestConnectionRemoteEnvironment(
              true,
              "success",
              response.data.message
            );

          }
        })
        .catch((error) => {
          if (error.response) {
            localStorage.setItem("connectionDB:remote", "false");

            updateLoadingTestConnectionRemoteEnvironment(false);
            updateToastTestConnectionRemoteEnvironment(
              true,
              "error",
              error.response.data.message
            );
          }
        });
    }
  }

  async function configDatabase(data: IPropsDatabase, database: string) {
    if (database === "local") {
      updateLoadingTestConnectionLocalEnvironment(true);
      await apiLoja.post("configuracao-conexao-db", data).then((response) => {
        if (response.status === 200) {
          testConnectionDatabase("local");
        }
      });
    }

    if (database === "remote") {
      updateLoadingTestConnectionRemoteEnvironment(true);
      const baseURL = data.baseURL;
      localStorage.setItem("baseURL:local", baseURL!);

      const stringConnection = {
        server: data.server,
        database: data.database,
        user: data.user,
        password: data.password,
      };

      updateLoadingTestConnectionRemoteEnvironment(true);

      await axios
        .post(`${baseURL}configuracao-conexao-db`, stringConnection)
        .then((response) => {
          if (response.status === 200) {
            testConnectionDatabase("remote");
          }
        })
        .catch(() => {
          localStorage.setItem("connectionDB:local", "false");
          updateLoadingTestConnectionRemoteEnvironment(false);
          updateToastTestConnectionRemoteEnvironment(
            true,
            "error",
            "URL do servidor de destino inválida!"
          );
        });
    }
  }

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

  return (
    <SettingsContext.Provider
      value={{
        connection,
        formDataLocal,
        formDataRemote,
        configDatabase,
        statusConnectionDatabaseLocal,
        statusConnectionDatabaseRemote,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

function useSettings() {
  const context = useContext(SettingsContext);
  return context;
}

export { SettingsContext, SettingProvider, useSettings };
