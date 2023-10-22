import { CandleChart } from "./components/CandleChart";

import PriceStream from "./components/PriceStream";
import Renko from "./components/RenkoChart";

function App() {
  return (
    <div>
      <PriceStream />
      <Renko />
      <CandleChart />
    </div>
  );
}

export default App;
