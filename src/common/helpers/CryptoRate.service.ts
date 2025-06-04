import { Injectable } from '@nestjs/common';
import * as CoinpaprikaAPI from '@coinpaprika/api-nodejs-client';

@Injectable()
export class CryptoService {
  private client = new CoinpaprikaAPI();
  private validCoinIds: string[] = [];

  async onModuleInit() {
    const coins = await this.client.getCoins();
    this.validCoinIds = coins.map((coin) => coin.id);
  }

  async getPriceUSD(coinId: string): Promise<number> {
    // if (!this.validCoinIds.includes(coinId)) {
    //   throw new Error(`Coin "${coinId}" is not supported.`);
    // }

    const ticker = await this.client.getTicker(coinId);
    return ticker.quotes.USD.price;
  }

  async swap(from: string, to: string, amount: number): Promise<{ result: number }> {
    const fromPrice = await this.getPriceUSD(from);
    const toPrice = await this.getPriceUSD(to);

    if (!fromPrice || !toPrice) {
      throw new Error('Invalid coin symbol');
    }

    const result = (amount * fromPrice) / toPrice;
    return { result };
  }

}
