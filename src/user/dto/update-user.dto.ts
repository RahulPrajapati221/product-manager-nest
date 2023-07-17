import { Role } from '../enum';

export class UpdateUserDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly role: Role;
}
