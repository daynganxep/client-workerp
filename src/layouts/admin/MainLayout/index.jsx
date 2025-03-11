import "./AdminLayout.scss";

export default function AdminLayout({ children }) {
    return (
        <div className="admin-layout">
            MAIN LAYOUT
            <main>{children}</main>
        </div>
    );
}
