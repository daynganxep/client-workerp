import { Avatar, Button, Container } from "@mui/material";
import LogoAndBrandName from "@components/LogoAndBrandName";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ".scss";
import ThemeToggleButton from "@components/ThemeToggleButton";

const navItems = [{ name: "Ứng dụng", path: "/apps" }, { name: "Giá", path: "/pricing" }, {
    name: "Trợ giúp",
    path: "/help"
},];

const MainLayout = ({ children }) => {
    const { isLoging, user } = useSelector((state) => state.auth);

    return (<div className="main-layout">
        <header>
            <LogoAndBrandName size={0.7}></LogoAndBrandName>
            <ThemeToggleButton />
            <div>
                {navItems.map(({ name, path }) => {
                    return (<Link key={path + name} to={path}>
                        <Button>{name}</Button>
                    </Link>);
                })}
            </div>
            {isLoging ? (<Avatar src={user?.avatar} srcSet={user?.avatar} />) : (<Link to="/auth/login">
                <Button>Đăng nhập</Button>
            </Link>)}
        </header>
        <div className="content">
            <Container maxWidth="xl" className="content-container">
                {children}
            </Container>
        </div>
    </div>);
};

export default MainLayout;
