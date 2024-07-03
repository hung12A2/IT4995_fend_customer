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
import { useRouter } from "next/navigation";
import { list } from "postcss";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderCard from "@/module/base/OrderCard";
import NavUser from "@/module/base/navUser";

function formatDate(date: string) {
  const dateObj = new Date(date);

  const formattedDate = `${dateObj
    .toLocaleTimeString("vi-VN")
    .slice(0, 5)} ${dateObj.toLocaleDateString("vi-VN")}`;

  return formattedDate;
}

export default function Page() {
  const { user } = useAuthContext();
  const [listNoti, setListNoti] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res: any = await axios
        .get(`notifications`, {
          params: {
            filter: {
              order: "createdAt DESC",
              where: {
                idOfUser: user?.id,
              },
            },
          },
        })
        .then((res) => res.data)
        .catch((e) => console.log(e));
      setListNoti(res);
    }

    fetchData();
  }, [user?.id]);

  const router = useRouter();

  return (
    <div className="bg-gray-100 flex flex-col justify-center items-center">
      <Header />
      <div className="mt-[150px] w-2/3 flex flex-row">
        <NavUser />
        <div className="flex flex-col w-full bg-white mb-12">
          <div className="px-4 py-4 border-b-[1px] border-gray-300 text-gray-500">
            Thông báo don hang
          </div>
          <div>
            {listNoti &&
              listNoti?.map((item: any) => {
                return (
                  <div
                    onClick={() => {
                      if (!item?.idOfOrder.includes("VNP")) {
                        router.push(`/user/purchase/order/${item?.idOfOrder}`);
                      } else {
                        router.push(
                          `/user/wallet/rechargesuccess?${
                            item?.idOfOrder.split("-")[1]
                          }`
                        );
                      }
                    }}
                    key={item?.id}
                    className="px-4 py-4 border-b-[1px] border-gray-200 hover:cursor-pointer hover:bg-gray-100 flex flex-row justify-between"
                  >
                    <div className="flex flex-row gap-x-4 ">
                      <img
                        src={
                          item?.image?.url ||
                          "https://nld.mediacdn.vn/291774122806476800/2022/12/28/avatar-the-way-of-water-1670943667-1672220380184583234571.jpeg"
                        }
                        alt="img"
                        className="w-20 h-20"
                      />
                      <div className="flex flex-col">
                        <div className="">{item?.title}</div>
                        <div className="text-sm font-light mt-2">
                          {item?.content}{" "}
                        </div>
                        <div className="text-sm font-light mt-1">
                          {formatDate(item?.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="w-[250px] flex justify-end">
                      <div className="text-sm px-2 py-1 border-[1px] h-fit border-gray-300">
                        Xem chi tiet
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
