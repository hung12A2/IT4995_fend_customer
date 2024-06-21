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
import axios from "../../../../../module/AxiosCustom/custome_Axios";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

function formatDate(date: string) {
  const dateObj = new Date(date);

  const formattedDate = `${dateObj
    .toLocaleTimeString("vi-VN")
    .slice(0, 5)} ${dateObj.toLocaleDateString("vi-VN")}`;

  return formattedDate;
}

function translateStatus(status: string) {
  switch (status) {
    case "pending":
      return "Don hang da duoc tao thanh cong";
    case "accepted":
      return "Da chap nhan don hang";
    case "prepared":
      return "Don hang da duoc chuan bi xong";
    case "inTransist":
      return "Don hang da duoc ban giao cho don vi van chuyen";
    case "inTransist2":
      return "Don hang dang tren duong giao den ban";
    case "delivered":
      return "Don hang da duoc giao thanh cong";
    case "received":
      return "Don hang da duoc nhan";
    case "returned":
      return "Don hang da duoc tra";
    case "rating":
      return "Don hang da duoc danh gia";
  }
}

function checkStep(status: string, currentStep: string) {
  function numberStep(status: string) {
    switch (status) {
      case "ordered":
        return 1;
      case "accepted":
        return 2;
      case "prepared":
        return 3;
      case "inTransist":
        return 4;
      case "inTransist2":
        return 5;
      case "received":
        return 6;
      case "rating":
        return 7;
      case "returned":
        return 8;
      default:
        return 0;
    }
  }

  if (numberStep(status) >= numberStep(currentStep)) {
    return true;
  } else {
    return false;
  }
}

function findStep(status: string, logs: any) {
  if (!status || !logs) return false;
  const step = logs.find((log: any) => log.status == status);
  if (!step) {
    return false;
  }
  return step;
}

export default function Page() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [orderData, setOrderData] = useState<any>({});
  const orderId = useParams().orderIdKiot;

  useEffect(() => {
    async function fetchData() {
      const data: any = await axios
        .get("/ordersKiot", {
          params: {
            filter: {
              where: {
                id: orderId,
              },
            },
          },
        })
        .then((res: any) => res.data[0])
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
    }

    fetchData();
  }, [orderId]);

  return (
    <div className="bg-gray-100 flex flex-col justify-center items-center">
      <Header />
      <Chat />
      <div className="mt-[150px] w-2/3 flex flex-row">
        <NavUser />
        <div className="flex flex-col w-full bg-white">
          <div className="flex flex-row justify-between items-center px-4 py-4 border-b-[1px] border-gray-200">
            <div
              className="flex items-center hover:cursor-grab"
              onClick={() => {
                router.back();
              }}
            >
              <NavigateBeforeIcon /> Tro lai
            </div>
            <div className="flex flex-row items-center">
              <div className="pr-4 text-sm border-r-[1px] border-gray-400">
                MA DON HANG: {orderData?.id?.slice(1, 10).toUpperCase()}
              </div>
              <div className="pl-4 text-green-600 text-sm">
                {(orderData?.status == "rating" ||
                  orderData?.status == "received") &&
                  `DON HANG DA HOAN THANH`}{" "}
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="w-full flex justify-center">
              <div className="absolute top-[65px] w-full w-3/4 flex flex-row ">
                <div className="py-[2px] bg-green-600 w-1/4"></div>
                <div className="py-[2px] bg-green-600 w-1/4"></div>
                <div className="py-[2px] bg-green-600 w-1/4"></div>
                <div className="py-[2px] bg-green-600 w-1/4"></div>
              </div>
            </div>
            <div className="px-6 py-10 grid grid-cols-5 w-full gap-y-10 relative">
              <div className="col-span-1 flex flex-col justify-start items-center">
                <div className="w-[56px] h-[56px] border-[3px] flex justify-center items-center border-green-600 rounded-full bg-white">
                  <ListAltIcon color="success" />
                </div>
                <div className="text-sm mt-4">Don Hang Da Dat</div>
                <div className="text-sm font-light mt-2">
                  {formatDate(
                    findStep("pending", orderData?.logs).updatedAt || ""
                  )}
                </div>
              </div>
              <div className="col-span-1 flex  flex-col items-center">
                <div className="w-[56px] h-[56px] border-[3px] flex justify-center items-center border-green-600 rounded-full  bg-white ">
                  <AttachMoneyIcon color="success" />
                </div>

                {findStep("accepted", orderData?.logs) ? (
                  <>
                    <div className="text-sm mt-4">Da Chap Nhan Don Hang</div>
                    <div className="text-sm font-light mt-2">
                      {formatDate(
                        findStep("accepted", orderData?.logs).updatedAt || ""
                      )}
                    </div>{" "}
                  </>
                ) : (
                  <div className="text-sm mt-4">Cho Chap Nhan</div>
                )}
              </div>
              <div className="col-span-1 flex flex-col  items-center">
                <div className="w-[56px] h-[56px] border-[3px] flex justify-center items-center border-green-600 rounded-full  bg-white">
                  <LocalShippingIcon color="success" />
                </div>
                {findStep("inTransist", orderData?.logs) ? (
                  <>
                    <div className="text-sm mt-4">Da Giao Cho DVVC</div>
                    <div className="text-sm font-light mt-2">
                      {formatDate(
                        findStep("inTransist", orderData?.logs).updatedAt || ""
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-sm mt-4">Cho Giao Cho DVVC</div>
                )}
              </div>
              <div className="col-span-1 flex  flex-col  items-center">
                <div className="w-[56px] h-[56px] border-[3px] flex justify-center items-center border-green-600 rounded-full  bg-white ">
                  <AllInboxIcon color="success" />
                </div>
                {findStep("inTransist2", orderData?.logs) ? (
                  <>
                    <div className="text-sm mt-4">Da Nhan Duoc Hang</div>
                    <div className="text-sm font-light mt-2">
                      {formatDate(
                        findStep("inTransist2", orderData?.logs).updatedAt || ""
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-sm mt-4">Cho Nhan Hang</div>
                )}
              </div>
              <div className="col-span-1 flex flex-col  items-center">
                <div className="w-[56px] h-[56px] border-[3px] flex justify-center items-center border-green-600 rounded-full  bg-white">
                  <StarIcon color="success" />
                </div>
                {findStep("rating", orderData?.logs) ? (
                  <>
                    {" "}
                    <div className="text-sm mt-4">
                      Don Hang Da Duoc Danh Gia
                    </div>
                    <div className="text-sm font-light mt-2">
                      {formatDate(
                        findStep("rating", orderData?.logs).updatedAt || ""
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-sm mt-4">Danh Gia</div>
                )}
              </div>
            </div>
            {/* Danh gia */}
            <div className="flex flex-col px-6 bg-green-50 border-b-2 border-green-500">
              <div className="flex justify-end py-4 border-b-[1px] border-gray-200">
                <div className="w-[200px] flex hover:cursor-grab justify-center items-center bg-green-600 text-white py-2">
                  Mua lai
                </div>
              </div>
              <div className="flex justify-end py-4 border-b-[1px] border-gray-200">
                <div className="w-[200px] flex hover:cursor-grab justify-center items-center bg-white border-[1px] border-gray-200  py-2">
                  Lien He Nguoi Ban
                </div>
              </div>
              {orderData?.status == "rating" && (
                <div className="flex justify-end py-4 border-b-[1px] border-gray-200">
                  <div className="w-[200px] hover:cursor-grab flex justify-center items-center bg-white border-[1px] border-gray-200  py-2">
                    Xem Danh Gia
                  </div>
                </div>
              )}

              {orderData?.status == "received" && (
                <div className="flex justify-end py-4 border-b-[1px] border-gray-200">
                  <div className="w-[200px] flex hover:cursor-grab justify-center items-center bg-white border-[1px] border-gray-200  py-2">
                    Danh Gia
                  </div>
                </div>
              )}
            </div>

            {/* Dia chi nhan hang */}
            <div className="px-6 py-4 flex flex-col">
              <div className="flex flex-row justify-between">
                <div className="text-lg font-medium">Dia Chi Nhan Hang</div>
                <div className="flex flex-col gap-y-2 text-sm">
                  <div>GHN Express</div>
                  <div className="flex justify-end">
                    {orderData?.clientOrderCode}
                  </div>
                </div>
              </div>

              <div className="flex flex-row">
                <div className="w-[320px] flex flex-col border-r-[1px] border-gray-300">
                  <div className="text-sm">{orderData?.toName}</div>
                  <div className="text-sm font-light">
                    (+84){orderData?.toPhone}
                  </div>
                  <div className="text-sm font-light">{`${
                    orderData?.toAddress
                  }, ${orderData?.toWard?.split("-")[0]}, ${
                    orderData?.toDistrict?.split("-")[0]
                  }, ${orderData?.toProvince?.split("-")[0]}`}</div>
                </div>
                <div className="relative">
                  <div className="absolute h-full left-[29px] pt-2 pb-[18px]  w-[2px]">
                    <div className=" w-[1px] h-full bg-gray-300 "></div>
                  </div>
                  <div className="grow px-6 flex flex-col-reverse gap-y-4">
                    {orderData?.logs?.map((log: any, index: number) => {
                      return (
                        <div
                          key={index}
                          className="flex flex-row justify-between z-10"
                        >
                          <div className="text-sm font-light w-[160px] flex flex-row items-center gap-x-2">
                            <div
                              className={cn(
                                `w-3 h-3 rounded-full bg-gray-300`,
                                index + 1 == orderData?.logs?.length
                                  ? `w-4 h-4 bg-green-500 relative -left-[2px]`
                                  : ``
                              )}
                            ></div>
                            <div> {formatDate(log.updatedAt)}</div>
                          </div>
                          <div className="flex flex-row justify-start grow">
                            <div> {translateStatus(log.status || "")}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col pb-4 border-b-[1px] border-gray-200">
                <div className="flex flex-row gap-x-2">
                  <StoreIcon />
                  <div>{orderData?.shop?.name}</div>
                  <div className="px-2 hover:cursor-grab hover:bg-green-500 bg-green-600 text-white text-sm">
                    <ChatIcon fontSize="small" /> Chat
                  </div>
                  <div className="px-2 hover:cursor-grab hover:bg-green-100 border-gray-300 border-[1px] text-sm">
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
                                Tra hang mien phi 15 ngay
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
                        Tong tien hang
                      </div>
                    </div>
                    <div className="flex flex-row-reverse border-t-[1px] border-gray-300 w-full">
                      <div className="w-[250px] border-l-[1px] border-gray-300 flex justify-end py-2">
                        {orderData?.totalFee}d
                      </div>
                      <div className="flex items-center pr-6 text-sm">
                        Phi van chuyen
                      </div>
                    </div>
                    <div className="flex flex-row-reverse border-y-[1px] border-gray-300 w-full">
                      <div className="w-[250px] border-l-[1px] border-gray-300 flex justify-end py-2">
                        {orderData?.priceOfAll}d
                      </div>
                      <div className="flex items-center pr-6 text-sm">
                        Thanh tien
                      </div>
                    </div>
                  </div>
                  <div className="w-full border-[1px] border-green-400 py-2 px-6 text-sm">
                    Vui long thanh toan{" "}
                    <span className="text-base font-medium text-green-600 px-2">
                      {orderData?.priceOfAll}d
                    </span>{" "}
                    khi nhan hang
                  </div>
                  <div className="flex flex-row-reverse border-y-[1px] border-gray-300 w-full">
                    <div className="w-[250px] border-l-[1px] border-gray-300 flex justify-end py-2">
                      {orderData?.paymentMethod == "cod"
                        ? "Thanh toan khi nhan hang"
                        : "Thanh toan online"}
                    </div>
                    <div className="flex items-center pr-6 text-sm">
                      Phuong thuc thanh toan
                    </div>
                  </div>
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
