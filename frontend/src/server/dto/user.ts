export interface FindPasswordReq {
  name: string;
  email: string;
}

export interface SignUpByEmailReq {
  name: string;
  email: string;
  password: string;
}
