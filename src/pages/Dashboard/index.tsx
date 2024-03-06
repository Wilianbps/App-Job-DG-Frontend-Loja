import { ChangeEvent, useEffect, useState } from "react";
import { Card } from "../../components/Card";
import { DatePickerMUI } from "../../components/DatePickerMUI";
import { InputMUI } from "../../components/InputMUI";
import { Job } from "./components/Job";

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
import { getHourFromISODate } from "../../libs/getHourFromISODate";
import { useJob } from "../../contexts/job/JobContext";
import { useSettings } from "../../contexts/settings/SettingsContext";

interface IJob {
  id: string;
  name: string;
  startTime: string;
  table: string;
  action: string;
  status: string;
}

export function Dashboard() {
  const { connection } = useSettings();
  const { jobs, selectedDate, handleSelectDate } = useJob();

  const [filteredJobs, setFilteredJobs] = useState<IJob[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  function handleNewSearchChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setSearch(event.target.value);
  }

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      const filteredResults = jobs.filter((item) => {
        const name = item.name.toLowerCase().includes(search.toLowerCase());
        const table = item.table.toLowerCase().includes(search.toLowerCase());
        const status = item.status.toLowerCase().includes(search.toLowerCase());

        return name || table || status;
      });
      setFilteredJobs(filteredResults);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    if (!search) {
      setFilteredJobs(jobs);
    }
  }, [jobs, search]);

  return (
    <>
      <Card />
      {connection && (
        <ContainerMain>
          <ContainerSearch>
            <DatePickerMUI
              selectDate={selectedDate}
              onSelectDate={handleSelectDate}
            />
            <InputMUI value={search} onChange={handleNewSearchChange} />
            <ButtonSearch
              type="submit"
              onClick={handleSearch}
              disabled={!search}
            >
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

          <ContainerJobsList>
            <Title>Jobs em execução</Title>
            <ListJobs>
              <Thead>
                <tr>
                  <td></td>
                  <td>nome</td>
                  <td>Início</td>
                  <td>tabela</td>
                  <td>ação</td>
                  <td>status</td>
                </tr>
              </Thead>
              {filteredJobs?.map(
                (job) =>
                  job.status === "em execução" && (
                    <Job
                      key={job.id}
                      name={job.name}
                      startTime={getHourFromISODate(job.startTime)}
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
                  <td>Início</td>
                  <td>tabela</td>
                  <td>ação</td>
                  <td>status</td>
                </tr>
              </Thead>
              {filteredJobs?.map(
                (job) =>
                  job.status !== "em execução" && (
                    <Job
                      key={job.id}
                      name={job.name}
                      startTime={getHourFromISODate(job.startTime)}
                      table={job.table}
                      action={job.action}
                      status={job.status}
                    />
                  )
              )}
            </ListJobs>
          </ContainerJobsList>
        </ContainerMain>
      )}
    </>
  );
}
