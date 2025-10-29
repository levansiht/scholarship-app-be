import { z } from 'zod';
import {
  CurrencyEnum,
  Currency,
  SCHOLARSHIP_VALIDATION_MESSAGES as MSG,
} from '../../../shared/constants';

export const MoneySchema = z.object({
  amount: z.number().nonnegative(MSG.AMOUNT.NON_NEGATIVE),
  currency: CurrencyEnum.default(Currency.VND),
});

export type MoneySchemaType = z.infer<typeof MoneySchema>;

export const validateMoney = (
  amount: number,
  currency: Currency,
): MoneySchemaType => {
  return MoneySchema.parse({ amount, currency });
};

export const isValidMoney = (amount: number, currency: Currency): boolean => {
  return MoneySchema.safeParse({ amount, currency }).success;
};
