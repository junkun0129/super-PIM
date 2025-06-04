import { COOKIES, URL } from "../constant";
import { getCookie, resetAllCookies } from "../util";

export type ApiRes<DATA> = {
  result: string;
  data: DATA;
};
export const fetchRequest = async (
  url: string,
  method: "GET" | "POST",
  body?: any,
  isauth: boolean = false,
  isFormData: boolean = false // ← 追加！
) => {
  try {
    const token = getCookie(COOKIES.TOKEN);

    const headers = new Headers();
    if (!isauth) {
      if (!token) {
        handleAuthError();
      }
      headers.append("Authorization", `Bearer ${token}`);
    }

    if (!isFormData) {
      headers.append("Content-Type", "application/json");
    }

    const urlWithBase = `${import.meta.env.VITE_BASE_URL}${url}`;
    const response = await fetch(urlWithBase, {
      method,
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });

    if (response.status === 401) {
      handleAuthError();
      return { result: "failed" };
    }

    return response.json();
  } catch (error) {
    return { result: "failed" };
  }
};

const handleAuthError = () => {
  resetAllCookies();
  window.location.href = URL.LOGIN;
};
