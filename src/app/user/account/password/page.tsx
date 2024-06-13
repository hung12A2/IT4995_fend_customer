/* eslint-disable @next/next/no-img-element */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Footer from "@/module/Footer";
import Header from "@/module/Header";
import { useAuthContext } from "@/provider/auth.provider";
import EditIcon from "@mui/icons-material/Edit";
import Person2Icon from "@mui/icons-material/Person2";
import ListAltIcon from "@mui/icons-material/ListAlt";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { FormProvider, useForm } from "react-hook-form";
import { PasswordField } from "@/module/base/fieldBase";
import { useToast } from "@/components/ui/use-toast";
import axios from "../../../../module/AxiosCustom/custome_Axios";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import NavUser from "@/module/base/navUser";

export default function Page() {
  const { user } = useAuthContext();
  const formContext = useForm({});
  const { handleSubmit } = formContext;
  const { toast } = useToast();
  const router = useRouter();

  return (
    <div className="bg-gray-100 flex flex-col justify-center items-center">
      <Header />
      <div className="mt-[150px] w-2/3 flex flex-row">
        <NavUser />
        <div className="bg-white py-6 pr-8 pl-8 flex flex-col w-full">
          <div className="border-b-2 border-gray-200 pb-4">
            <div className="text-lg">Đổi mật khẩu</div>
            <div className="mt-2">
              Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người
              khác
            </div>
          </div>
          <div className="flex justify-center flex-col items-center">
            <div className="w-2/3">
              <FormProvider {...formContext}>
                <div className="mt-4">
                  <PasswordField
                    name="oldPassword"
                    label="oldPassword"
                    placeholder="oldPassword"
                  />
                </div>
                <div className="mt-4">
                  <PasswordField
                    name="newPassword"
                    label="newPassword"
                    placeholder="newPassword"
                  />
                </div>
                <div className="mt-4">
                  <PasswordField
                    name="rePassword"
                    label="rePassword"
                    placeholder="rePassword"
                  />
                </div>
              </FormProvider>
              <Button
                className="mt-6 px-6 py-2  bg-green-500 text-white w-full"
                onClick={handleSubmit(async (data: any) => {
                  const { oldPassword, newPassword, rePassword } = data;
                  if (newPassword !== rePassword) {
                    toast({ title: "Mật khẩu không trùng khớp" });
                    return;
                  }
                  const dataReturn = await axios.post(
                    `/changePassword/customer`,
                    {
                      oldPassword,
                      newPassword,
                      rePassword,
                    }
                  );

                  if (dataReturn) {
                    toast({ title: "Đổi mật khẩu thành công" });
                  } else {
                    toast({ title: "Đổi mật khẩu thất bại" });
                  }
                })}
              >
                Luu
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
