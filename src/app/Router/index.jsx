import { RouterProvider } from "react-router-dom";
import routes from "@app/Router/route";

function Router() {
    return (
        <RouterProvider router={routes} />
    );
}

export default Router;
