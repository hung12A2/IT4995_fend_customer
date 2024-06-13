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
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import axios from '../../../../module/AxiosCustom/custome_Axios'

function formatDate(dateStr: string) {
  const formattedDate = `${dateStr.slice(8, 10)}:${dateStr.slice(
    10,
    12
  )} ${dateStr.slice(6, 8)}-${dateStr.slice(4, 6)}-${dateStr.slice(0, 4)}`;

  return formattedDate;
}

export default function Page() {
  const { user } = useAuthContext();
  const searchParams = useSearchParams();

  let vnPayAmount:any = searchParams.get("vnp_Amount") ;
  vnPayAmount = vnPayAmount ? +vnPayAmount/100 : 0;
  const vnPayBankCode = searchParams.get("vnp_BankCode");
  const vnPayBankTranNo = searchParams.get("vnp_BankTranNo");
  const vnPayCardType = searchParams.get("vnp_CardType");
  const vnPayOrderInfo = searchParams.get("vnp_OrderInfo");
  const vnPayPayDate = searchParams.get("vnp_PayDate");

  useEffect(() => {
    async function fetchWallet() {
      const data = await axios.post(`wallet-of-user/update`, {
        type: 'charge',
        amountMoney: vnPayAmount,
        vnpayCode: `${vnPayBankTranNo}-${window.location.href.split('?')[1]}`
      })

      console.log(data)
    }

    fetchWallet();
  }, [vnPayAmount, vnPayBankTranNo]);

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
            <div className="text-lg">Thong tin thanh toan </div>
            <div>Nap tien vao LunaShop thong qua VNPay</div>
          </div>

          <div className="flex justify-center py-8">
            <div className="w-1/2 border-[1px] border-gray-300 flex flex-col ">
              <div className="flex justify-center py-6 px-6">
                <div className="flex flex-col items-center justify-center rounded-lg  border-[1px] border-gray-400 gap-y-2 py-4 w-full">
                  <div className="text-sm font-light">Tong tien</div>
                  <div className="text-xl font-semibold">
                    +{vnPayAmount} VND
                  </div>
                  <div className="px-4 py-1 rounded-lg bg-green-600 text-white">
                    Thanh cong
                  </div>
                </div>
              </div>
              <div className="px-6 flex flex-col">
                <div className="text-lg font-semibold">Thong tin giao dich</div>
                <div className="flex flex-row justify-between py-4 border-b-[1px] border-gray-200">
                  <div className="font-light">Ma giao dich</div>
                  <div className="font-semibold">{vnPayBankTranNo}</div>
                </div>
                <div className="flex flex-row justify-between py-4 border-b-[1px] border-gray-200">
                  <div className="font-light">Thoi gian giao dich</div>
                  <div className="font-semibold">
                    {formatDate(vnPayPayDate || "")}
                  </div>
                </div>
                <div className="flex flex-row justify-between py-4 border-b-[1px] border-gray-200">
                  <div className="font-light">So tien (VND)</div>
                  <div className="font-semibold">{vnPayAmount}</div>
                </div>
                <div className="flex flex-row justify-between py-4 border-b-[1px] border-gray-200">
                  <div className="font-light">Noi dung</div>
                  <div className="font-semibold">{vnPayOrderInfo}</div>
                </div>
              </div>
              <div className="px-6 flex flex-col mt-8">
                <div className="text-lg font-semibold">Thong tin nap tien</div>
                <div className="flex flex-row justify-between py-4 border-b-[1px] border-gray-200">
                  <div className="font-light">Ten ngan hang </div>
                  <div className="font-semibold">{vnPayBankCode}</div>
                </div>
                <div className="flex flex-row justify-between py-4 border-b-[1px] border-gray-200">
                  <div className="font-light">Loai tai khoan thanh toan</div>
                  <div className="font-semibold">{vnPayCardType}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}