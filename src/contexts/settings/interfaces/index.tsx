export interface SettingsContextType {
  connection: boolean;
  statusConnectionDatabaseLocal: boolean,
  statusConnectionDatabaseRemote: boolean,
  formDataLocal: IPropsDatabase;
  formDataRemote: IPropsDatabase;
  configDatabase: (data: IPropsDatabase, database: string) => void;
}

export interface SettingsProviderProps {
  children: React.ReactNode;
}

export interface IPropsDatabase {
  baseURL?: string;
  server: string;
  database: string;
  user: string;
  password: string;
}
