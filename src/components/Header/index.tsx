import { ContainerButtons, Button, Container, Content, Logo } from "./styles";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();

  function handleSendToPageConfig() {
    navigate("/configurar-ambiente");
  }

  function handleSendToPageHome() {
    navigate("/");
  }

  return (
    <Container>
      <Content>
        <Logo onClick={handleSendToPageHome}>
          <img src={logo} alt="" />
        </Logo>
        <ContainerButtons>
          <Button onClick={handleSendToPageConfig}>Configurar Ambiente</Button>
        </ContainerButtons>
      </Content>
    </Container>
  );
}
