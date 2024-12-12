import { useCallback, useState } from "react";
import { apiLoja, apiRetaguarda } from "../../../services/axios";
import { IJob } from "../interfaces";
import { generateUniqueJobName } from "./GenerateJobName";

export function useErpToEntbipJobSync() {
  const [jobsErp, setJobsErp] = useState<IJob[]>([]);

  function updateSetJobsErp(newJob: IJob[]) {
    setJobsErp(newJob);
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

      setJobsErp((state) => [...state, response.data]);
    },
    []
  );

  const updateStatusOnStage = useCallback(
    async (data: [], idJob: string) => {
      await apiLoja
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

  const addDataInTableRemote = useCallback(
    async (data: [], idJob: string) => {
      await apiRetaguarda
        .post("register-path-StoreToRemoteDb", data)
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
      const fetchUsers = await apiLoja.get("search-on-stage", {
        params: { table: queryTable.table, storeCode: queryTable.storeCode },
      });

      if (fetchUsers.data.length > 0) {
        const users = fetchUsers.data;
        addDataInTableRemote(users, idJob);
      } else {
        updateStatusJob(200, 0, idJob);
      }
    },
    [updateStatusJob, addDataInTableRemote]
  );

  const startJobToTransferFileFromErptoEntbip = useCallback(
    async (queryTable: { table: string; storeCode: string }) => {
      const randomJobName = await generateUniqueJobName("LR");
      const newDate = new Date().toISOString();
      const newJob = {
        name: randomJobName,
        startTime: newDate,
        table: queryTable.table,
        path: "2",
        action: "",
        status: "em execução",
      };

      const response = await apiLoja.post("jobs/path-remoteToStoreDB", newJob);
      setJobsErp((state) => [...state, response.data]);

      const idJob = response.data.id;

      searchOnStage(queryTable, idJob);
    },
    [searchOnStage]
  );

  return { jobsErp, startJobToTransferFileFromErptoEntbip, updateSetJobsErp };
}
