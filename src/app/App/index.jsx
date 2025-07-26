import Router from "@app/Router";
import { ThemeProvider } from "@mui/material/styles";
import { HelmetProvider } from "react-helmet-async";
import useInitialApp from "@hooks/useInitialApp";
import { lightTheme, darkTheme } from "./theme";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import "./global.css";
import ReactHotToaster from "@components/ReactHotToaster";

function App() {
  const { theme: mode } = useSelector((state) => state.setting);
  const theme = useMemo(() => (mode === "light" ? lightTheme : darkTheme), [mode]);
  useInitialApp();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HelmetProvider>
        <Router />
        <ReactHotToaster />
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App;