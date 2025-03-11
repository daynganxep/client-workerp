import { useSelector } from "react-redux";
import "./Home.scss";

const Home = () => {
  const auth = useSelector((state) => state.auth);
  return <div>{JSON.stringify(auth)}</div>;
};

export default Home;
