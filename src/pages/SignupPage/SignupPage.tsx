import { useNavigate } from "react-router-dom";
import AppButton from "../../components/AppButton/AppButton";
import AppInput from "../../components/AppInput/AppInput";
import { useState } from "react";
import { signupApi } from "../../api/auth.api";
import { URL } from "../../constant";
interface SignupFormData {
  username: string;
  email: string;
  password: string;
}
const SignupPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values: SignupFormData = {
      email: formData.get("email")?.toString() ?? "",
      password: formData.get("password")?.toString() ?? "",
      username: formData.get("username")?.toString() ?? "",
    };
    try {
      setLoading(true);
      const response = await signupApi({
        body: {
          username: values.username,
          email: values.email,
          password: values.password,
        },
      });

      if (response.result === "failed") {
        throw new Error("Signup failed!");
      }

      navigate(URL.LOGIN);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-[100vh] bg-gray-100 flex items-center justify-center">
      <div className="max-w-[600px] p-10 rounded-md shadow-lg bg-white flex flex-col justify-between">
        <div className="font-bold text-2xl flex justify-center">
          ユーザー登録
        </div>

        <form
          onSubmit={onSubmit}
          className="flex flex-col h-[250px] my-7 justify-around"
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
          <AppInput
            type="text"
            label="ユーザーネーム"
            name="username"
            require={true}
          />

          <AppButton
            className="-mb-8"
            text={"登録"}
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

export default SignupPage;
