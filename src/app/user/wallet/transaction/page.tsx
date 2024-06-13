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
import { Button } from "@/components/ui/button";
import TransactionCard from "@/module/base/TransactionCard";

export default function Page() {
  const { user } = useAuthContext();
  const [selectedPage, setSelectedPage] = useState(1);
  const [listTransaction, setListTransaction] = useState<any>([]);

  useEffect(() => {
    async function fetchWallet() {
      const data = await axios.get(`transactions`, {
        params: {
          filter: {
            order: "createdAt DESC",
            where: {
              idOfUser: user?.id,
            },
          },
        },
      });

      console.log(data);

      setListTransaction(data);
    }

    fetchWallet();
  }, [user?.id]);

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
                <div className="hover:cursor-grab">Ho so</div>
                <div
                  className="hover:cursor-grab hover:text-green-600"
                  onClick={() => {
                    router.push("/user/account/address");
                  }}
                >
                  Dia chi
                </div>
                <div className="hover:cursor-grab hover:text-green-600">
                  Doi mat khau
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 flex flex-row gap-x-4">
            <div>
              <ListAltIcon />{" "}
            </div>
            <div className="flex flex-col gap-y-4 py-1 hover:cursor-grab hover:text-green-600 text-green-600">
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
        <div className="flex flex-col w-full bg-white">
          <div className="px-6 py-4 flex flex-col gap-y-2 border-b-[1px] border-gray-300">
            <div className="text-lg">Lich su giao dich</div>
            <div>Nap tien vao LunaShop thong qua VNPay</div>
          </div>
          <div className="flex flex-col w-full">
            <div className="flex flex-row w-full bg-white ">
              <div
                className={`w-1/3 flex justify-center items-center py-2 hover:cursor-grab${
                  selectedPage == 1 ? ` border-b-4 border-green-600` : ``
                }`}
                onClick={() => {
                  setSelectedPage(1);
                }}
              >
                Tat ca
              </div>
              <div
                className={`w-1/3 flex justify-center items-center py-2 hover:cursor-grab ${
                  selectedPage == 2 ? ` border-b-4 border-green-600` : ``
                }`}
                onClick={() => {
                  setSelectedPage(2);
                }}
              >
                Tien vao
              </div>
              <div
                className={`w-1/3 flex justify-center items-center py-2 hover:cursor-grab${
                  selectedPage == 3 ? ` border-b-4 border-green-600` : ``
                }`}
                onClick={() => {
                  setSelectedPage(3);
                }}
              >
                Tien ra
              </div>
            </div>

            {selectedPage == 1 &&
              listTransaction &&
              listTransaction?.map((item: any, index: number) => {
                return <TransactionCard transaction={item} key={index} />;
              })}

            {selectedPage == 1 && listTransaction?.lenght == 0 && (
              <div className="text-center h-[60vh] flex items-center justify-center bg-white mt-4">
                Khong co giao dich nao
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
