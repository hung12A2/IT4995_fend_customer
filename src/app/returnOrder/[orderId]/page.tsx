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
import axios from "../../../module/AxiosCustom/custome_Axios";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { list } from "postcss";
import OrderCard from "@/module/base/OrderCard";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AllInboxIcon from "@mui/icons-material/AllInbox";
import StarIcon from "@mui/icons-material/Star";
import { cn } from "@/lib/utils";
import StoreIcon from "@mui/icons-material/Store";
import ChatIcon from "@mui/icons-material/Chat";
import Chat from "@/module/chat/chat";
import NavUser from "@/module/base/navUser";
import { set } from "date-fns";

function formatDate(date: string) {
  const dateObj = new Date(date);

  const formattedDate = `${dateObj
    .toLocaleTimeString("vi-VN")
    .slice(0, 5)} ${dateObj.toLocaleDateString("vi-VN")}`;

  return formattedDate;
}

export default function Page() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [orderData, setOrderData] = useState<any>({});
  const [returnOrderData, setReturnOrderData] = useState<any>({});
  const type = useSearchParams().get("type") || "online";
  const orderId = useParams().orderId;

  useEffect(() => {
    async function fetchData() {
      if (type == "kiot") {
        let data: any = await axios
          .get("ordersKiot", {
            params: {
              filter: {
                where: {
                  id: orderId,
                },
              },
            },
          })
          .then((res) => res.data[0])
          .catch((e) => console.log(e));

        const productInOrder: any = await axios
          .get(`products-in-order-kiots`, {
            params: {
              filter: {
                where: {
                  idOfOrder: orderId,
                },
              },
            },
          })
          .then((res) => res)
          .catch((e) => console.log(e));

        const productInOrderId = productInOrder?.map(
          (product: any) => product.idOfProduct
        );
        let listItems: any = await axios.get(`products`, {
          params: {
            filter: {
              where: {
                id: {
                  inq: productInOrderId,
                },
              },
            },
          },
        });

        listItems = listItems?.map((item: any) => {
          return {
            ...item,
            quantity: productInOrder.find(
              (product: any) => product.idOfProduct == item.id
            ).quantity,
          };
        });

        const dataShop = await axios
          .get(`kiots/${data?.idOfKiot}`)
          .then((res) => res)
          .catch((e) => console.log(e));

        setOrderData({
          ...data,
          shop: dataShop,
          items: listItems,
        });

        let returnOrderData: any = await axios.get("return-orders", {
          params: {
            filter: {
              where: {
                idOfOrder: orderId,
                isKiot: true,
              },
            },
          },
        });

        setReturnOrderData(returnOrderData[0]);
      } else {
        const data: any = await axios
          .get("/orders", {
            params: {
              filter: {
                where: {
                  id: orderId,
                },
              },
            },
          })
          .then((res: any) => res[0])
          .catch((e) => console.log(e));

        const productInOrder: any = await axios
          .get(`products-in-orders`, {
            params: {
              filter: {
                where: {
                  idOfOrder: orderId,
                },
              },
            },
          })
          .then((res) => res)
          .catch((e) => console.log(e));

        const productInOrderId = productInOrder?.map(
          (product: any) => product.idOfProduct
        );
        let listItems: any = await axios.get(`products`, {
          params: {
            filter: {
              where: {
                id: {
                  inq: productInOrderId,
                },
              },
            },
          },
        });

        listItems = listItems?.map((item: any) => {
          return {
            ...item,
            quantity: productInOrder.find(
              (product: any) => product.idOfProduct == item.id
            ).quantity,
          };
        });

        const dataShop = await axios
          .get(`stores/${data?.idOfShop}`)
          .then((res) => res)
          .catch((e) => console.log(e));

        setOrderData({
          ...data,
          shop: dataShop,
          items: listItems,
        });

        let returnOrderData: any = await axios.get("return-orders", {
          params: {
            filter: {
              where: {
                idOfOrder: orderId,
                isKiot: false,
              },
            },
          },
        });

        setReturnOrderData(returnOrderData[0]);
      }
    }

    fetchData();
  }, [orderId, type]);

  return (
    <div className="bg-gray-100 flex flex-col justify-center items-center">
      <Header />
      <Chat />
      <div className="mt-[150px] w-2/3 flex flex-row">
        <NavUser />
        <div className="flex flex-col w-full">
          <div className="flex flex-row justify-between  bg-white items-center px-4 py-4 border-b-[1px] border-gray-200">
            <div
              className="flex items-center hover:cursor-grab"
              onClick={() => {
                router.back();
              }}
            >
              <NavigateBeforeIcon /> Trở lại
            </div>
            <div className="flex flex-row items-center">
              <div className="pr-4 text-sm">
                MA HOÀN HÀNG: {returnOrderData?.id?.slice(1, 13).toUpperCase()}
              </div>
            </div>
          </div>
          <div className="px-6 py-4 flex flex-col  bg-white">
            <div className="mt-8 flex flex-col pb-4 border-b-[1px] border-gray-200">
              <div className="flex flex-row gap-x-2">
                <StoreIcon />
                <div>{orderData?.shop?.name}</div>
                <div className="px-2 hover:cursor-grab hover:bg-green-500 bg-green-600 text-white text-sm">
                  <ChatIcon fontSize="small" /> Chat
                </div>
                <div
                  className="px-2 hover:cursor-grab hover:bg-green-100 border-gray-300 border-[1px] text-sm"
                  onClick={() => {
                    if (type == "online") {
                      router.push(`/shop/${orderData?.shop?.id}`);
                    }
                  }}
                >
                  <StoreIcon fontSize="small" /> Xem shop
                </div>
              </div>
              <div className="">
                {orderData?.items &&
                  orderData?.items.map((item: any) => {
                    const product = item;
                    return (
                      <div
                        className="py-4 border-b-[1px] border-gray-300 flex justify-between items-center"
                        key={item.id}
                      >
                        <div className="flex flex-row gap-x-2">
                          <img
                            src={product?.image[0].url}
                            alt="img"
                            className="w-20 aspect-square rounded-sm"
                          />
                          <div className="flex flex-col gap-y-1">
                            <div>{product?.name}</div>
                            <div>x{item?.quantity}</div>
                            <div className="text-sm text-green-600 border-green-600 border-[1px] px-1">
                              Trả hàng miễn phí 15 ngày
                            </div>
                          </div>
                        </div>
                        <div>{product?.price}d</div>
                      </div>
                    );
                  })}
                <div className="mt-0 flex flex-col justify-end items-end">
                  <div className="flex flex-row-reverse ">
                    <div className="w-[250px] border-l-[1px] border-gray-300 w-full flex justify-end py-2">
                      {orderData?.priceOfAll - orderData?.totalFee}d
                    </div>
                    <div className="flex items-center pr-6 text-sm">
                      Tổng tiền hàng
                    </div>
                  </div>
                  <div className="flex flex-row-reverse border-t-[1px] border-gray-300 w-full">
                    <div className="w-[250px] border-l-[1px] border-gray-300 flex justify-end py-2">
                      {orderData?.totalFee}d
                    </div>
                    <div className="flex items-center pr-6 text-sm">
                      Phí vận chuyển
                    </div>
                  </div>
                  <div className="flex flex-row-reverse border-y-[1px] border-gray-300 w-full">
                    <div className="w-[250px] border-l-[1px] border-gray-300 flex justify-end py-2">
                      {orderData?.priceOfAll}d
                    </div>
                    <div className="flex items-center pr-6 text-sm">
                      Thành tiền
                    </div>
                  </div>
                  <div className="flex flex-row-reverse border-y-[1px] border-gray-300 w-full">
                    <div className="w-[250px] border-l-[1px] border-gray-300 flex justify-end py-2">
                      {orderData?.paymentMethod == "code"
                        ? 0
                        : orderData?.priceOfAll}
                      d
                    </div>
                    <div className="flex items-center pr-6 text-sm">
                      Đề xuất số tiền hoàn lại
                    </div>
                  </div>
                  <div className="flex flex-row-reverse border-y-[1px] border-gray-300 w-full">
                    <div className="w-[250px] border-l-[1px] border-gray-300 flex justify-end py-2">
                      {orderData?.paymentMethod == "code"
                        ? 0
                        : orderData?.priceOfAll}
                      d
                    </div>
                    <div className="flex items-center pr-6 text-sm">
                      Số tiền hoàn nhận được
                    </div>
                  </div>
                  <div className="flex flex-row-reverse border-y-[1px] border-gray-300 w-full">
                    <div className="w-[250px] border-l-[1px] border-gray-300 flex justify-end py-2">
                      Số dư tài khoản LunaShop
                    </div>
                    <div className="flex items-center pr-6 text-sm">
                      Hoàn tiền vào
                    </div>
                  </div>
                </div>
                <div className="flex flex-row-reverse border-y-[1px] border-gray-300 w-full">
                  <div className="w-[250px] border-l-[1px] border-gray-300 flex justify-end py-2">
                    {orderData?.paymentMethod == "cod"
                      ? "Thanh toan khi nhận hàng"
                      : "Thanh toan online"}
                  </div>
                  <div className="flex items-center pr-6 text-sm">
                    Phương thức thanh toán
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 mt-2 py-4 flex flex-col gap-y-2 bg-white">
            <div>Lý do: {returnOrderData?.reason}</div>
            <div>Hình ảnh: </div>
            <div className="flex flex-row gap-x-6">
              {returnOrderData?.images?.map((image: any, index: number) => {
                return (
                  <img
                    key={index}
                    alt="img"
                    src={image?.url}
                    className="w-[100px] h-[100px]"
                  ></img>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
