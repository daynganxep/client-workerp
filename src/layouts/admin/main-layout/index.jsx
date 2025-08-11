import { Outlet } from "react-router-dom";
import "./admin-layout.scss";

export default function AdminLayout() {
    return (
        <div className="admin-layout">
            MAIN LAYOUT
            <main><Outlet></Outlet></main>
        </div>
    );
}
