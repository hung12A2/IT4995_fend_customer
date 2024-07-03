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
import {
  DatePickerForm,
  EmailField,
  SelectField,
  TextField,
} from "@/module/base/fieldBase";
import axios from "../../../../module/AxiosCustom/custome_Axios";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useRef, useState } from "react";
import { set } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import NavUser from "@/module/base/navUser";

export default function Page() {
  const { user } = useAuthContext();
  const formContext = useForm({});
  const [open, setOpen] = useState(false);
  const [imgFile, setImgFile] = useState<any>();
  const [imgLink, setImgLink] = useState("");
  const [update, setUpdate] = useState(false);
  const { handleSubmit, control, setValue } = formContext;
  const { toast } = useToast();
  const router = useRouter();
  useEffect(() => {
    async function fetchData() {
      if (user) {
        setValue("email", user.email);
        setValue("fullName", user.fullName);
        setValue("phoneNumber", user.phoneNumber);
        setValue("gender", {
          value: user?.gender,
          label: user?.gender,
        });
      }
    }

    fetchData();
  }, [setValue, user]);

  const fileInputRef: any = useRef(null);
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      setImgLink(URL.createObjectURL(file));
      setOpen(true);
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col justify-center items-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Preview Avatar</DialogTitle>

          <DialogDescription className="flex justify-center items-center">
            <Avatar onClick={handleUploadClick} className="w-40 h-40">
              <AvatarImage src={imgLink} />
              <AvatarFallback>HN</AvatarFallback>
            </Avatar>
          </DialogDescription>

          <DialogFooter>
            <Button
              variant={"destructive"}
              className="mr-4"
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                let formData = new FormData();
                formData.append("avatar", imgFile);
                const res: any = await axios
                  .post(`uploadAvatar/user`, formData, {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  })
                  .then((res) => res)
                  .catch((e) => console.log(e));

                if (res?.code == 200) {
                  toast({
                    title: "Thay đổi avt thanh cong",
                  });
                } else {
                  toast({
                    title: "Thay đổi avt that bai",
                    description:
                      "Dung luong file toi da 1Mb, Dinh dang: JEPG, PNG",
                  });
                }
                setOpen(false);
                setUpdate(!update);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      <Header />
      <div className="mt-[150px] w-2/3 flex flex-row">
        <NavUser />
        <div className="bg-white py-6 pr-8 pl-8 flex flex-col w-full">
          <div className="border-b-2 border-gray-200 pb-4">
            <div className="text-lg">Ho so cua toi</div>
            <div className="mt-2">
              Quan ly thong tin ho so de bao mat tai khoan
            </div>
          </div>
          <div className="grid grid-cols-7">
            <div className="col-span-4">
              <FormProvider {...formContext}>
                <div className="mt-4">
                  <EmailField
                    name="email"
                    label="Email"
                    placeholder="Email"
                    disabled={true}
                  />
                </div>
                <div className="mt-4">
                  <TextField
                    name="fullName"
                    label="Full Name"
                    placeholder="Full Name"
                  />
                </div>
                <div className="mt-4">
                  <TextField
                    name="phoneNumber"
                    label="Phone Number"
                    placeholder="Phone Number"
                  />
                </div>
                <div className="mt-4">
                  <SelectField
                    name="gender"
                    label="Gender"
                    placeholder="Gender"
                    options={[
                      {
                        value: "Nam",
                        label: "Nam",
                      },
                      {
                        value: "Nu",
                        label: "Nu",
                      },
                      {
                        value: "Khac",
                        label: "Khac",
                      },
                    ]}
                  />
                </div>
                {/* <div className="mt-4">
                  <DatePickerForm
                    name="dateOfBirth"
                    label="Date of Birth"
                    placeholder="Date of Birth"
                  />
                </div> */}
              </FormProvider>
              <div
                className="mt-6 px-6 py-2 bg-green-500 text-white w-fit"
                onClick={handleSubmit(async (data: any) => {
                  let { fullName, phoneNumber, gender } = data;
                  gender = gender.value;
                  const dataReturn: any = await axios.post(`/update/customer`, {
                    fullName,
                    phoneNumber,
                    gender,
                  });

                  if (dataReturn?.code == 200) {
                    toast({
                      title: "Update thanh cong",
                    });
                  } else {
                    toast({
                      title: "Update that bai",
                    });
                  }
                })}
              >
                Luu
              </div>
            </div>
            <div className="col-span-3 flex flex-col justify-center gap-y-6 items-center">
              <Avatar onClick={handleUploadClick} className="w-28 h-28">
                <AvatarImage src={!update ? user?.avatar?.url : imgLink} />
                <AvatarFallback>HN</AvatarFallback>
              </Avatar>
              <div
                className="py-2 px-4 border-[1px] border-gray-300 rounded-sm hover:cursor-grab hover:bg-gray-100"
                onClick={handleUploadClick}
              >
                Chon Anh
              </div>
              <div className="text-gray-400 flex flex-col">
                <div>Dung luong file toi da 1Mb</div>
                <div>Dinh dang: JEPG, PNG</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
