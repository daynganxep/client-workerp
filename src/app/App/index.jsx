import { ThemeProvider } from "@mui/material/styles";
import Router from "@app/Router";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import useInitialApp from "@hooks/useInitialApp";
import theme from "./theme";
import "./global.css";

function App() {
  useInitialApp();

  return (
    <ThemeProvider theme={theme}>
      <HelmetProvider>
        <Router />
        <Toaster />
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App;
