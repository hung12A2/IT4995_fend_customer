/* eslint-disable @next/next/no-img-element */
"use client";
import { useForm, FormProvider } from "react-hook-form";
import {
  EmailField,
  PasswordField,
  SelectField,
  TextField,
} from "../../module/base/fieldBase";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import axios from "../../module/AxiosCustom/custome_Axios";
import { useAuthContext } from "@/provider/auth.provider";

const Login = () => {
  const { toast } = useToast();
  const router = useRouter();
  const authContext = useAuthContext();
  const { login } = authContext;
  const formContext = useForm({});

  const { handleSubmit } = formContext;

  const onSubmit = async (data: any) => {
    const { email, password, rePassword, fullName, phoneNumber, gender } = data;

    if (password !== rePassword) {
      toast({
        title: "Mat khau khong trung khop",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Mat khau phai lon hon 6 ky tu",
        variant: "destructive",
      });
      return;
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast({
        title: "Số điện thoại không hợp lệ",
        description: "Số điện thoại phải là 10 hoặc 11 chữ số.",
        variant: "destructive",
      });
      return;
    }

    const dataReturnRegister: any = await axios
      .post("register/customer", {
        email,
        password,
        fullName,
        phoneNumber,
        gender: gender?.value,
      })
      .then((res) => res)
      .catch((e) => console.log(e));

    if (dataReturnRegister?.code == 200) {
      toast({
        title: "Đăng ký thành công",
      });
      router.push("/Login");
    } else {
      toast({
        title: "Đăng ký thất bại",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-grey-lighter min-h-screen flex flex-col bg-[url('https://tecwood.com.vn/upload/images/Post/hinh-nen-xanh-la-cay-cute.jpg')]">
      <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
        <div className="bg-white px-6 py-8 rounded shadow-md text-black w-full">
          <h1 className="mb-8 text-3xl text-center font-semibold">Sign up</h1>
          <FormProvider {...formContext}>
            <div className="mb-4 ">
              <TextField
                required={true}
                name="fullName"
                label="Full Name"
                placeholder="Full Name"
              />
            </div>
            <div className="mb-4">
              <EmailField
                name="email"
                label="email"
                placeholder="email"
                required={true}
              />
            </div>
            <div className="mb-4 ">
              <PasswordField
                required={true}
                name="password"
                label="password"
                placeholder="password"
              />
            </div>
            <div className="mb-4 ">
              <PasswordField
                required={true}
                name="rePassword"
                label="Re Password"
                placeholder="Re Password"
              />
            </div>

            <div className="mb-4 ">
              <TextField
                required={true}
                name="phoneNumber"
                label="Phone Number"
                placeholder="Phone Number"
              />
            </div>

            <div className="mb-4 ">
              <SelectField
                required={true}
                name="gender"
                label="Gender"
                options={[
                  { value: "Nam", label: "Nam" },
                  { value: "Nữ", label: "Nữ" },
                  { value: "Khác", label: "Khác" },
                ]}
              />
            </div>

            <button
              onClick={handleSubmit(onSubmit)}
              className="w-full text-center py-3 rounded bg-green-500 text-white hover:bg-green-dark focus:outline-none my-3"
            >
              Create account
            </button>
          </FormProvider>
          <div className="text-center text-sm text-grey-dark mt-4">
            <p className="border-b border-grey-dark text-grey-dark mr-2 pb-4">
              By signing up, you agree to the Terms of Service and Privacy
              Policy
            </p>
          </div>
        </div>

        <div className=" mt-6">
          Already have an account?
          <a
            className="no-underline border-b border-blue text-blue-500 font-semibold"
            href="#"
            onClick={() => {}}
          >
            Log in
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default Login;
