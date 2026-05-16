export interface User {
  id:        number;
  username:  string;
  email:     string;
  fullName:  string;
  phone:     string | null;
  avatarUrl: string | null;
  roles:     string[];
  createdAt: string;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password:        string;
}

export interface RegisterRequest {
  username: string;
  email:    string;
  password: string;
  fullName: string;
  phone?:   string;
}

export interface AuthResponse {
  token: string;
  type:  string;
  user:  User;
}
