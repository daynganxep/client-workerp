import BrandName from "@components/BandName";
import Logo from "@components/Logo"
import { Link } from "react-router-dom";

import ".scss";

function LogoAndBrandName({ size = 1 }) {
  return (
    <Link
      to="/"
      className="logo-and-brandname"
      style={{ transform: `scale(${size})` }}
    >
      <Logo></Logo>
      <BrandName></BrandName>
    </Link>
  );
}
export default LogoAndBrandName;
