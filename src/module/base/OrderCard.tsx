/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import StoreIcon from "@mui/icons-material/Store";
import axios from "../AxiosCustom/custome_Axios";
import StarIcon from "@mui/icons-material/Star";
import ItemCardSmall from "./itemCardSmall";
import { useRouter } from "next/navigation";
import ChatIcon from "@mui/icons-material/Chat";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { set } from "date-fns";
import { number } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { ImgFieldMulti, SelectField, TextField } from "./fieldBase";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import StarBorderPurple500Icon from "@mui/icons-material/StarBorderPurple500";
import { useAuthContext } from "@/provider/auth.provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Star = ({ rating }: { rating: number }) => {
  return (
    <div className="flex flex-row">
      {[...Array(5)].map((_, index) => {
        return (
          <div key={index}>
            {index < rating ? (
              <StarBorderPurple500Icon color="success" className="w-fit" />
            ) : (
              ""
            )}
          </div>
        );
      })}
    </div>
  );
};

function formatDate(isoString: string) {
  const date = new Date(isoString);
  return `${date
    .toLocaleTimeString("en-GB")
    .slice(0, 5)} ${date.toLocaleDateString("en-GB")}`;
}

export default function OrderCard({ order }: { order: any }) {
  const shop = order?.shop;
  const items = order?.items;
  const status = order?.status;
  const formContext = useForm({});
  const formReturnContext = useForm({});
  const { handleSubmit } = formContext;
  const { handleSubmit: handleSubmitReturn } = formReturnContext;
  const { user } = useAuthContext();
  const router = useRouter();

  const [openRatingForm, setOpenRatingForm] = useState(false);
  const [openViewRating, setOpenViewRating] = useState(false);
  const [openReturn, setOpenReturn] = useState(false);
  const [listRating, setListRating] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let dataReturn: any = await axios
        .get(`ratings`, {
          params: {
            filter: {
              where: {
                idOfOrder: order?.id,
              },
            },
          },
        })
        .then((res) => res)
        .catch((e) => console.log(e));
      let listProduct = items.map((item: any) => item.product);

      dataReturn = dataReturn.map((item: any) => {
        let product = listProduct.find(
          (product: any) => product.id == item.idOfProduct
        );
        return {
          ...item,
          product: product,
        };
      });

      setListRating(dataReturn);
    }

    fetchData();
  }, [order?.id, items]);
  return (
    <div className="bg-white mt-4 flex flex-col px-6 pb-6 hover:cursor-pointer">
      <Dialog open={openRatingForm} onOpenChange={setOpenRatingForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Danh gia san pham</DialogTitle>
          </DialogHeader>
          <div>
            <FormProvider {...formContext}>
              {items &&
                items?.map((item: any, index: number) => {
                  const product = item?.product;
                  return (
                    <div
                      key={index}
                      className="flex flex-col py-4 border-b-2 border-gray-200"
                    >
                      <div className="flex flex-row gap-x-4">
                        <img
                          src={product?.image[0].url}
                          alt="img"
                          className="w-20 aspect-square rounded-sm"
                        />
                        <div className="flex flex-col gap-y-1">
                          <div>{product?.name}</div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <SelectField
                          name={`rating_${product?.id}`}
                          label="Danh gia"
                          required={true}
                          options={[
                            { value: 1, label: "1 sao - Te" },
                            { value: 2, label: "2 sao - Khong hai long" },
                            { value: 3, label: "3 sao - Binh thuong" },
                            { value: 4, label: "4 sao - Hai long" },
                            { value: 5, label: "5 sao - Rat hai long" },
                          ]}
                        ></SelectField>
                      </div>
                      <div className="mt-4">
                        <TextField
                          required={true}
                          name={`comment_${product?.id}`}
                          label="Nhan xet"
                          placeholder="Danh gia cua ban ve san pham nay"
                        ></TextField>
                      </div>
                    </div>
                  );
                })}
            </FormProvider>
            <div className="flex flex-row justify-end items-center mt-6 gap-x-4">
              <Button
                onClick={() => {
                  setOpenRatingForm(false);
                }}
              >
                Huy
              </Button>
              <Button
                className="text-white bg-green-600 hover:bg-green-500"
                onClick={handleSubmit(async (data: any) => {
                  let dataFetch: any = {};
                  items?.map((item: any) => {
                    const product = item?.product;
                    dataFetch[product?.id] = {
                      rating: data[`rating_${product?.id}`],
                      comment: data[`comment_${product?.id}`],
                    };
                  });

                  let check = true;
                  Object.keys(dataFetch).forEach(async (key) => {
                    const value = dataFetch[key];
                    const fetch = await axios
                      .post(`ratings`, {
                        rating: +value.rating.value,
                        comment: value.comment,
                        idOfProduct: key,
                        isKiot: false,
                        idOfOrder: order?.id,
                        idOfShop: shop?.id,
                      })
                      .then((res) => res)
                      .catch((err) => {
                        console.log(err);
                        check = false;
                      });
                  });

                  if (check) {
                    toast({
                      title: "Danh gia thanh cong",
                    });
                  } else {
                    toast({
                      title: "Danh gia that bai",
                    });
                  }

                  setOpenRatingForm(false);
                })}
              >
                Hoan thanh
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={openReturn} onOpenChange={setOpenReturn}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thong tin hoan hang</DialogTitle>
          </DialogHeader>
          <div>
            <div className="py-2 border-b-[1px] border-gray-300 ">
              DON HANG: <span>{order?.id.slice(1, 10).toUpperCase()}</span>
            </div>
            {items &&
              items.map((item: any) => {
                const product = item?.product;
                return (
                  <div
                    className="py-4 border-b-[1px] border-gray-300 flex justify-between items-center"
                    key={item.id}
                    onClick={() => {
                      router.push(`/user/purchase/order/${order?.id}`);
                    }}
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

            <FormProvider {...formReturnContext}>
              <div className="mt-4">
                <TextField
                  required={true}
                  name={`reason`}
                  label="Ly do hoan hang"
                  placeholder="Ly do hoan hang"
                ></TextField>
              </div>
              <div className="mb-4">
                <ImgFieldMulti
                  name="images"
                  label="Mo ta hinh anh"
                  required={true}
                />
              </div>
              <div className="h-[1px] w-full bg-gray-300 mb-4"></div>
              <div className="flex flex-col">
                <div className="text-xl font-medium mb-4">
                  Thong tin hoan tien
                </div>
                <div className="flex flex-row gap-x-1 items-center">
                  <div className="w-[150px]"> So tien hoan lai: </div>
                  <span className="text-xl">{order?.priceOfAll}d</span>
                </div>
                <div className="flex flex-row gap-x-1 my-2 items-center">
                  <div className="w-[150px]"> Hoan tien vao: </div>
                  <span className="">So du tai khoan LunaShop</span>
                </div>
                <div></div>
              </div>
              <div className="flex flex-row justify-end items-center mt-6 gap-x-4">
                <Button
                  onClick={() => {
                    setOpenReturn(false);
                  }}
                >
                  Huy
                </Button>
                <Button
                  className="text-white bg-green-600 hover:bg-green-500"
                  onClick={handleSubmitReturn(async (data: any) => {
                    let dataForm = new FormData();
                    dataForm.append("reason", data.reason);
                    if (data?.images) {
                      Array.from(data?.images).forEach((item: any) => {
                        dataForm.append("images", item);
                      });
                    }
                    const dataFetch: any = await axios
                      .post(`orders/returned/order/${order?.id}`, dataForm, {
                        headers:{
                          'Content-Type': 'multipart/form-data'
                        }
                      })
                      .then((res) => res)
                      .catch((e) => console.log(e));

                    if (dataFetch?.code == 200) {
                      toast({
                        title: "Da gui yeu cau hoan hang",
                      });
                    } else {
                      toast({
                        title: "Gui yeu cau hoan hang that bai",
                      });
                    }
                    setOpenRatingForm(false);
                  })}
                >
                  Hoan thanh
                </Button>
              </div>
            </FormProvider>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={openViewRating} onOpenChange={setOpenViewRating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Danh gia san pham</DialogTitle>
          </DialogHeader>

          <div>
            {listRating &&
              listRating?.map((item: any) => {
                const product = item?.product;
                return (
                  <div key={item?.id}>
                    <div className="flex flex-row gap-x-4 py-4 border-b-2 border-gray-300">
                      <img
                        src={product?.image[0].url}
                        alt="img"
                        className="w-14 aspect-square rounded-sm"
                      />
                      <div className="flex flex-col gap-y-1">
                        <div>{product?.name}</div>
                      </div>
                    </div>
                    <div className="py-4 flex flex-row gap-x-4 border-b-2 border-gray-300">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user?.avatar?.url} />
                        <AvatarFallback>HN</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-y-1">
                        <div>{user?.fullName}</div>
                        <div>
                          <Star rating={+item?.rating} />
                        </div>
                        <div>{item?.comment}</div>
                        <div className="text-sm">
                          {formatDate(item?.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </DialogContent>
      </Dialog>

      <div className="py-2 pb-4 border-b-[1px] border-gray-200 flex flex-row justify-between items-canter ">
        <div className="flex flex-row items-center gap-x-2 justify-center">
          <StoreIcon />
          <div>{shop?.name}</div>
          <div className="px-2 hover:cursor-grab hover:bg-green-500 bg-green-600 text-white text-sm">
            <ChatIcon fontSize="small" /> Chat
          </div>
          <div className="px-2 hover:cursor-grab hover:bg-green-100 border-gray-300 border-[1px] text-sm">
            <StoreIcon fontSize="small" /> Xem shop
          </div>
        </div>
        {(status == "received" ||
          status == "rating" ||
          status == "delivered") && (
          <div className="text-lg text-green-600">HOAN THANH</div>
        )}
        {status == "returned" && (
          <div className="text-lg text-green-600">DA HOAN TIEN</div>
        )}
        {status == "canceled" && (
          <div className="text-lg text-green-600">DA HUY</div>
        )}
        {status == "rejected" && (
          <div className="text-lg text-green-600">BI TU CHOI</div>
        )}
        {status != "received" &&
          status != "rating" &&
          status != "returned" &&
          status != "canceled" &&
          status != "rejected" &&
          status != "delivered" && (
            <div className="text-lg text-green-600">CHO GIAO HANG</div>
          )}

        {/* <div className="text-lg text-green-600">CHO GIAO HANG</div> */}
      </div>

      <div className="">
        {items &&
          items.map((item: any) => {
            const product = item?.product;
            return (
              <div
                className="py-4 border-b-[1px] border-gray-300 flex justify-between items-center"
                key={item.id}
                onClick={() => {
                  router.push(`/user/purchase/order/${order?.id}`);
                }}
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
        <div className="mt-6 flex flex-col justify-end items-end">
          <div>
            Thanh tien:{" "}
            <span className="text-lg text-green-600">{order?.priceOfAll}d</span>
          </div>
          <div className="mt-6 flex flex-row gap-x-4 justify-end">
            {status == "received" && (
              <div
                className="px-6 rounded-sm bg-green-600 py-2 border-[1px] text-white hover:cursor-grab"
                onClick={() => {
                  setOpenRatingForm(true);
                }}
              >
                Danh gia
              </div>
            )}
            {status == "rating" && (
              <div
                className="px-6 rounded-sm bg-green-600 py-2 border-[1px] text-white hover:cursor-grab"
                onClick={() => {
                  setOpenViewRating(true);
                }}
              >
                Xem danh gia
              </div>
            )}
            {status == "delivered" && (
              <div
                onClick={async () => {
                  const data: any = await axios
                    .post(`orders/received/order/${order?.id}`)
                    .then((res) => res)
                    .catch((e) => console.log(e));

                  if (data?.code == 200) {
                    toast({
                      title: "Da nhan hang thanh cong",
                    });
                  } else {
                    toast({
                      title: "Da nhan hang that bai",
                    });
                  }
                }}
                className="px-4 py-2 border-[1px] border-gray-300 hover:bg-green-500 bg-green-600 text-white hover:cursor-grab"
              >
                Da nhan hang
              </div>
            )}
            {status == "delivered" && (
              <div
                className="px-4 py-2 border-[1px] border-gray-300 hover:bg-gray-200 hover:cursor-grab"
                onClick={() => {
                  setOpenReturn(true);
                }}
              >
                Tra hang/ hoan tien
              </div>
            )}

            {(status == "rating" ||
              status == "canceled" ||
              status == "rejected") && (
              <div className="px-4 py-2 border-[1px] border-gray-300 hover:bg-green-500 text-white bg-green-600 hover:cursor-grab">
                Mua Lai
              </div>
            )}

            <div className="px-4 py-2 border-[1px] border-gray-300 hover:bg-gray-200 hover:cursor-grab">
              Lien he nguoi ban
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
