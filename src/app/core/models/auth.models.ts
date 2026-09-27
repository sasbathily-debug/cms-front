export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface RegisterResponse {
  message: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  message: string;
}

export interface CompleteRegistrationRequest {
  email: string;
  password: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}
