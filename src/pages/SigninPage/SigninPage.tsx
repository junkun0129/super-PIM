import { useState } from "react";
import AppButton from "../../components/AppButton/AppButton";
import AppInput from "../../components/AppInput/AppInput";
import { useNavigate } from "react-router-dom";
import { signinApi } from "../../api/auth.api";
import { setCookie } from "../../util";
import { COOKIES, URL } from "../../constant";
interface LoginFormData {
  email: string;
  password: string;
}
const SigninPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const values: LoginFormData = {
      email: formData.get("email")?.toString() ?? "",
      password: formData.get("password")?.toString() ?? "",
    };
    try {
      setLoading(true);
      // API call would go here
      const { data, message, result } = await signinApi({
        body: {
          email: values.email,
          password: values.password,
        },
      });
      if (result === "failed") {
        throw new Error("Login failed!");
      }
      setCookie(COOKIES.TOKEN, data.token);
      setCookie(COOKIES.EMAIL, data.user.email);
      setCookie(COOKIES.CD, data.user.cd);
      setCookie(COOKIES.NAME, data.user.username);
      setCookie(COOKIES.ISLOGGEDIN, "true");
      navigate(URL.MAIN);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-[100vh] bg-gray-100 flex items-center justify-center">
      <div className="max-w-[600px] min-h-[350px] p-10 rounded-md shadow-lg bg-white flex flex-col justify-between">
        <div className="font-bold text-2xl flex justify-center">ログイン</div>
        <form
          onSubmit={onSubmit}
          className="flex flex-col h-[200px] justify-around "
        >
          <AppInput
            type="email"
            label="メールアドレス"
            name="email"
            require={true}
          />
          <AppInput
            type="password"
            label="パスワード"
            name="password"
            require={true}
          />

          <AppButton
            text={"ログイン"}
            onClick={function (): void {
              throw new Error("Function not implemented.");
            }}
            isForm={true}
            type={"primary"}
          />
        </form>
      </div>
    </div>
  );
};

export default SigninPage;
