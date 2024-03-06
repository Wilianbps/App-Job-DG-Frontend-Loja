export interface IJob {
  id: string;
  name: string;
  startTime: string;
  table: string;
  action: string;
  status: string;
}

export interface JobsContextType {
  jobs: IJob[];
  selectedDate: Date | unknown;
  updateSetJobs: (newJobs: IJob[]) => void;
  handleSelectDate: (date: Date | unknown) => void;
}