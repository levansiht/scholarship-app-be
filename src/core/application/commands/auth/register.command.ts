import { BaseCommand } from '../../common';
import { RegisterDto } from '../../../domain/dtos/register.dto.schema';

export class RegisterCommand extends BaseCommand {
  constructor(public readonly data: RegisterDto) {
    super();
  }
}
