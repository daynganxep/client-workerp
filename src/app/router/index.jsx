import { RouterProvider } from "react-router-dom";
import routes from "@app/router/routes";

function Router() {
    return (
        <RouterProvider router={routes} />
    );
}

export default Router;
