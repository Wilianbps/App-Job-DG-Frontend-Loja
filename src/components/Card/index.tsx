import { Container, Content, Header, Info } from "./style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

export function Card() {
  return (
    <Container>
      <Content>
        <Header>
          <span>16 de Janeiro de 2004</span>
          <FontAwesomeIcon icon={faGear} color='#fff' />
        </Header>
        <Info>
          <p>30 Jobs - executados</p>
          <p>06 Usuários inseridos</p>
        </Info>
      </Content>
    </Container>
  );
}
