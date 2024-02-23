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

const localEnvironmentConfigurationFormSchema = zod.object({
  server: zod.string().min(8, "Informe o servidor sql"),
  database: zod.string().min(8, "Informe o banco de dados"),
  user: zod.string().min(3, "Informe o usuário do banco de dados"),
  password: zod.string().min(1, "Informe a senha do banco de dados"),
});

const remoteEnvironmentConfigurationFormSchema = zod.object({
  server: zod.string().min(8, "Informe o servidor sql"),
  serverDatabase: zod.string().min(8, "Informe o servidor sql"),
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
  } = localEnvironmentConfigurationForm;

  const {
    handleSubmit: handleSubmitRemoteEnvironment,
    register: registerRemoteEnvironment,
    formState: formStateRemoteEnvironment,
  } = remoteEnvironmentConfigurationForm;

  const { errors: errorLocalEnvironment } = formStateLocalEnvironment;

  const { errors: errorRemoteEnvironment } = formStateRemoteEnvironment;

  function handleSubmitFormLocalEnvironment(
    data: localEnvironmentConfigurationFormProps
  ) {
    console.log("formLocal", data);
  }

  function handleSubmitFormRemoteEnvironment(
    data: remoteEnvironmentConfigurationFormProps
  ) {
    console.log("formRemoto", data);
  }

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
            type="text"
            className="password"
            {...registerLocalEnvironment("password")}
            error={errorLocalEnvironment.password?.message}
          />
          <Button type="submit">Testar</Button>
        </form>
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
            className="server"
            {...registerRemoteEnvironment("server")}
            error={errorRemoteEnvironment.server?.message}
          />
          <Input
            placeholder="Nome do Servidor do Banco de Dados"
            type="text"
            className="serverDatabase"
            {...registerRemoteEnvironment("serverDatabase")}
            error={errorRemoteEnvironment.serverDatabase?.message}
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
            type="text"
            className="password"
            {...registerRemoteEnvironment("password")}
            error={errorRemoteEnvironment.password?.message}
          />
          <Button type="submit">Testar</Button>
        </form>
      </ContentRemoteEnvironment>
    </Container>
  );
}
