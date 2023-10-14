import { ReduxProvider } from "../redux/provider";
import { Pomotime } from "../components/Pomotime";

const Home = () => {
  return (
    <ReduxProvider>
      <Pomotime />
    </ReduxProvider>
  );
};

export default Home;
