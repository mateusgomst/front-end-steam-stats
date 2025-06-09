export interface AuthRequest {
  name?: string;
  login: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface User {
  name: string;
  login: string;
} 