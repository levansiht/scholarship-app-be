import { validatePassword } from '../schemas';

export class Password {
  private readonly _value: string;

  private constructor(value: string) {
    this._value = value;
  }

  static create(value: string): Password {
    const validated = validatePassword(value);
    return new Password(validated);
  }

  static createHashed(hashedValue: string): Password {
    return new Password(hashedValue);
  }

  get value(): string {
    return this._value;
  }

  equals(other: Password): boolean {
    return this._value === other._value;
  }
}
