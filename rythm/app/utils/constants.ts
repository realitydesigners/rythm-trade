interface CurrencyPairDetails {
    point: number;
    digits: number;
}
export const BOX_SIZES: Record<string, number[]> = {
    array1: [1000, 900, 810, 730, 656, 590, 531, 478, 430, 387, 348, 313, 282, 254, 228, 205, 185, 166, 150, 135, 121, 109, 100, 90, 81, 73, 65, 60, 53, 47, 43, 387, 348, 31, 28, 25, 23, 20, 18, 16, 15, 14, 12, 11, 10],
    array2: [10000, 7500, 5625, 4219, 3164, 2373, 1780, 1335, 1001, 751, 563, 422, 317, 238, 178, 134, 100],
    array3: [10000, 9000, 8100, 7290, 6561, 5904, 5313, 4781, 4302, 3871, 3483, 3134, 2820, 2538, 2284, 2055, 1849, 1664, 1497, 1347, 1212, 1090, 981, 882, 793, 713, 641, 576, 518, 466, 419, 377, 339, 305, 274, 246, 221, 198, 178, 160, 144, 129, 116, 104],
    default: [1000, 750, 562, 420, 316, 233, 177, 133, 100, 75, 56, 42, 31, 23, 17, 13, 10]
};
export interface SymbolsToDigits {
    [key: string]: CurrencyPairDetails;
}

export const symbolsToDigits: SymbolsToDigits = {
    'USD_SGD': { point: 0.00001, digits: 5 },
    'EUR_SEK': { point: 0.00001, digits: 5 },
    'HKD_JPY': { point: 0.0001, digits: 5 },
    'AUD_USD': { point: 0.00001, digits: 5 },
    'USD_CAD': { point: 0.00001, digits: 5 },
    'NZD_USD': { point: 0.00001, digits: 5 },
    'NZD_SGD': { point: 0.00001, digits: 5 },
    'USD_NOK': { point: 0.00001, digits: 5 },
    'USD_CNH': { point: 0.00001, digits: 5 },
    'SGD_CHF': { point: 0.00001, digits: 5 },
    'GBP_JPY': { point: 0.0001, digits: 5 },
    'USD_TRY': { point: 0.00001, digits: 5 },
    'AUD_JPY': { point: 0.0001, digits: 5 },
    'ZAR_JPY': { point: 0.0001, digits: 5 },
    'SGD_JPY': { point: 0.0001, digits: 5 },
    'GBP_ZAR': { point: 0.00001, digits: 5 },
    'USD_JPY': { point: 0.0001, digits: 5 },
    'EUR_TRY': { point: 0.00001, digits: 5 },
    'EUR_JPY': { point: 0.0001, digits: 5 },
    'AUD_SGD': { point: 0.00001, digits: 5 },
    'EUR_NZD': { point: 0.00001, digits: 5 },
    'GBP_HKD': { point: 0.00001, digits: 5 },
    'CHF_JPY': { point: 0.0001, digits: 5 },
    'EUR_HKD': { point: 0.00001, digits: 5 },
    'GBP_CAD': { point: 0.00001, digits: 5 },
    'USD_THB': { point: 0.0001, digits: 5 },
    'GBP_CHF': { point: 0.00001, digits: 5 },
    'AUD_CHF': { point: 0.00001, digits: 5 },
    'NZD_CHF': { point: 0.00001, digits: 5 },
    'AUD_HKD': { point: 0.00001, digits: 5 },
    'USD_CHF': { point: 0.00001, digits: 5 },
    'CAD_HKD': { point: 0.00001, digits: 5 },
    'EUR_CHF': { point: 0.00001, digits: 5 },
    'EUR_SGD': { point: 0.00001, digits: 5 },
    'NZD_CAD': { point: 0.00001, digits: 5 },
    'GBP_AUD': { point: 0.00001, digits: 5 },
    'USD_PLN': { point: 0.00001, digits: 5 },
    'EUR_ZAR': { point: 0.00001, digits: 5 },
    'TRY_JPY': { point: 0.0001, digits: 5 },
    'EUR_AUD': { point: 0.00001, digits: 5 },
    'USD_ZAR': { point: 0.00001, digits: 5 },
    'CAD_JPY': { point: 0.0001, digits: 5 },
    'NZD_HKD': { point: 0.00001, digits: 5 },
    'USD_CZK': { point: 0.00001, digits: 5 },
    'USD_DKK': { point: 0.00001, digits: 5 },
    'USD_SEK': { point: 0.00001, digits: 5 },
    'GBP_SGD': { point: 0.00001, digits: 5 },
    'EUR_DKK': { point: 0.00001, digits: 5 },
    'CHF_ZAR': { point: 0.00001, digits: 5 },
    'CAD_CHF': { point: 0.00001, digits: 5 },
    'GBP_USD': { point: 0.00001, digits: 5 },
    'USD_MXN': { point: 0.00001, digits: 5 },
    'USD_HUF': { point: 0.0001, digits: 5 },
    'USD_HKD': { point: 0.00001, digits: 5 },
    'EUR_USD': { point: 0.00001, digits: 5 },
    'EUR_CAD': { point: 0.00001, digits: 5 },
    'AUD_CAD': { point: 0.00001, digits: 5 },
    'GBP_PLN': { point: 0.00001, digits: 5 },
    'EUR_PLN': { point: 0.00001, digits: 5 },
    'GBP_NZD': { point: 0.00001, digits: 5 },
    'EUR_HUF': { point: 0.0001, digits: 5 },
    'EUR_NOK': { point: 0.00001, digits: 5 },
    'CHF_HKD': { point: 0.00001, digits: 5 },
    'EUR_GBP': { point: 0.00001, digits: 5 },
    'AUD_NZD': { point: 0.00001, digits: 5 },
    'CAD_SGD': { point: 0.00001, digits: 5 },
    'EUR_CZK': { point: 0.00001, digits: 5 },
    'NZD_JPY': { point: 0.0001, digits: 5 },
};
