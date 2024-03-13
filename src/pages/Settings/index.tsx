import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Container,
  ContentLocalEnvironment,
  ContentRemoteEnvironment,
  ContentConfigJobExecution,
} from "./styles";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { Input } from "../../components/Input";
import { CircularProgress, FormControlLabel, Switch } from "@mui/material";
import { SnackbarMUI } from "../../components/AlertSnackbar";
import { useSettings } from "../../contexts/settings/SettingsContext";
import { useToast } from "../../contexts/toast/ToastContext";
import { useEffect } from "react";
import { useSettingsJobExecution } from "../../contexts/settingJobExecution/SettingJobExecutionContext";

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
    loadingTestConnectionLocalEnvironment,
    loadingTestConnectionRemoteEnvironment,
    toastTestConnectionLocalEnvironment,
    toastTestConnectionRemoteEnvironment,
    updateToastTestConnectionLocalEnvironment,
    updateToastTestConnectionRemoteEnvironment,
  } = useToast();

  const { configDatabase, formDataLocal, formDataRemote } = useSettings();

  const {
    updateSettingsJobExecution,
    updateStateChecked,
    updateStateInterval,
    checked,
    executionInterval,
    loadingSaveSettingsJobExecution,
  } = useSettingsJobExecution();

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

  function handleChangeSettingsJobExecution(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    updateSettingsJobExecution();
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
        {toastTestConnectionLocalEnvironment.status === true &&
          toastTestConnectionLocalEnvironment.type === "success" && (
            <SnackbarMUI
              onUpdateStateToastTestConnection={
                updateToastTestConnectionLocalEnvironment
              }
              openSnackbar={toastTestConnectionLocalEnvironment.status}
              status="success"
              message={toastTestConnectionLocalEnvironment.message}
            />
          )}

        {toastTestConnectionLocalEnvironment.status === true &&
          toastTestConnectionLocalEnvironment.type === "error" && (
            <SnackbarMUI
              onUpdateStateToastTestConnection={
                updateToastTestConnectionLocalEnvironment
              }
              openSnackbar={toastTestConnectionLocalEnvironment.status}
              status="error"
              message={toastTestConnectionLocalEnvironment.message}
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

        {toastTestConnectionRemoteEnvironment.status === true &&
          toastTestConnectionRemoteEnvironment.type === "success" && (
            <SnackbarMUI
              onUpdateStateToastTestConnection={
                updateToastTestConnectionRemoteEnvironment
              }
              openSnackbar={toastTestConnectionRemoteEnvironment.status}
              status="success"
              message={toastTestConnectionRemoteEnvironment.message}
            />
          )}

        {toastTestConnectionRemoteEnvironment.status === true &&
          toastTestConnectionRemoteEnvironment.type === "error" && (
            <SnackbarMUI
              onUpdateStateToastTestConnection={
                updateToastTestConnectionRemoteEnvironment
              }
              openSnackbar={toastTestConnectionRemoteEnvironment.status}
              status="error"
              message={toastTestConnectionRemoteEnvironment.message}
            />
          )}
      </ContentRemoteEnvironment>

      <ContentConfigJobExecution>
        <h3>Configuração da Execução dos jobs</h3>

        <form onSubmit={handleChangeSettingsJobExecution}>
          <div>
            <FormControlLabel
              control={
                <Switch
                  checked={checked}
                  onChange={(event) => updateStateChecked(event.target.checked)}
                />
              }
              label="Ativar ou desativar execução do job"
            />
          </div>
          <div className="job-execution-time">
            <span>Tempo de execução do job: </span>
            <input
              type="number"
              min={1}
              max={15}
              required
              value={executionInterval || ""}
              onChange={(event) => updateStateInterval(event.target.value)}
            />
          </div>

          {loadingSaveSettingsJobExecution ? (
            <Button type="submit">
              <CircularProgress color="inherit" size={30} />
            </Button>
          ) : (
            <Button type="submit">Salvar</Button>
          )}
        </form>
      </ContentConfigJobExecution>
    </Container>
  );
}
