import { OandaApi, OandaApiContext } from '../api/OandaApi';
// import { AlgorithmTools, initTools } from './path/to/AlgorithmTools';
// import { Indicators } from './path/to/Indicators';
// import { Ticky } from './path/to/Ticky';

class Elixir {
    private static readonly ERROR_LOG: string = "elixer_error";
    private static readonly MAIN_LOG: string = "elixer_main";
    private static readonly SLEEP: number = 300;

    private account_id: string | null;
    private symbol: string;
    private api_k: string | null;
    private phone_n: string | null;
    private log_m: string | null; 
    private error_log: string;
    private main_log: string; 
    private api: undefined;
    apiContext: OandaApi;


    constructor(
        symbol = "EUR_USD",
        account_id: string | null = null,
        api_k: string | null = null,
        phone_n: string | null = null,
        log_m: string | null = null, 
        apiContext: OandaApi // Add the API context as a constructor parameter
    ) {
        this.account_id = account_id;
        this.symbol = symbol;
        this.api_k = api_k;
        this.phone_n = phone_n;
        this.log_m = log_m; 
        this.apiContext = apiContext; // Store the API context


        this.error_log = `${this.log_m}_${Elixir.ERROR_LOG}`;
        this.main_log = `${this.log_m}_${Elixir.MAIN_LOG}`; 
    }

    // ... rest of the methods
}

export default Elixir;
