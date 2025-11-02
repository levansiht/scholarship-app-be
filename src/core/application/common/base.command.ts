import type { ICommand } from './interfaces/command.interface';

export abstract class BaseCommand implements ICommand {
  public readonly timestamp: Date;

  constructor() {
    this.timestamp = new Date();
    // Remove Object.freeze - it prevents child classes from adding properties
  }
}
