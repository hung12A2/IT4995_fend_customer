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
import axios from "../../../module/AxiosCustom/custome_Axios";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { list } from "postcss";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderCard from "@/module/base/OrderCard";

export default function Page() {
  const { user } = useAuthContext();
  const [ordersData, setOrdersData] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [canceledOrders, setCanceledOrders] = useState([]);
  const [shippingOrders, setShippingOrders] = useState([]);
  const [returnOrders, setReturnOrders] = useState([]);
  const [selectedPage, setSelectedPage] = useState(1);
  const router = useRouter();
  useEffect(() => {
    async function fetchData() {
      let dataReturn: any = await axios
        .get(`orders`)
        .then((res) => res)
        .catch((e) => console.log(e));

        console.log(dataReturn);

      const listIdShop = dataReturn?.map((item: any) => item.idOfShop);
      const listIdOrder = dataReturn?.map((item: any) => item.listIdOrder);

      const dataShop: any = await axios.get(`stores`, {
        params: {
          filter: {
            where: {
              id: {
                inq: listIdShop,
              },
            },
          },
        },
      });

      let listProductInOrder: any = await axios
        .get(`products-in-orders`, {
          params: {
            filter: {
              where: {
                idOfOrder: {
                  inq: listIdOrder,
                },
              },
            },
          },
        })
        .then((res) => res)
        .catch((e) => console.log(e));

      const listIdProduct = listProductInOrder.map(
        (item: any) => item.idOfProduct
      );

      const listProduct: any = await axios.get(`products`, {
        params: {
          filter: {
            where: {
              id: {
                inq: listIdProduct,
              },
            },
          },
        },
      });

      listProductInOrder = listProductInOrder.map((item: any) => {
        const product = listProduct.find(
          (product: any) => product.id === item.idOfProduct
        );
        return {
          ...item,
          product,
        };
      });

      dataReturn = dataReturn.map((item: any) => {
        const shop = dataShop.find((shop: any) => shop.id === item.idOfShop);
        const listProduct = listProductInOrder.filter(
          (product: any) => product.idOfOrder === item.id
        );
        return {
          ...item,
          shop,
          items: listProduct,
        };
      });

      let dataReturnCompleted = dataReturn.filter(
        (item: any) => item.status === "received" || item.status === "completed"
      );
      let dataReturnCaceled = dataReturn.filter(
        (item: any) => item.status === "canceled"
      );
      let dataReturned = dataReturn.filter(
        (item: any) => item.status === "returned"
      );
      let dataReturnShipping = dataReturn.filter(
        (item: any) =>
          item.status !== "received" &&
          item.status !== "rating" &&
          item.status !== "canceled" &&
          item.status !== "returned"
      );

      setCompletedOrders(dataReturnCompleted);
      setCanceledOrders(dataReturnCaceled);
      setReturnOrders(dataReturned);
      setShippingOrders(dataReturnShipping);

      setOrdersData(dataReturn);
    }

    fetchData();
  }, []);

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
        <div className="flex flex-col w-full">
          <div className="flex flex-row w-full bg-white ">
            <div
              className={`w-1/5 flex justify-center items-center py-2 hover:cursor-grab${
                selectedPage == 1 ? ` border-b-4 border-green-600` : ``
              }`}
              onClick={() => {
                setSelectedPage(1);
              }}
            >
              Tat ca
            </div>
            <div
              className={`w-1/5 flex justify-center items-center py-2 hover:cursor-grab ${
                selectedPage == 2 ? ` border-b-4 border-green-600` : ``
              }`}
              onClick={() => {
                setSelectedPage(2);
              }}
            >
              Dang van chuyen
            </div>
            <div
              className={`w-1/5 flex justify-center items-center py-2 hover:cursor-grab${
                selectedPage == 3 ? ` border-b-4 border-green-600` : ``
              }`}
              onClick={() => {
                setSelectedPage(3);
              }}
            >
              Hoan thanh
            </div>
            <div
              className={`w-1/5 flex justify-center items-center py-2 hover:cursor-grab${
                selectedPage == 4 ? ` border-b-4 border-green-600` : ``
              }`}
              onClick={() => {
                setSelectedPage(4);
              }}
            >
              Da huy
            </div>
            <div
              className={`w-1/5 flex justify-center items-center py-2 hover:cursor-grab${
                selectedPage == 5 ? ` border-b-4 border-green-600` : ``
              }`}
              onClick={() => {
                setSelectedPage(5);
              }}
            >
              Tra hang/Hoan tien
            </div>
          </div>
          {selectedPage == 1 &&
            ordersData &&
            ordersData.map((item: any, index: number) => {
              return <OrderCard order={item} key={index} />;
            })}
          {selectedPage == 1 && ordersData.length == 0 && (
            <div className="text-center h-[60vh] flex items-center justify-center bg-white mt-4">
              Khong co don hang nao
            </div>
          )}
          {selectedPage == 2 &&
            shippingOrders &&
            shippingOrders.map((item: any, index: number) => {
              return <OrderCard order={item} key={index} />;
            })}
          {selectedPage == 2 && shippingOrders.length == 0 && (
            <div className="text-center h-[60vh] flex items-center justify-center bg-white mt-4">
              Khong co don hang nao
            </div>
          )}
          {selectedPage == 3 &&
            completedOrders &&
            completedOrders.map((item: any, index: number) => {
              return <OrderCard order={item} key={index} />;
            })}
          {selectedPage == 3 && completedOrders.length == 0 && (
            <div className="text-center h-[60vh] flex items-center justify-center bg-white mt-4">
              Khong co don hang nao
            </div>
          )}
          {selectedPage == 4 &&
            canceledOrders &&
            canceledOrders.map((item: any, index: number) => {
              return <OrderCard order={item} key={index} />;
            })}
          {selectedPage == 4 && canceledOrders.length == 0 && (
            <div className="text-center h-[60vh] flex items-center justify-center bg-white mt-4">
              Khong co don hang nao
            </div>
          )}
          {selectedPage == 5 &&
            returnOrders &&
            returnOrders.map((item: any, index: number) => {
              return <OrderCard order={item} key={index} />;
            })}
          {selectedPage == 5 && returnOrders.length == 0 && (
            <div className="text-center h-[60vh] flex items-center justify-center bg-white mt-4">
              Khong co don hang nao
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
