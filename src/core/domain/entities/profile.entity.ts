export interface ProfileProps {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phoneNumber?: string;
  avatar?: string;
  dateOfBirth?: Date;
  address?: string;
  city?: string;
  country: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Profile {
  private readonly props: ProfileProps;

  constructor(props: ProfileProps) {
    this.props = { ...props };
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get fullName(): string {
    return this.props.fullName;
  }

  get phoneNumber(): string | undefined {
    return this.props.phoneNumber;
  }

  get avatar(): string | undefined {
    return this.props.avatar;
  }

  get dateOfBirth(): Date | undefined {
    return this.props.dateOfBirth;
  }

  get address(): string | undefined {
    return this.props.address;
  }

  get city(): string | undefined {
    return this.props.city;
  }

  get country(): string {
    return this.props.country;
  }

  get bio(): string | undefined {
    return this.props.bio;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toJSON(): ProfileProps {
    return { ...this.props };
  }
}
