export interface CreateUserDto {
  email: string;
  password: string;
  role: 'STUDENT' | 'ADMIN' | 'SPONSOR';
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface UserFilterDto {
  role?: 'STUDENT' | 'ADMIN' | 'SPONSOR';
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  email?: string;
}
