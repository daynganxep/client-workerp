import Router from "@app/Router";
import { ConfigProvider, App as AntApp } from "antd";
import { ToastContainer } from "react-toastify";
import useInitialApp from "@hooks/useInitialApp";
import "react-toastify/dist/ReactToastify.css";
import "./tailwind.css";
import "./global.css";

function App() {
    useInitialApp();
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#f06595",
                    colorSuccess: "#3b82f6",
                    colorWarning: "#ffd43b",
                    colorError: "#ff3300",
                },
            }}
        >
            <AntApp>
                <Router></Router>
                <ToastContainer />
            </AntApp>
        </ConfigProvider>
    );
}
export default App;
