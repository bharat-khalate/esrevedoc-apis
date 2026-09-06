export type TAuthRepository = typeof import("./auth.repository.js");

export interface ISignupRequestBody {
  name: string;
  userName: string;
  mobileNumber: string;
  email: string;
  password: string;
  file?: File;
}
