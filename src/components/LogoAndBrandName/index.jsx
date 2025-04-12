import BrandName from "@components/BandName";
import { Link } from "react-router-dom";
import logo from "@assets/images/logo.svg";

import ".scss";

function LogoAndBrandName({ size = 1 }) {
  return (
    <Link
      to="/"
      className="logo-and-brandname"
      style={{ transform: `scale(${size})` }}
    >
      <img src={logo} alt="work-erp" />
      {/* <BrandName></BrandName> */}
    </Link>
  );
}
export default LogoAndBrandName;
