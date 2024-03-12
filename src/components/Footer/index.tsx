import { ContainerFooter, ContentFooter } from "./styles";
import logo from "../../assets/logo.png";

export function Footer() {
  const currentDate = new Date().getFullYear();
  return (
    <ContainerFooter>
      <ContentFooter>
        <span>
          &copy; {currentDate} ConsultDG. Todos os direitos reservados.
        </span>
        <div className="logo">
          <span>Power By</span>
          <img src={logo} width={100} alt="" />
        </div>
      </ContentFooter>
    </ContainerFooter>
  );
}
