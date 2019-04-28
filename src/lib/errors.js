export class NotEnoughCurrencyError extends Error {

  constructor(current = 0, needed = 0, currency = 'gold') {
    super(`Not enough ${currency}. Current ${currency}: ${current}. Amount needed: ${needed}`);
    this.current = current;
    this.needed = needed;
    this.currency = currency;
  }
}