import FetchedData  from "./components/FetchedData";

import PriceStream from "./components/PriceStream";
import Renko from "./components/RenkoChart";

function App() {
  return (
    <div>
      <PriceStream />
      <Renko />
      <FetchedData />
    </div>
  );
}

export default App;
