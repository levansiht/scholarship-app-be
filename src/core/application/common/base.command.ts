import type { ICommand } from './interfaces/command.interface';

export abstract class BaseCommand implements ICommand {
  public readonly timestamp: Date;

  constructor() {
    this.timestamp = new Date();
    Object.freeze(this);
  }
}
