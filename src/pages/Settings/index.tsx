import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Container,
  ContentLocalEnvironment,
  ContentRemoteEnvironment,
} from "./styles";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { Input } from "../../components/Input";
import { useContext, useEffect } from "react";
import { JobsContext } from "../../contexts/JobsContext";
import { CircularProgress } from "@mui/material";
import { SnackbarMUI } from "../../components/AlertSnackbar";

const localEnvironmentConfigurationFormSchema = zod.object({
  server: zod.string().min(8, "Informe o servidor sql"),
  database: zod.string().min(8, "Informe o banco de dados"),
  user: zod.string().min(3, "Informe o usuário do banco de dados"),
  password: zod.string().min(1, "Informe a senha do banco de dados"),
});

const remoteEnvironmentConfigurationFormSchema = zod.object({
  baseURL: zod.string().min(8, "Informe o servidor da retaguarda"),
  server: zod.string().min(8, "Informe o servidor sql"),
  database: zod.string().min(8, "Informe o banco de dados"),
  user: zod.string().min(3, "Informe o usuário do banco de dados"),
  password: zod.string().min(1, "Informe a senha do banco de dados"),
});

export type localEnvironmentConfigurationFormProps = zod.infer<
  typeof localEnvironmentConfigurationFormSchema
>;

export type remoteEnvironmentConfigurationFormProps = zod.infer<
  typeof remoteEnvironmentConfigurationFormSchema
>;

export function Settings() {
  const {
    configDatabase,
    formDataLocal,
    formDataRemote,
    loadingTestConnectionLocalEnvironment,
    loadingTestConnectionRemoteEnvironment,
    snackbarTestConnectionLocalEnvironment,
    snackbarTestConnectionRemoteEnvironment,
    updateStateSnackbarTestConnectionLocalEnvironment,
  } = useContext(JobsContext);

  const localEnvironmentConfigurationForm =
    useForm<localEnvironmentConfigurationFormProps>({
      resolver: zodResolver(localEnvironmentConfigurationFormSchema),
    });

  const remoteEnvironmentConfigurationForm =
    useForm<remoteEnvironmentConfigurationFormProps>({
      resolver: zodResolver(remoteEnvironmentConfigurationFormSchema),
    });

  const {
    handleSubmit: handleSubmitLocalEnvironment,
    register: registerLocalEnvironment,
    formState: formStateLocalEnvironment,
    setValue: setValueLocalEnvironment,
  } = localEnvironmentConfigurationForm;

  const {
    handleSubmit: handleSubmitRemoteEnvironment,
    register: registerRemoteEnvironment,
    formState: formStateRemoteEnvironment,
    setValue: setValueRemoteEnvironment,
  } = remoteEnvironmentConfigurationForm;

  const { errors: errorLocalEnvironment } = formStateLocalEnvironment;

  const { errors: errorRemoteEnvironment } = formStateRemoteEnvironment;

  function handleSubmitFormLocalEnvironment(
    data: localEnvironmentConfigurationFormProps
  ) {
    configDatabase(data, "local");
  }

  function handleSubmitFormRemoteEnvironment(
    data: remoteEnvironmentConfigurationFormProps
  ) {
    configDatabase(data, "remote");
  }

  useEffect(() => {
    setValueLocalEnvironment("server", formDataLocal.server);
    setValueLocalEnvironment("database", formDataLocal.database);
    setValueLocalEnvironment("user", formDataLocal.user);
    setValueLocalEnvironment("password", formDataLocal.password);
  }, [setValueLocalEnvironment, formDataLocal]);

  useEffect(() => {
    const baseURLRemote = localStorage.getItem("baseURL:local")!;
    setValueRemoteEnvironment("baseURL", baseURLRemote);
    setValueRemoteEnvironment("server", formDataRemote.server);
    setValueRemoteEnvironment("database", formDataRemote.database);
    setValueRemoteEnvironment("user", formDataRemote.user);
    setValueRemoteEnvironment("password", formDataRemote.password);
  }, [setValueRemoteEnvironment, formDataRemote]);

  return (
    <Container>
      <ContentLocalEnvironment>
        <h3>Configuração do Ambiente Local</h3>
        <form
          onSubmit={handleSubmitLocalEnvironment(
            handleSubmitFormLocalEnvironment
          )}
        >
          <Input
            placeholder="Nome do Servidor do Banco de Dados"
            type="text"
            className="server"
            {...registerLocalEnvironment("server")}
            error={errorLocalEnvironment.server?.message}
          />
          <Input
            placeholder="Nome do Banco de Dados"
            type="text"
            className="database"
            {...registerLocalEnvironment("database")}
            error={errorLocalEnvironment.database?.message}
          />
          <Input
            placeholder="Nome do Usuário"
            type="text"
            className="user"
            {...registerLocalEnvironment("user")}
            error={errorLocalEnvironment.user?.message}
          />
          <Input
            placeholder="Senha do Banco de Dados"
            type="password"
            className="password"
            {...registerLocalEnvironment("password")}
            error={errorLocalEnvironment.password?.message}
          />

          {loadingTestConnectionLocalEnvironment ? (
            <Button type="submit">
              <CircularProgress color="inherit" size={30} />
            </Button>
          ) : (
            <Button type="submit">Testar Conexão</Button>
          )}
        </form>
        {snackbarTestConnectionLocalEnvironment.status === true &&
        snackbarTestConnectionLocalEnvironment.type === "success" &&
        (
          <SnackbarMUI
            onUpdateStateSnackbarTestConnectionLocalEnvironment={
              updateStateSnackbarTestConnectionLocalEnvironment
            }
            openSnackbar={snackbarTestConnectionLocalEnvironment.status}
            status="success"
            message={snackbarTestConnectionLocalEnvironment.message}
          />
        )}

      {snackbarTestConnectionLocalEnvironment.status === true &&
        snackbarTestConnectionLocalEnvironment.type === "error" &&
         (
          <SnackbarMUI
            onUpdateStateSnackbarTestConnectionLocalEnvironment={
              updateStateSnackbarTestConnectionLocalEnvironment
            }
            openSnackbar={snackbarTestConnectionLocalEnvironment.status}
            status="error"
            message={snackbarTestConnectionLocalEnvironment.message}
          />
        )}
      </ContentLocalEnvironment>

      <ContentRemoteEnvironment>
        <h3>Configuração do Ambiente Remoto</h3>
        <form
          onSubmit={handleSubmitRemoteEnvironment(
            handleSubmitFormRemoteEnvironment
          )}
        >
          <Input
            placeholder="Nome do Servidor de Destino"
            type="text"
            className="baseURL"
            {...registerRemoteEnvironment("baseURL")}
            error={errorRemoteEnvironment.baseURL?.message}
          />
          <Input
            placeholder="Nome do Servidor do Banco de Dados"
            type="text"
            className="server"
            {...registerRemoteEnvironment("server")}
            error={errorRemoteEnvironment.server?.message}
          />
          <Input
            placeholder="Nome do Banco de Dados"
            type="text"
            className="database"
            {...registerRemoteEnvironment("database")}
            error={errorRemoteEnvironment.database?.message}
          />
          <Input
            placeholder="Nome do Usuário"
            type="text"
            className="user"
            {...registerRemoteEnvironment("user")}
            error={errorRemoteEnvironment.user?.message}
          />
          <Input
            placeholder="Senha do Banco de Dados"
            type="password"
            className="password"
            {...registerRemoteEnvironment("password")}
            error={errorRemoteEnvironment.password?.message}
          />
          {loadingTestConnectionRemoteEnvironment ? (
            <Button type="submit">
              <CircularProgress color="inherit" size={30} />
            </Button>
          ) : (
            <Button type="submit">Testar Conexão</Button>
          )}
        </form>

        {snackbarTestConnectionRemoteEnvironment.status === true &&
        snackbarTestConnectionRemoteEnvironment.type === "success" &&
        (
          <SnackbarMUI
            onUpdateStateSnackbarTestConnectionLocalEnvironment={
              updateStateSnackbarTestConnectionLocalEnvironment
            }
            openSnackbar={snackbarTestConnectionRemoteEnvironment.status}
            status="success"
            message={snackbarTestConnectionRemoteEnvironment.message}
          />
        )}

      {snackbarTestConnectionRemoteEnvironment.status === true &&
        snackbarTestConnectionRemoteEnvironment.type === "error" &&
         (
          <SnackbarMUI
            onUpdateStateSnackbarTestConnectionLocalEnvironment={
              updateStateSnackbarTestConnectionLocalEnvironment
            }
            openSnackbar={snackbarTestConnectionRemoteEnvironment.status}
            status="error"
            message={snackbarTestConnectionRemoteEnvironment.message}
          />
        )}
      </ContentRemoteEnvironment>

      
    </Container>
  );
}
