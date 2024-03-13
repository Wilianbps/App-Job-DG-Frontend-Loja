import { Container } from "./styles";

export function Warning() {
  return (
    <Container>
      <p>
        Erro:{" "}
        <span>
          Favor verificar na página de configurações clicando no botão
          Configurar Ambiente, a disponibilidade do Banco de Dados Local ou
          Remoto
        </span>
      </p>
    </Container>
  );
}
