import { ChangeEvent, useEffect, useState } from "react";
import { Card } from "../../components/Card";
import { DatePickerMUI } from "../../components/DatePickerMUI";
import { InputMUI } from "../../components/InputMUI";
import { Job } from "./components/Job";

import {
  ContainerMain,
  ContainerSearch,
  ContainerPagination,
  ButtonSearch,
  ContainerJobsList,
  Title,
  ListJobs,
  Thead,
} from "./styles";
import {
  Box,
  CircularProgress,
  Pagination,
  PaginationItem,
} from "@mui/material";
import { getHourFromISODate } from "../../libs/getHourFromISODate";
import { useJob } from "../../contexts/job/JobContext";
import { useSettings } from "../../contexts/settings/SettingsContext";
import { Warning } from "./components/warning";

interface IJob {
  id: string;
  name: string;
  startTime: string;
  table: string;
  path: string;
  action: string;
  status: string;
}

export function Dashboard() {
  const { connection } = useSettings();
  const { jobs, selectedDate, handleSelectDate } = useJob();

  const [page, setPage] = useState(1);
  const [filteredJobs, setFilteredJobs] = useState<IJob[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePage = (_event: ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const itemsPerPage = 10;

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const listJobs = filteredJobs.slice(startIndex, endIndex);

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

      {!connection && <Warning />}

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
                  <td>Caminho</td>
                  <td>Qtd Registros</td>
                  <td>status</td>
                </tr>
              </Thead>
              {Array.isArray(jobs) &&
                jobs?.map(
                  (job) =>
                    job.status === "em execução" && (
                      <Job
                        key={job.id}
                        name={job.name}
                        startTime={getHourFromISODate(job.startTime)}
                        table={job.table}
                        path={job.path}
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
                  <td>Caminho</td>
                  <td>Qtd Registros</td>
                  <td>status</td>
                </tr>
              </Thead>
              {Array.isArray(listJobs) &&
                listJobs?.map(
                  (job) =>
                    job.status !== "em execução" && (
                      <Job
                        key={job.id}
                        name={job.name}
                        startTime={getHourFromISODate(job.startTime)}
                        table={job.table}
                        path={job.path}
                        action={job.action}
                        status={job.status}
                      />
                    )
                )}
            </ListJobs>
          </ContainerJobsList>

          <ContainerPagination>
            <Pagination
              count={Math.ceil(filteredJobs.length / itemsPerPage)}
              color="primary"
              variant="outlined"
              page={page}
              onChange={handleChangePage}
              renderItem={(item) => (
                <PaginationItem component="a" href="#" {...item} />
              )}
            />
          </ContainerPagination>
        </ContainerMain>
      )}
    </>
  );
}
