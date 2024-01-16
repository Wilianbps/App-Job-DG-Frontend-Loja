import { Tbody, Tag } from "./styles";

interface IJob {
  name: string;
  startTime: string;
  table: string;
  action: string;
  status: string;
}

export function Job(job: IJob) {
  return (
    <Tbody coolorStatus={job.status}>
      <tr>
        <Tag variant={job.table} />
        <td width={100}>{job.name}</td>
        <td width={200}>{job.startTime}</td>
        <td width={200}>{job.table}</td>
        <td width={300}>{job.action}</td>
        <td>
          <div className="contentJobStatus">
            {job.status} <span className="cycleStatus"></span>
          </div>
        </td>
      </tr>
    </Tbody>
  );
}
