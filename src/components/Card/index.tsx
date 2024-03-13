import { Container, Content, Header, Info } from "./style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useJob } from "../../contexts/job/JobContext";

export function Card() {
  const { jobs, arrayAllActiveTables } = useJob();

  const numberOfJobsExecuted = jobs.length;
  const numberOfActiveTables = arrayAllActiveTables.length;

  const currentDate = format(new Date(), "d 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });

  return (
    <Container>
      <Content>
        <Header>
          <span>{currentDate}</span>
          <FontAwesomeIcon icon={faGear} color="#fff" />
        </Header>
        <Info>
          <p>{numberOfJobsExecuted} Jobs - executados</p>
          <p>{numberOfActiveTables} tabelas ativas</p>
        </Info>
      </Content>
    </Container>
  );
}
