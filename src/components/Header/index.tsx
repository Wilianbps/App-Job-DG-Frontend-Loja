import { useState } from "react";

import { ContainerButtons, Button, Container, Content, Logo } from "./styles";
import logo from "../../assets/logo.png";
import { ModalMUI } from "../Modal";

export function Header() {
  const [openModalConfig, setOpenModalConfig] = useState(false);

  function handleClickOpenModalConfig() {
    setOpenModalConfig(true);
  }

  function handleCloseModalConfig() {
    setOpenModalConfig(false);
  }

  return (
    <Container>
      <Content>
        <Logo>
          <img src={logo} alt="" />
        </Logo>
        <ContainerButtons>
          <Button onClick={handleClickOpenModalConfig}>
            Configurar Ambiente
          </Button>
          <Button>Executar Jobs</Button>
        </ContainerButtons>
      </Content>

      <ModalMUI
        onHandleCloseModal={handleCloseModalConfig}
        openModal={openModalConfig}
      />
    </Container>
  );
}
