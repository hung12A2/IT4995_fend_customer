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
        <div className="mr-8">
          <div className="flex flex-row gap-x-4 justify-center ">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user?.avatar?.url} />
              <AvatarFallback>HN</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {user?.fullName || "Hung Nguyen"}
              </div>
              <div className="flex flex-row gap-x-1">
                <EditIcon color="disabled" fontSize="small" />
                <div className="text-gray-500 w-[92px]">Sua ho so</div>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-row gap-x-4">
            <div>
              <Person2Icon />{" "}
            </div>
            <div className="flex flex-col gap-y-4 py-1">
              <div>Tai khoan cua toi</div>
              <div className="ml-2 text-gray-600 gap-y-4 flex flex-col">
                <div className="hover:cursor-grab hover:text-green-600">
                  Ho so
                </div>
                <div
                  className="hover:cursor-grab hover:text-green-600"
                  onClick={() => {
                    router.push("/user/account/address");
                  }}
                >
                  Dia chi
                </div>
                <div className="hover:cursor-grab text-green-600">
                  Doi mat khau
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 flex flex-row gap-x-4">
            <div>
              <ListAltIcon />{" "}
            </div>
            <div className="flex flex-col gap-y-4 py-1 hover:cursor-grab hover:text-green-600">
              Don mua
            </div>
          </div>
          <div className="mt-2 flex flex-row gap-x-4">
            <div>
              <NotificationsIcon />{" "}
            </div>
            <div className="flex flex-col gap-y-4 py-1 hover:cursor-grab hover:text-green-600">
              Thong bao
            </div>
          </div>
        </div>
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
