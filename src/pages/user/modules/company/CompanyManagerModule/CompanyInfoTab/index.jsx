import { useLocation } from "react-router-dom";

function CompanyInfoTab() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const domain = queryParams.get("domain");

    return (
        <div className="company-info-tab">
            <h3>Quản lý thông tin công ty</h3>
            <p>Form chỉnh sửa tên, domain, icon công ty ở đây...</p>
            {domain && <p>Domain từ query: {domain}</p>}
        </div>
    );
}

export default CompanyInfoTab;
