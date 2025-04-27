import logoDark from "@assets/images/logo-dark.svg";
import logoLight from "@assets/images/logo-light.svg";
import useIsDark from "@hooks/useIsDark";


function Logo() {
    const isDark = useIsDark();
    return (<img style={{ height: "60px" }} src={isDark ? logoDark : logoLight} alt="work-erp" />);
}

export default Logo;