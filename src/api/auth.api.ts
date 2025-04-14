import { Result } from "../types/api.type";
import { fetchRequest } from "./helper.api";

type SignupApiReq = {
  body: {
    username: string;
    password: string;
    email: string;
  };
};
type SignupApiRes = {
  message: string;
  result: Result;
};
export const signupApi = async ({
  body,
}: SignupApiReq): Promise<SignupApiRes> => {
  const url = "/auth/signup";
  const res = await fetchRequest(url, "POST", body, true);
  return res;
};

type SigninApiReq = {
  body: {
    password: string;
    email: string;
  };
};
type SigninApiRes = {
  message: string;
  result: Result;
  data: {
    user: {
      email: string;
      username: string;
      cd: string;
    };
    token: string;
  };
};
export const signinApi = async ({
  body,
}: SigninApiReq): Promise<SigninApiRes> => {
  const url = "/auth/signin";
  const res = await fetchRequest(url, "POST", body, true);
  return res;
};
