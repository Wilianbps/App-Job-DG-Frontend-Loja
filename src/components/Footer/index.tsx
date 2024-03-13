import { ContainerFooter, ContentFooter } from "./styles";
import logo from "../../assets/logo.png";
import { useSettings } from "../../contexts/settings/SettingsContext";

export function Footer() {
  const { connection } = useSettings();
  const currentDate = new Date().getFullYear();
  return (
    <>
      {connection && (
        <ContainerFooter>
          <ContentFooter>
            <span>
              &copy; {currentDate} ConsultDG. Todos os direitos reservados.
            </span>
            <div className="logo">
              <span>Powered By</span>
              <img src={logo} width={100} alt="" />
            </div>
          </ContentFooter>
        </ContainerFooter>
      )}
    </>
  );
}
