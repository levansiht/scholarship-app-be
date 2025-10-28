import { validateGPA } from '../schemas';

export class GPA {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = value;
  }

  static create(value: number): GPA {
    const validated = validateGPA(value);
    return new GPA(validated);
  }

  get value(): number {
    return this._value;
  }

  equals(other: GPA): boolean {
    return this._value === other._value;
  }

  greaterThan(other: GPA): boolean {
    return this._value > other._value;
  }

  lessThan(other: GPA): boolean {
    return this._value < other._value;
  }

  greaterThanOrEqual(other: GPA): boolean {
    return this._value >= other._value;
  }

  lessThanOrEqual(other: GPA): boolean {
    return this._value <= other._value;
  }

  toString(): string {
    return this._value.toFixed(2);
  }
}
