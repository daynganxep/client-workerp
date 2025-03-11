import { ThemeProvider, createTheme } from "@mui/material/styles";
import Router from "@app/Router";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import useInitialApp from "@hooks/useInitialApp";
import "./global.css";

function App() {
  useInitialApp();
  return (
    <ThemeProvider theme={createTheme()}>
      <HelmetProvider>
        <Router />
        <Toaster />
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App;
