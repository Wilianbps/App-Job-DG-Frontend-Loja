import { useCallback, useRef, useState } from "react";
import { apiLoja, apiRetaguarda } from "../../../services/axios";
import { IJob } from "../interfaces";

export function useJobProcess() {
  const [jobs, setJobs] = useState<IJob[]>([]);

  const idJobActive = useRef("");

  function updateSetJobs(newJob: IJob[]) {
    setJobs(newJob);
  }

  const newDate = new Date().toISOString();

  const updateStatusJob = useCallback(async (status: number) => {
    const id = localStorage.getItem("jobId:user")!;
    const statusJob = status === 200 ? "processado" : "cancelado";

    const response = await apiLoja.put(`jobs/users/${id}?status=${statusJob}`);

    setJobs((state) => [...state, response.data]);

    localStorage.removeItem("jobId:user");
    idJobActive.current = "";
  }, []);

  const updateStatusOnStage = useCallback(
    async (dataUsers: []) => {
      await apiRetaguarda
        .post("users", dataUsers)
        .then((response) => {
          const status = response.status;

          updateStatusJob(status);
        })
        .catch((error) => {
          if (error.response) {
            const status = error.response.status;
            updateStatusJob(status);
          }
        });
    },
    [updateStatusJob]
  );

  const addDataInTableStore = useCallback(
    async (dataUsers: []) => {
      await apiLoja
        .post("users", dataUsers)
        .then(() => {
          updateStatusOnStage(dataUsers);
        })
        .catch((error) => {
          if (error.response) {
            const status = error.response.status;
            updateStatusJob(status);
          }
        });
    },
    [updateStatusJob, updateStatusOnStage]
  );

  const searchOnStage = useCallback(async () => {
    const fetchUsers = await apiRetaguarda.get("users", {
      params: { table: "USUARIO_DGCS", storeCode: "000008" },
    });

    if (fetchUsers.data.length > 0) {
      const users = fetchUsers.data;
      addDataInTableStore(users);
    } else {
      updateStatusJob(200);
    }
  }, [updateStatusJob, addDataInTableStore]);

  const startJob = useCallback(async () => {
    if (idJobActive.current) {
      return;
    } else {
      const newJob = {
        name: "006",
        startTime: newDate,
        table: "USUARIO_DGCS",
        action: "",
        status: "em execução",
      };

      const response = await apiLoja.post("jobs/users", newJob);
      setJobs((state) => [...state, response.data]);

      idJobActive.current = response.data.id;

      localStorage.setItem("jobId:user", idJobActive.current);

      searchOnStage();
    }
  }, [idJobActive, newDate, searchOnStage]);

  return { jobs, startJob, updateSetJobs };
}
