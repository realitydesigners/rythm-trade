import { CandleChart } from "./components/CandleChart";
import PriceStream from "./components/PriceStream";
import RenkoChart from "./components/RenkoChart";

function Page() {
  return (
    <div>
      <PriceStream />
      <RenkoChart />
      <CandleChart />
    </div>
  );
}

export default Page;
