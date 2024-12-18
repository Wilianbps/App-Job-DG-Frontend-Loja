import { useCallback, useState } from "react";
import { apiLoja, apiRetaguarda } from "../../../services/axios";
import { IJob } from "../interfaces";
import { generateUniqueJobName } from "./GenerateJobName";

export function useJobProcess() {
  const [jobs, setJobs] = useState<IJob[]>([]);

  function updateSetJobs(newJob: IJob[]) {
    setJobs(newJob);
  }

  const updateStatusJob = useCallback(
    async (status: number, recordsLength: number, id: string) => {

      const amountRecords = recordsLength;

      const statusJob = status === 200 ? "processado" : "cancelado";

      const updateJob = {
        amountRecords,
        statusJob,
      };

      const response = await apiLoja.put(
        `jobs/path-remoteToStoreDB/${id}`,
        updateJob
      );

      setJobs((state) => [...state, response.data]);

    },
    []
  );

  const updateStatusOnStage = useCallback(
    async (data: [], idJob: string) => {
      await apiRetaguarda
        .put("update-Status-On-Stage", data)
        .then((response) => {
          const status = response.status;
          const recordsLength = data.length;

          updateStatusJob(status, recordsLength, idJob);
        })
        .catch((error) => {
          if (error.response) {
            const status = error.response.status;
            updateStatusJob(status, 0, idJob);
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
            updateStatusJob(status, 0, idJob);
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
        updateStatusJob(200, 0, idJob);
      }
    },
    [updateStatusJob, addDataInTableStore]
  );

  const startJob = useCallback(
    async (queryTable: { table: string; storeCode: string }) => {
      const randomJobName = await generateUniqueJobName('RL');
      const newDate = new Date().toISOString();
      const newJob = {
        name: randomJobName,
        startTime: newDate,
        table: queryTable.table,
        path: "1",
        action: "",
        status: "em execução",
      };

      const response = await apiLoja.post("jobs/path-remoteToStoreDB", newJob);
      setJobs((state) => [...state, response.data]);

      const idJob = response.data.id;

      searchOnStage(queryTable, idJob);
    },
    [searchOnStage]
  );

  return { jobs, startJob, updateSetJobs };
}
