import { z } from 'zod';
import { CurrencyEnum, Currency } from '../../../shared/constants';

export const MoneySchema = z.object({
  amount: z.number().nonnegative('Amount must be non-negative'),
  currency: CurrencyEnum.default(Currency.VND),
});

export type MoneySchemaType = z.infer<typeof MoneySchema>;

export const validateMoney = (
  amount: number,
  currency: 'VND' | 'USD',
): MoneySchemaType => {
  return MoneySchema.parse({ amount, currency });
};

export const isValidMoney = (
  amount: number,
  currency: 'VND' | 'USD',
): boolean => {
  return MoneySchema.safeParse({ amount, currency }).success;
};
