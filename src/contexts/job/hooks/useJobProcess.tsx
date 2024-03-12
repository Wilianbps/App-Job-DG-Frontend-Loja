import { useCallback, useState } from "react";
import { apiLoja, apiRetaguarda } from "../../../services/axios";
import { IJob } from "../interfaces";

export function useJobProcess() {
  const [jobs, setJobs] = useState<IJob[]>([]);

  /*   const idJobActive = useRef(""); */

  function updateSetJobs(newJob: IJob[]) {
    setJobs(newJob);
  }

  const updateStatusJob = useCallback(async (status: number, id: string) => {
    /*     const id = localStorage.getItem("jobId:user")!; */

    const statusJob = status === 200 ? "processado" : "cancelado";

    const response = await apiLoja.put(`jobs/path-remoteToStoreDB/${id}?status=${statusJob}`);

    setJobs((state) => [...state, response.data]);
    /* 
    localStorage.removeItem("jobId:user");
    idJobActive.current = ""; */
  }, []);

  const updateStatusOnStage = useCallback(
    async (data: [], idJob: string) => {
      console.log("entrou aqui", data);
      await apiRetaguarda
        .put("update-Status-On-Stage", data)
        .then((response) => {
          const status = response.status;

          updateStatusJob(status, idJob);
        })
        .catch((error) => {
          if (error.response) {
            const status = error.response.status;
            updateStatusJob(status, idJob);
          }
        });
    },
    [updateStatusJob]
  );

  const addDataInTableStore = useCallback(
    async (data: [], idJob: string) => {
      await apiLoja
        .post("register-path-remoteToStoreDB", data)
        .then(() => {
          updateStatusOnStage(data, idJob);
        })
        .catch((error) => {
          if (error.response) {
            const status = error.response.status;
            updateStatusJob(status, idJob);
          }
        });
    },
    [updateStatusJob, updateStatusOnStage]
  );

  const searchOnStage = useCallback(
    async (queryTable: { table: string; storeCode: string }, idJob: string) => {
      const fetchUsers = await apiRetaguarda.get("search-on-stage", {
        params: { table: queryTable.table, storeCode: queryTable.storeCode },
      });

      if (fetchUsers.data.length > 0) {
        const users = fetchUsers.data;
        addDataInTableStore(users, idJob);
      } else {
        updateStatusJob(200, idJob);
      }
    },
    [updateStatusJob, addDataInTableStore]
  );

  const startJob = useCallback(
    async (queryTable: { table: string; storeCode: string }) => {
      const newDate = new Date().toISOString();
      const newJob = {
        name: "006",
        startTime: newDate,
        table: queryTable.table,
        action: "",
        status: "em execução",
      };

      const response = await apiLoja.post("jobs/path-remoteToStoreDB", newJob);
      setJobs((state) => [...state, response.data]);

      const idJob = response.data.id;

      /*  idJobActive.current = response.data.id;

            localStorage.setItem(`jobId:${queryTable.table.toLowerCase()}`, idJobActive.current); */

      searchOnStage(queryTable, idJob);
    },
    [searchOnStage]
  );

  return { jobs, startJob, updateSetJobs };
}
