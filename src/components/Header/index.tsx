import { Button, Container, Content, Logo } from "./styles";
import logo from "../../assets/logo.png";

export function Header() {
  return (
    <Container>
      <Content>
        <Logo>
          <img src={logo} alt="" />
        </Logo>
        <Button>Executar Job</Button>
      </Content>
    </Container>
  );
}
