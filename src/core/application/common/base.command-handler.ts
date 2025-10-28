import type { ICommand } from './interfaces/command.interface';
import type { ICommandHandler } from './interfaces/command-handler.interface';
import { ValidationResult } from './types/validation.type';
import { z } from 'zod';

export abstract class BaseCommandHandler<TCommand extends ICommand, TResult>
  implements ICommandHandler<TCommand, TResult>
{
  abstract execute(command: TCommand): Promise<TResult>;

  protected validate(command: TCommand): void {
    if (!command) {
      throw new Error('Command cannot be null or undefined');
    }

    if (!(command instanceof Object)) {
      throw new Error('Command must be an object');
    }

    const validationResult = this.validateImpl(command);
    if (!validationResult.isValid) {
      const errors = validationResult.getAllErrors().join(', ');
      throw new Error(`Validation failed: ${errors}`);
    }
  }

  protected validateImpl(_command: TCommand): ValidationResult {
    void _command;
    return ValidationResult.success();
  }

  protected validateWithSchema<T>(
    data: T,
    schema: z.ZodSchema<T>,
  ): ValidationResult {
    const result = schema.safeParse(data);

    if (!result.success) {
      return ValidationResult.fromZodError(result.error);
    }

    return ValidationResult.success();
  }

  protected async executeWithTransaction<T>(
    operation: () => Promise<T>,
  ): Promise<T> {
    return operation();
  }

  protected log(message: string, data?: unknown): void {
    const commandName = this.constructor.name;
    console.log(`[${commandName}] ${message}`, data ? data : '');
  }

  protected logError(error: Error, command: TCommand): void {
    const commandName = this.constructor.name;
    console.error(`[${commandName}] Error:`, {
      message: error.message,
      stack: error.stack,
      command,
    });
  }
}
