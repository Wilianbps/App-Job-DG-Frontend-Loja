import { Route, Routes } from "react-router-dom";
import { DefaultLayout } from "./layouts/DefaultLayouts";
import { Dashboard } from "./pages/Dashboard";
import { Settings } from "./pages/Settings";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Dashboard/>}/>
        <Route path="/configurar-ambiente" element={<Settings/>}/>
      </Route>
    </Routes>
  );
}
