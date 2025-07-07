export interface AuthLinkRes {
  accountAlreadyRegistered: boolean;
  accessToken: string;
}

export interface LinkEmailReq {
  email: string;
  password: string;
}

export interface AuthReq {
  email: string;
  password: string;
}
