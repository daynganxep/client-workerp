import { CardContent } from "@mui/material";
import BrandName from "@components/BandName";
import { Link } from "react-router-dom";
import bg from "@assets/images/nnnoise.svg";
import logo from "@assets/images/logo.svg";
import ".scss";

function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <img src={bg} alt="Background" className="auth-layout__background" />
      <div className="auth-layout__container">
        <div className="auth-layout__card">
          <Link to="/" className="auth-layout__header">
            <img src={logo} alt="work-erp" />
            <BrandName></BrandName>
          </Link>
          <CardContent>{children}</CardContent>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
