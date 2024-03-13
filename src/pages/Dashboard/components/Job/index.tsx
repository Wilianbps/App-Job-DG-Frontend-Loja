import { Tbody, Tag } from "./styles";

interface IJob {
  name: string;
  startTime: string;
  table: string;
  path: string;
  action: string;
  status: string;
}

export function Job(job: IJob) {
  const path =
    job.path == "1"
      ? "Retaguarda > Loja"
      : job.path == "2" && "Loja > Retaguarda";
  return (
    <Tbody coolorStatus={job.status}>
      <tr>
        <Tag variant={job.path} />
        <td width={100}>{job.name}</td>
        <td width={100}>{job.startTime}</td>
        <td width={200} className="table">{job.table}</td>
        <td width={300} className="path">{path}</td>
        <td width={300}>{job.action}</td>
        <td width={250}>
          <div className="contentJobStatus">
            {job.status} <span className="cycleStatus"></span>
          </div>
        </td>
      </tr>
    </Tbody>
  );
}
