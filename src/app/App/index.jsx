import Router from "@app/Router";
import { ThemeProvider } from "@mui/material/styles";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import useInitialApp from "@hooks/useInitialApp";
import { lightTheme, darkTheme } from "./theme";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import "./global.css";

function App() {
  const { theme: mode } = useSelector((state) => state.setting);
  const theme = useMemo(() => (mode === "light" ? lightTheme : darkTheme), [mode]);
  useInitialApp();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HelmetProvider>
        <Router />
        <Toaster />
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App;