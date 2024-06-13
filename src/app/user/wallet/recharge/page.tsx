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
import NavUser from "@/module/base/navUser";

export default function Page() {
  const { user } = useAuthContext();
  const [amountMoney, setAmountMoney] = useState(0);
  const [wallet, setWallet] = useState<any>({});
  const [urlVnpay, setUrlVnpay] = useState<any>("");
  const listAuto = [
    { label: "10.000", value: 10000 },
    { label: "20.000", value: 20000 },
    { label: "50.000", value: 50000 },
    { label: "100.000", value: 100000 },
    { label: "200.000", value: 200000 },
    { label: "500.000", value: 500000 },
    { label: "1.000.000", value: 1000000 },
    { label: "2.000.000", value: 2000000 },
  ];

  const listLinkBank = [
    `https://apithanhtoan.com/wp-content/uploads/2020/08/Logo-ngan-hang-BIDV.png`,
    `data:image/jpeg;base64,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`,
    `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxi4_1Z3wbS1__f61zw84rjbFKvR4t3ImgHA&s`,
    `data:image/png;base64,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`,
    `https://rubee.com.vn/wp-content/uploads/2022/01/logo-vietinbank.jpg`,
    `data:image/jpeg;base64,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`
];

  useEffect(() => {
    async function fetchWallet() {
      const data = await axios
        .get(`wallet-of-user`)
        .then((res) => res)
        .catch((e) => console.log(e));

      setWallet(data);
    }

    fetchWallet();
  }, []);

  useEffect(() => {
    async function fetchVnpay() {
      if (!amountMoney) {
        return;
      }
      let Url = await axios
        .post(`vnPay`, {
          amount_money: `${amountMoney}`,
        })
        .then((res) => res)
        .catch((e) => console.log(e));

      Url = await Url;

      setUrlVnpay(Url);
    }

    fetchVnpay();
  }, [amountMoney]);

  const router = useRouter();

  return (
    <div className="bg-gray-100 flex flex-col justify-center items-center">
      <Header />
      <div className="mt-[150px] w-2/3 flex flex-row">
        <NavUser />
        <div className="flex flex-col w-full bg-white">
          <div className="px-6 py-4 flex flex-col gap-y-2 border-b-[1px] border-gray-300">
            <div className="text-lg">Vi cua toi</div>
            <div>Nap tien vao LunaShop thong qua VNPay</div>
          </div>
          <div className="grid grid-cols-7 mt-4">
            <div className="col-span-4 px-6 flex flex-col ">
              <div className="py-2 px-4 rounded-md flex flex-row bg-gray-100 gap-x-3 items-center">
                <div>
                  <img
                    className="h-12 w-auto"
                    src="https://static.wixstatic.com/media/2cd43b_17040a042929442094fd1a2179d5bd29~mv2.png/v1/fill/w_320,h_320,q_90/2cd43b_17040a042929442094fd1a2179d5bd29~mv2.png"
                    alt=""
                  />
                </div>
                <div className="flex flex-col gap-y-1">
                  <div>So du vi (VND)</div>
                  <div className="font-semibold">{wallet?.amountMoney}</div>
                </div>
              </div>
              <div className="mt-6">
                <div className="my-2 text-lg">So tien nap (VND)</div>
                <input
                  type="number"
                  className="w-20 h-8 border border-gray-300 rounde-md px-4 py-4 w-full flex flex-row  focus:outline-none"
                  value={amountMoney}
                  placeholder="Nhap so tien"
                  onChange={(e: any) => {
                    if (e.target.value < 0) {
                      return;
                    }
                    setAmountMoney(e.target.value);
                  }}
                />
                <div className="grid grid-cols-4 gap-x-4 mt-4 gap-y-4">
                  {listAuto.map((item) => (
                    <div
                      key={item.value}
                      className="py-2 justify-center hover:bg-gray-200 px-4 rounded-md flex flex-row bg-gray-100 gap-x-3 items-center cursor-pointer"
                      onClick={() => {
                        setAmountMoney(item.value);
                      }}
                    >
                      <div>{item.label}</div>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full bg-green-600 text-white hover:bg-green-500 mt-6"
                  onClick={() => {
                    router.push(urlVnpay);
                  }}
                >
                  Thanh toan
                </Button>
              </div>
              <div></div>
            </div>
            <div className="col-span-3 flex flex-col">
              <div className="my-2">Goi y ngan hang lien ket truc tiep</div>
              <div className="text-sm font-light">
                Lien ket voi cac tai khoan ngan hang duoi day de thuc hien giao
                dich duoc nhanh cho va mien phi Nap tien, thanh toan, rut tien
              </div>
              <div className="grid grid-cols-4 mt-4 gap-y-4">
                {listLinkBank.map((item: any, index: number) => (
                  <div className="flex justify-center items-center" key={index}>
                    <div
                      key={index}
                      className="rounded-full flex justify-center items-center border-[1px] border-gray-300 p-2"
                    >
                      <img
                        src={item}
                        className="rounded-full w-12 h-12"
                        alt="img"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">Tinh nang se som ra mat</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
