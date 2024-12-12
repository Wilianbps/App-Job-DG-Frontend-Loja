export interface IJob {
  id: string;
  name: string;
  startTime: string;
  table: string;
  path: string;
  action: string;
  status: string;
}

export interface JobsContextType {
  jobs: IJob[];
  jobsErp:IJob[]
  selectedDate: Date | unknown;
  arrayAllActiveTables: ITables[]
  handleSelectDate: (date: Date | unknown) => void;
}

export interface ITables {
  id: number;
  tableName: string;
  orderTable: number;
  status: number;
  type: string;
}
