import Router from "@app/Router";
import { ThemeProvider } from "@mui/material/styles";
import { HelmetProvider } from "react-helmet-async";
import { lightTheme, darkTheme } from "./theme";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import useInitialApp from "@hooks/useInitialApp";
import CssBaseline from "@mui/material/CssBaseline";
import ReactHotToaster from "@components/ReactHotToaster";
import { THEMES } from "@configs/const.config";
import "./global.css";

function App() {
  const { theme: themeMode } = useSelector((state) => state.setting);
  const theme = useMemo(() => (themeMode === THEMES.LIGHT ? lightTheme : darkTheme), [themeMode]);
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