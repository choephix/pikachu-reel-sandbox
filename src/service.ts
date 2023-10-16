const SYMBOL_TYPES_COUNT = 8;
const REELS_COUNT = 5;
const REELS_LENGTH = 3;

class Service {
  balance: number = 0;

  constructor(balance) {
    this.balance = balance;
  }

  getBalance() {
    return this.balance;
  }

  setBalance(newBalance) {
    this.balance = newBalance;
  }

  getRandomSymbolsPlacement() {
    const results = new Array(REELS_COUNT);

    for(let reelIndex=0; reelIndex<REELS_COUNT ; reelIndex++){

      const reelSymbols = new Array(REELS_LENGTH);
      
      for(let rowIndex=0; rowIndex<REELS_LENGTH ; rowIndex++){
        const symbolIndex = Math.trunc(Math.random() * SYMBOL_TYPES_COUNT) + 1;
        reelSymbols[rowIndex] = symbolIndex;
      }

      results[reelIndex] = reelSymbols;

    }

    return results;
  }

  spin(bet: number) {
    this.balance -= bet;

    const results = this.getRandomSymbolsPlacement()

    /// check for win

    /// give player his money

    return results;
  }
}

export default Service;
