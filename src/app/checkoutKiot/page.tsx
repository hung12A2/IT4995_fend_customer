/* eslint-disable @next/next/no-img-element */
"use client";
import Header from "@/module/Header";
import { useCartContext } from "@/provider/cart.provider";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import axios from "../../module/AxiosCustom/custome_Axios";
import LocationCardCheckOut from "@/module/base/locationCardCheckout";
import StoreIcon from "@mui/icons-material/Store";
import { Input } from "@/components/ui/input";
import { set } from "react-hook-form";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useAuthContext } from "@/provider/auth.provider";
import { toast } from "@/components/ui/use-toast";

export default function Page() {
  return (
    <Suspense>
      <Page2 />
    </Suspense>
  );
}

function Page2() {
  const cartContext = useCartContext();
  const [location, setLocation] = useState<any>();
  const [total, setTotal] = useState<any>({});
  const [listNote, setListNote] = useState<any>({});
  const [paymentMethod, setPaymentMethod] = useState<any>("payOnline");
  const { selectedLocation } = cartContext;
  const [preview, setPreview] = useState<any>();
  const [previewDistance, setPreviewDistance] = useState<any>([]);
  const { user } = useAuthContext();

  const router = useRouter();

  function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  const searchParams = useSearchParams();
  let state: any = searchParams.get("state");
  state = state ? JSON.parse(state) : null;

  useEffect(() => {
    async function fetchData() {
      const dataLocation: any = await axios
        .get(`location-users`, {
          params: {
            filter: {
              isDefaultKiot: true,
            },
          },
        })
        .then((res) => res)
        .catch((e) => console.log(e));
      setLocation(dataLocation);
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      let obj: any = {};
      let totalMoney = 0;
      let totalCount = 0;
      let totalShipping = 0;
      let prevDis = {};
      if (state && selectedLocation) {
        let lct = selectedLocation;
        await Promise.all(
          state?.map(async (item: any) => {
            let kiotData = item?.kiot;
            let products = item?.items;
            let listProducts = products.map((product: any) => {
              totalCount += product.quantity;
              totalMoney += product.price * product.quantity;
              return {
                idOfProduct: product.id,
                quantity: product.quantity,
              };
            });

            let fromDistrict = `${kiotData?.pickUpDistrictName}`;
            let fromWard = `${kiotData?.pickUpWardName}`;
            let toWard = `${lct?.wardName}`;
            let toDistrict = `${lct?.districtName}`;
            let fromProvince = `${kiotData?.pickUpProvinceName}`;
            let toProvince = `${lct?.provinceName}`;

            let data: any = await axios
              .post(`order-kiot/preview`, {
                fromAddress: kiotData?.pickUpAddress,
                toAddress: lct?.address,
                fromDistrict,
                fromWard,
                toDistrict,
                toWard,
                fromProvince,
                toProvince,
                items: listProducts,
              })
              .then((res) => res.data)
              .catch((e) => console.log(e));

            obj[kiotData?.id] = data?.totalFee;

            totalMoney += data?.totalFee;
            totalShipping += data?.totalFee;

            setPreview({ ...obj, [kiotData?.id]: data?.totalFee });

            prevDis = {
              ...prevDis,
              [kiotData?.id]: {
                distance: data?.distance,
                estimateTime: data?.estimateTime,
              },
            };

            setTotal({
              totalMoney,
              totalCount,
              totalShipping,
            });

            await delay(500)
          })
        );
        setPreviewDistance(prevDis);
      }
    }

    fetchData();
  }, [selectedLocation]);

  return (
    <div className="bg-gray-100">
      <Header />
      <div className="mt-[104px] w-full flex flex-col justify-center items-center">
        <div className="w-2/3">
          {location && (
            <LocationCardCheckOut
              location={location}
              type="kiot"
              setLocation={(location: any) => {
                setLocation(location);
              }}
            />
          )}

          {Array.isArray(state) &&
            state.map((item: any, index: number) => {
              const kiot = item.kiot;
              const products = item.items;
              let totalCount = 0;
              let totalMoney = 0;

              products.forEach((product: any) => {
                totalCount += product.quantity;
                totalMoney += product.price * product.quantity;
              });

              if (preview?.[kiot?.id]) totalMoney += preview?.[kiot?.id];
              return (
                <div className="p-6 bg-white shadow-lg my-8" key={index}>
                  {index == 0 && (
                    <div className="grid grid-cols-5 ">
                      <div className="col-span-2 text-lg">Sản phẩm</div>
                      <div className="col-span-1 text-gray-500">Đơn giá</div>
                      <div className="col-span-1 text-gray-500">Số lượng</div>
                      <div className="col-span-1 text-gray-500">Thành tiền</div>
                    </div>
                  )}

                  <div key={index} className="flex flex-col ">
                    <div className="flex flex-row mt-6 items-center">
                      <StoreIcon className="mr-2" />
                      <div className="pr-4 border-r-2 border-gray-300">
                        {kiot?.name}
                      </div>
                      <div className="ml-4 px-3  border-green-600 border-[1px] text-green-600">
                        Chat ngay
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-y-6 mt-6">
                      {products.map((product: any, index: number) => {
                        return (
                          <div
                            key={index}
                            className={`col-span-5 grid grid-cols-5 flex flex-row items-center mt-2 ${
                              index != products.length - 1
                                ? "border-b-[1px]"
                                : ""
                            } border-gray-300 pb-4`}
                          >
                            <div className="col-span-2 flex flex-row ">
                              <img
                                src={product.image[0].url}
                                alt=""
                                className="w-16 h-16 object-cover rounded-md"
                              />
                              <div className="ml-2">{product.name}</div>
                            </div>
                            <div className="col-span-1">{product.price}</div>
                            <div className="col-span-1">{product.quantity}</div>
                            <div className="col-span-1">
                              {product.price * product.quantity}d
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-5 mt-5 border-t-[1px] border-gray-300 py-6">
                    <div className="flex flex-row items-center col-span-2 px-6 ">
                      <p className="w-28">Loi nhan: </p>
                      <Input
                        className="border-0 focus-visible:ring-0 col-span-3 border-2 border-gray-300 rounded-none "
                        placeholder="Luu y cho Nguoi ban"
                        value={listNote?.[kiot?.id]}
                        onChange={(e) => {
                          setListNote({
                            ...listNote,
                            [kiot?.id]: e.target.value,
                          });
                        }}
                      ></Input>
                    </div>
                    <div className="grid grid-cols-3 col-span-3 justify-between w-full items-center">
                      <div className="flex flex-row col-span-2 gap-x-4">
                        <div>Don vi van chuyen: </div>
                        <div>
                          <LocalShippingIcon /> Giao hang nhanh
                        </div>
                      </div>
                      <div className="col-span-1">{preview?.[kiot?.id]}d</div>
                    </div>
                  </div>
                  <div className="pt-4 border-gray-200 border-t-[1px] flex pr-[160px] justify-between">
                    <div className="flex flex-row gap-x-4">
                      <div>
                        Khoang cach: {previewDistance?.[kiot?.id]?.distance} km
                      </div>
                      <div>
                        Thoi gian: {previewDistance?.[kiot?.id]?.estimateTime}{" "}
                        phut
                      </div>
                    </div>
                    <div>
                      Tong so tien ({totalCount} sản phẩm):{" "}
                      <span className="text-2xl ml-3 text-green-600">
                        {totalMoney}d
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

          <div className="flex flex-col px-6 py-6 bg-white">
            <div className="flex flex-row gap-x-4 py-6 border-b-[1px] border-gray-300 items-centers">
              <div>Phương thức thanh toán</div>
              <div
                onClick={() => {
                  setPaymentMethod("payOnline");
                }}
                className={`px-2 py-1 border-2 hover:cursor-grab ${
                  paymentMethod == "payOnline"
                    ? "border-green-600 text-green-600"
                    : ""
                }`}
              >
                Vi LunaShop
              </div>
              <div
                onClick={() => {
                  setPaymentMethod("cod");
                }}
                className={`px-2 py-1 border-2 hover:cursor-grab ${
                  paymentMethod == "cod"
                    ? "border-green-600 text-green-600"
                    : ""
                }`}
              >
                Thanh toan khi nhận hàng
              </div>
            </div>
            <div className="py-4 border-b-[1px] border-gray-300">
              {paymentMethod == "payOnline"
                ? "Thanh toan qua vi LunaShop"
                : "Thanh toan khi nhận hàng: Phi thu ho: 0vnd"}
            </div>
            <div className="flex flex-row justify-end gap-x-6 py-4">
              <div className="flex flex-col gap-y-4">
                <div>Tong tien hang</div>
                <div>Phi van chuyen</div>
                <div>Tổng thanh toán</div>
              </div>
              <div className="flex flex-col gap-y-4">
                <div className="flex justify-end">
                  {total?.totalMoney - total?.totalShipping}d
                </div>
                <div className="flex justify-end">{total?.totalShipping}d</div>
                <div className="flex justify-end text-2xl text-green-500">
                  {total?.totalMoney}d
                </div>
              </div>
            </div>
            <div className="px-6 pt-6 border-t-2 border-gray-300 flex flex-row justify-between">
              <div>
                {`Nhan "Dat hang" dong nghia voi viec ban dong y tuan theo Dieu khoan LunaShop`}{" "}
              </div>
              <div
                onClick={() => {
                  state?.forEach(async (item: any) => {
                    const kiot = item?.kiot;
                    const products = item?.items;
                    let totalMoney = 0;
                    const listIdProduct = products.map((product: any) => {
                      totalMoney += product.price * product.quantity;
                      return {
                        idOfProduct: product.id,
                        quantity: product.quantity,
                      };
                    });

                    const dataReturn: any = await axios
                      .post(
                        `order-kiot/create/shop/${user?.idOfShop}/kiot/${kiot?.id}`,
                        {
                          fromName: kiot?.name,
                          fromPhone: kiot?.phoneNumber,
                          toName: selectedLocation?.name || user?.fullName,
                          toPhone:
                            selectedLocation?.phoneNumber || user?.phoneNumber,
                          fromAddress: kiot?.pickUpAddress,
                          toAddress: selectedLocation?.address,
                          fromDistrict: `${kiot?.pickUpDistrictName}`,
                          fromWard: `${kiot?.pickUpWardName}`,
                          toDistrict: `${selectedLocation?.districtName}`,
                          toWard: `${selectedLocation?.wardName}`,
                          fromProvince: `${kiot?.pickUpProvinceName}`,
                          toProvince: `${selectedLocation?.provinceName}`,
                          priceOfAll: totalMoney + preview?.[kiot?.id],
                          paymentMethod: paymentMethod,
                          note: listNote?.[kiot?.id] || "no note",
                          requiredNote: "CHOTHUHANG",
                          items: listIdProduct,
                          totalFee: preview?.[kiot?.id],
                        }
                      )
                      .then((res) => res)
                      .catch((e) => console.log(e));

                    if (dataReturn?.code == 200) {
                      toast({
                        title: "Dat hang thanh cong",
                      });

                      router.push("/");
                    } else {
                      toast({
                        title: "Khong du tien trong vi",
                      });
                    }
                  });
                }}
                className="hover:cursor-grab text-white text-lg py-2 px-12 hover:bg-green-500 bg-green-600"
              >
                Dat hang
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
