import { BoxArrays } from "@/types";
import { OandaApi } from "../api/OandaApi";

enum TradeState {
	Initialized,
	Opened,
	Closed,
}

interface TradeSnapshot {
	boxArrays: any;
	currentPrice: number;
	stopLoss: number;
	timestamp: Date;
}
class ResoBot {
	private symbol: string;
	private apiContext: OandaApi;
	private dataFetchIntervalId: NodeJS.Timeout | null = null;
	private unrealizedPL: number | null = null;
	private realizedPL: number | null = null;
	private equity: number | null = null;
	private tradeCount: number | null = null;
	private marginCloseoutPercent: number | null = null;
	private unitsLong: number | null = null;
	private unitsShort: number | null = null;
	private accountSummary: any = null;
	private pairPositionSummary: any = null;
	private positionSummary: any = null;
	private isProcessingTrade: boolean = false;
	private isActive: boolean = false;
	private tradeState: TradeState = TradeState.Closed;
	private tradeSnapshot: TradeSnapshot | null = null;

	constructor(symbol: string, apiContext: OandaApi) {
		this.symbol = symbol;
		this.apiContext = apiContext;
	}

	toggleActive() {
		this.isActive = !this.isActive;
	}
	public async startDataCollection(interval: number = 10000) {
		this.stopDataCollection();

		await this.fetchData();

		this.dataFetchIntervalId = setInterval(() => this.fetchData(), interval);
	}

	private async fetchData() {
		try {
			this.pairPositionSummary = await this.apiContext.getPairPositionSummary(
				this.symbol,
			);
			this.accountSummary = await this.apiContext.getAccountSummary();

			if (this.accountSummary) {
				this.unrealizedPL = parseFloat(this.accountSummary.unrealizedPL);
				this.realizedPL = parseFloat(this.accountSummary.pl);
				this.equity = parseFloat(this.accountSummary.NAV);
				this.marginCloseoutPercent = parseFloat(
					this.accountSummary.marginCloseoutPercent,
				);
			}

			if (this.pairPositionSummary) {
				const longUnits = parseInt(this.pairPositionSummary.long?.units ?? "0");
				const shortUnits = parseInt(
					this.pairPositionSummary.short?.units ?? "0",
				);
				const positionCount = longUnits !== 0 || shortUnits !== 0 ? 1 : 0;
				const longTradeCount =
					this.pairPositionSummary.long?.tradeIDs?.length ?? 0;
				const shortTradeCount =
					this.pairPositionSummary.short?.tradeIDs?.length ?? 0;
				const tradeCount = longTradeCount + shortTradeCount;

				this.positionSummary = {
					lastTransactionID: this.pairPositionSummary?.lastTransactionID ?? "",
					instrument: this.symbol,
					long: this.pairPositionSummary?.long ?? {},
					short: this.pairPositionSummary?.short ?? {},
					positionCount: positionCount,
					tradeCount: tradeCount,
				};
			}
		} catch (error) {
			console.error("Error fetching data: ", error);
		}
	}

	public stopDataCollection() {
		if (this.dataFetchIntervalId) {
			clearInterval(this.dataFetchIntervalId);
			this.dataFetchIntervalId = null;
		}
	}
	onData(currentPrice: number, boxArrays: BoxArrays) {
		if (!this.isActive || this.isProcessingTrade) {
			return;
		}

		const longUnits = this.positionSummary?.long?.units
			? parseInt(this.positionSummary.long.units)
			: 0;
		const shortUnits = this.positionSummary?.short?.units
			? parseInt(this.positionSummary.short.units)
			: 0;
		const tradeCount = this.positionSummary?.tradeCount ?? 0;
		const positionUnrealizedPL =
			longUnits > 0
				? parseFloat(this.positionSummary.long.unrealizedPL)
				: shortUnits < 0
				  ? parseFloat(this.positionSummary.short.unrealizedPL)
				  : 0;

		// Setting up trade state for existing trades
		if (tradeCount > 0 && !this.tradeSnapshot) {
			const direction = longUnits > 0 ? "BUY" : shortUnits < 0 ? "SELL" : null;
			if (direction) {
				const stopLoss = this.determineStopLoss(direction, boxArrays);
				this.tradeState = TradeState.Opened;
				this.tradeSnapshot = {
					boxArrays: boxArrays,
					currentPrice: currentPrice,
					stopLoss: stopLoss,
					timestamp: new Date(),
				};
				this.logTradeLifecycle("Trade Initialized with Existing Trade");
			}
		}

		// Rest of the logic for managing new trades
		if (this.equity !== null) {
			const profitTarget = this.equity * 0.001;
			const tradeSize = this.equity * 1;

			// Close existing trades for profit or stop loss
			const closeAndFetchData = async (units: number) => {
				this.isProcessingTrade = true;
				const closeResult = await this.apiContext.closePosition(
					this.symbol,
					units,
				);
				await this.fetchData();
				this.isProcessingTrade = false;
			};

			if (
				positionUnrealizedPL !== null &&
				positionUnrealizedPL > profitTarget
			) {
				if (longUnits > 0 || shortUnits < 0) {
					closeAndFetchData(longUnits > 0 ? longUnits : shortUnits);
				}
			}

			if (this.tradeSnapshot && this.tradeSnapshot.stopLoss !== null) {
				if (
					(longUnits > 0 && currentPrice <= this.tradeSnapshot.stopLoss) ||
					(shortUnits < 0 && currentPrice >= this.tradeSnapshot.stopLoss)
				) {
					closeAndFetchData(longUnits > 0 ? longUnits : shortUnits);
				}
			}

			// Logic for opening new trades
			if (tradeCount === 0) {
				const direction = this.determineTradeDirection(boxArrays);
				const stopLoss = this.determineStopLoss(direction, boxArrays);

				if (direction === "BUY") {
					this.executeTrade(tradeSize, 1, currentPrice, boxArrays, stopLoss);
				} else if (direction === "SELL") {
					this.executeTrade(tradeSize, -1, currentPrice, boxArrays, stopLoss);
				}
			}
		}
	}

	private async executeTrade(
		size: number,
		direction: number,
		currentPrice: number,
		boxArrays: BoxArrays,
		stopLoss: number,
	) {
		this.tradeState = TradeState.Initialized;
		this.tradeSnapshot = {
			boxArrays: boxArrays,
			currentPrice: currentPrice,
			stopLoss: stopLoss,
			timestamp: new Date(),
		};
		this.logTradeLifecycle("Trade Initialized");

		// Place and update the trade
		await this.placeTradeAndUpdate(size, direction);
	}

	private async placeTradeAndUpdate(size: number, direction: number) {
		this.isProcessingTrade = true;
		console.log(`Placing trade for ${this.symbol}:`, { size, direction });

		const tradeResult = await this.apiContext.placeTrade(
			this.symbol,
			size,
			direction,
		);
		console.log(`Trade placed for ${this.symbol}:`, tradeResult);

		await this.fetchData();
		this.tradeState = TradeState.Opened;
		this.logTradeLifecycle("Trade Opened");

		this.isProcessingTrade = false;
	}

	private logTradeLifecycle(event: string) {
		console.log(
			`[${new Date().toISOString()}] Trade Lifecycle Event: ${event}`,
			{
				tradeState: this.tradeState,
				tradeSnapshot: this.tradeSnapshot,
			},
		);
	}

	private determineTradeDirection(boxArrays: BoxArrays): string {
		let largestBox = null;
		for (const box of Object.values(boxArrays)) {
			if (!largestBox || box.rngSize > largestBox.rngSize) {
				largestBox = box;
			}
		}
		return largestBox.boxMovedUp ? "BUY" : "SELL";
	}

	private determineStopLoss(direction: string, boxArrays: BoxArrays): number {
		let smallestBox = null;
		for (const box of Object.values(boxArrays)) {
			if (!smallestBox || box.rngSize < smallestBox.rngSize) {
				smallestBox = box;
			}
		}
		return direction === "BUY" ? smallestBox.low : smallestBox.high;
	}
}

export default ResoBot;
