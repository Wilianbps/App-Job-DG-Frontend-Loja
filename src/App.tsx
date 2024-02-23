import { ThemeProvider } from "styled-components";
import { defaultTheme } from "./themes/default";
import { GlobalStyle } from "./styles/global";
import { JobsProvider } from "./contexts/JobsContext";
import { BrowserRouter } from "react-router-dom";
import { Router } from "./Router";

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyle />
      <JobsProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </JobsProvider>
    </ThemeProvider>
  );
}

export default App;
