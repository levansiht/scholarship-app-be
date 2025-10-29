import { validateMoney, type MoneySchemaType } from '../schemas';
import { Currency } from '../../../shared/constants';

export class Money {
  private readonly _amount: number;
  private readonly _currency: Currency;

  private constructor(props: MoneySchemaType) {
    this._amount = props.amount;
    this._currency = props.currency as Currency;
  }

  static create(amount: number, currency: Currency = Currency.VND): Money {
    const validated = validateMoney(amount, currency);
    return new Money(validated);
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): Currency {
    return this._currency;
  }

  add(other: Money): Money {
    if (this._currency !== other._currency) {
      throw new Error('Cannot add money with different currencies');
    }
    return Money.create(this._amount + other._amount, this._currency);
  }

  subtract(other: Money): Money {
    if (this._currency !== other._currency) {
      throw new Error('Cannot subtract money with different currencies');
    }
    const result = this._amount - other._amount;
    if (result < 0) {
      throw new Error('Result cannot be negative');
    }
    return Money.create(result, this._currency);
  }

  multiply(factor: number): Money {
    if (factor < 0) {
      throw new Error('Factor cannot be negative');
    }
    return Money.create(this._amount * factor, this._currency);
  }

  equals(other: Money): boolean {
    return this._amount === other._amount && this._currency === other._currency;
  }

  greaterThan(other: Money): boolean {
    if (this._currency !== other._currency) {
      throw new Error('Cannot compare money with different currencies');
    }
    return this._amount > other._amount;
  }

  lessThan(other: Money): boolean {
    if (this._currency !== other._currency) {
      throw new Error('Cannot compare money with different currencies');
    }
    return this._amount < other._amount;
  }

  toString(): string {
    return `${this._amount.toLocaleString()} ${this._currency}`;
  }
}
