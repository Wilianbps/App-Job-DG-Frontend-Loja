import { ChangeEvent, useEffect, useState } from "react";
import { Card } from "../../components/Card";
import { DatePickerMUI } from "../../components/DatePickerMUI";
import { Header } from "../../components/Header";
import { InputMUI } from "../../components/InputMUI";
import { Job } from "./components/Job";
import { jobData } from "./jobData";

import {
  ContainerMain,
  ContainerSearch,
  ButtonSearch,
  ContainerJobsList,
  Title,
  ListJobs,
  Thead,
} from "./styles";
import { Box, CircularProgress } from "@mui/material";

interface IJob {
  name: string;
  startTime: string;
  table: string;
  action: string;
  status: string;
}

export function Dashboard() {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  function handleNewSearchChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setSearch(event.target.value);
  }

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      const filteredResults = jobData.filter((item) => {
        const name = item.name.toLowerCase().includes(search.toLowerCase());
        const table = item.table.toLowerCase().includes(search.toLowerCase());
        const status = item.status.toLowerCase().includes(search.toLowerCase());

        return name || table || status;
      });
      setJobs(filteredResults);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (!search) {
      setJobs(jobData);
    }
  }, [search]);

  return (
    <>
      <Header />
      <Card />
      <ContainerMain>
        <ContainerSearch>
          <DatePickerMUI />
          <InputMUI value={search} onChange={handleNewSearchChange} />
          <ButtonSearch type="submit" onClick={handleSearch} disabled={!search}>
            {loading ? (
              <Box
                sx={{
                  color: "#fff",
                }}
              >
                <CircularProgress color="inherit" size={30} />
              </Box>
            ) : (
              "Buscar"
            )}
          </ButtonSearch>
        </ContainerSearch>

        {
          
        }

        <ContainerJobsList>
          <Title>Jobs em execução</Title>
          <ListJobs>
            <Thead>
              <tr>
                <td></td>
                <td>nome</td>
                <td>Horário</td>
                <td>tabela</td>
                <td>ação</td>
                <td>status</td>
              </tr>
            </Thead>
            {jobs.map(
              (job) =>
                job.status == "em execução" && (
                  <Job
                    name={job.name}
                    startTime={job.startTime}
                    table={job.table}
                    action={job.action}
                    status={job.status}
                  />
                )
            )}
          </ListJobs>
        </ContainerJobsList>

        <ContainerJobsList>
          <Title>Jobs executados</Title>
          <ListJobs>
            <Thead>
              <tr>
                <td></td>
                <td>nome</td>
                <td>Horário</td>
                <td>tabela</td>
                <td>ação</td>
                <td>status</td>
              </tr>
            </Thead>
            {jobs.map(
              (job) =>
                job.status !== "em execução" && (
                  <Job
                    name={job.name}
                    startTime={job.startTime}
                    table={job.table}
                    action={job.action}
                    status={job.status}
                  />
                )
            )}
          </ListJobs>
        </ContainerJobsList>
      </ContainerMain>
    </>
  );
}
