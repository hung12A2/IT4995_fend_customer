/* eslint-disable @next/next/no-img-element */
"use client";
import Footer from "@/module/Footer";
import Header from "@/module/Header";
import { useParams } from "next/navigation";
import axios from "../../../module/AxiosCustom/custome_Axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import StarBorderPurple500Icon from "@mui/icons-material/StarBorderPurple500";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocationCard from "@/module/base/locationCard";
import { set } from "react-hook-form";
import { Input } from "@/components/ui/input";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useToast } from "@/components/ui/use-toast";
import { useCartContext } from "@/provider/cart.provider";
import ShopCard from "@/module/base/shopCard";
import ShopCard2 from "@/module/base/shopCard2";
import parse from "html-react-parser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function formatDate(isoString: string) {
  const date = new Date(isoString);
  return `${date
    .toLocaleTimeString("en-GB")
    .slice(0, 5)} ${date.toLocaleDateString("en-GB")}`;
}
function BreadcrumbWithCustomSeparator({
  categories,
  categoriesId,
  name,
}: {
  categoriesId: string;
  categories: string;
  name: string;
}) {
  const cateLink = `/search?category=${JSON.stringify([categoriesId])}`;
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink>
            <Link href={cateLink}>{categories}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

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

export default function ProductPage() {
  const [product, setProduct] = useState<any>({});
  const [shop, setShop] = useState<any>();
  const [mainImg, setMainImg] = useState<any>({});
  const [location, setLocation] = useState<any>();
  const [selectedLocation, setSelectedLocation] = useState<any>();
  const [quantity, setQuantity] = useState<number>(1);
  const { toast } = useToast();
  const [shopInfo, setShopInfo] = useState<any>({});
  const { addItemsOnline, addItemsKiot } = useCartContext();
  const [listRating, setListRating] = useState<any>([]);

  const idOfProduct = useParams().idOfProduct;

  useEffect(() => {
    async function fetchData() {
      let productReturn: any = await axios
        .get(`products/${idOfProduct}`)
        .then((res) => res)
        .catch((e) => console.log(e));

      let shopReturn: any = await axios
        .get(`stores`, {
          params: {
            filter: {
              where: {
                id: productReturn?.idOfShop,
              },
            },
          },
        })
        .then((res) => res)
        .catch((e) => console.log(e));

      setShop(shopReturn[0]);

      let ratingReturn: any = await axios.get(`ratings`, {
        params: {
          filter: {
            where: {
              idOfShop: shopReturn[0]?.id,
              idOfProduct: idOfProduct,
            },
          },
        },
      });

      setListRating(ratingReturn);

      let dataShopInfo: any = await axios
        .get(`shop-infos`, {
          params: {
            filter: {
              where: {
                idOfShop: shopReturn[0]?.id,
              },
            },
          },
        })
        .then((res) => res)
        .catch((e) => console.log(e));

      setShopInfo(dataShopInfo[0]);

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
      let locationDefautl = dataLocation.filter((location: any) => {
        return location.isDefaultKiot;
      })[0];
      setSelectedLocation(locationDefautl);
      setProduct(productReturn);
      setMainImg(productReturn?.image?.at(0).url);
    }

    fetchData();
  }, [idOfProduct]);

  return (
    <>
      <Header />

      <div className="flex flex-col justify-center items-center bg-gray-100">
        <div className="w-2/3 mt-[120px]">
          <div>
            <BreadcrumbWithCustomSeparator
              categories={product?.cateName}
              categoriesId={product?.idOfCategory}
              name={product?.name}
            />
            <div className="bg-white grid grid-cols-5 px-6 py-6 mt-6">
              <div className="col-span-2 p-4">
                <div className="p-4">
                  <img
                    src={mainImg}
                    className="w-full aspect-square rounded-sm"
                    alt="img"
                  />
                </div>
                <div className="relative">
                  <div className="py-2  bg-green-700 bg-opacity-40 absolute top-4 hover:cursor-grab">
                    <ChevronLeftIcon
                      className="w-fit"
                      viewBox="6 6 14 14"
                      fontSize="medium"
                      color="action"
                    />
                  </div>
                  <div className="py-2  bg-green-700 bg-opacity-40 absolute top-4 right-0 hover:cursor-grab">
                    <ChevronRightIcon
                      className="w-fit"
                      viewBox="6 6 14 14"
                      fontSize="medium"
                      color="action"
                    />
                  </div>

                  <div className="grid grid-cols-5 gap-x-3">
                    {product?.image?.map((img: any, index: number) => {
                      return (
                        <div
                          onMouseOver={() => {
                            setMainImg(img.url);
                          }}
                          key={index}
                          className="col-span-1 hover:cursor-grab  hover:outline-offset-2 hover:outline-1 hover:outline hover:outline-green-600"
                        >
                          <img
                            src={img.url}
                            className="w-full aspect-square rounded-sm"
                            alt="img"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="col-span-3 px-4 py-2">
                <div className="text-2xl ">{product?.name}</div>
                <div className="flex flex-row mt-2">
                  <div className="flex flex-row justify-center items-center gap-x-2 underline text-lg pr-6 border-r-2 border-gray-300">
                    <div>{product?.rating?.toFixed(1)}</div>
                    <Star rating={product?.rating} />
                  </div>
                  <div className="flex flex-row justify-center items-center gap-x-2 text-lg pl-4 pr-6 border-r-2 border-gray-300">
                    <div className="underline">{product?.numberOfRating}</div>
                    <div className="text-sm "> Đánh Giá</div>
                  </div>
                  <div className="flex flex-row justify-center items-center gap-x-2 text-lg pl-4 pr-6 ">
                    <div className="underline">{product?.numberOfSold}</div>
                    <div className="text-sm font-light"> Đã Bán</div>
                  </div>
                </div>
                <div className="text-2xl font-semibold text-green-600 mt-6">
                  {product?.price?.toLocaleString()} đ
                </div>
                <div className="grid grid-cols-6 mt-6">
                  <div className="col-span-1 font-light">
                    Chính Sách Trả Hàng
                  </div>
                  <div className="col-span-5  font-light flex flex-row items-center gap-x-3">
                    <div className="w-2 h-2 rounded-full bg-green-600 outline outline-green-600 outline-offset-1 outline-2 ml-6"></div>
                    Trả hàng 15 ngày
                    <HoverCard>
                      <HoverCardTrigger className="hover:cursor-grab underline">
                        Đổi ý miễn phí
                      </HoverCardTrigger>
                      <HoverCardContent>
                        Miễn phí Trả hàng trong 15 ngày nếu Đổi ý (hàng trả phải
                        còn nguyên seal, tem, hộp sản phẩm), áp dụng cho một số
                        sản phẩm nhất định. Ngoài ra, tại thời điểm nhận hàng,
                        bạn có thể đồng kiểm và được trả hàng miễn phí.
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                </div>
                <div className="grid grid-cols-6 mt-6">
                  <div className="col-span-1 font-light">Van chuyen</div>
                  <div className="col-span-5">
                    <div className=" flex flex-row items-center gap-x-3">
                      <LocalShippingIcon className="w-6 h-6" />
                      <div className="font-light">Vận chuyển tới</div>
                      <LocationCard
                        location={location}
                        setLocation={(newLocation: any) => {
                          setLocation(newLocation);
                        }}
                      />
                    </div>
                    <div>
                      <HoverCard>
                        <HoverCardTrigger>
                          <div className="ml-9 mt-4 font-light hover:cursor-grab underline">
                            Chinh sach van chuyen
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent>
                          Miễn phí Trả hàng trong 15 ngày nếu Đổi ý (hàng trả
                          phải còn nguyên seal, tem, hộp sản phẩm), áp dụng cho
                          một số sản phẩm nhất định. Ngoài ra, tại thời điểm
                          nhận hàng, bạn có thể đồng kiểm và được trả hàng miễn
                          phí.
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-6 mt-6">
                  <div className="col-span-1 font-light">So luong</div>
                  <div className="col-span-5">
                    <div className="flex flex-row items-center gap-x-3">
                      <Input
                        value={quantity}
                        onChange={(e) => {
                          setQuantity(parseInt(e.target.value));
                        }}
                        type="number"
                        className="w-16 h-10 border-2 border-gray-300 rounded-sm"
                      />
                      <div className="font-light">
                        {product.countInStock} san pham co san{" "}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex flex-row gap-x-6">
                    {product.isOnlineProduct && (
                      <button
                        onClick={async () => {
                          const data = await axios
                            .post(`product-in-carts/create/${idOfProduct}`, {
                              quantity,
                              isKiot: false,
                            })
                            .then((res) => res)
                            .catch((e) => console.log(e));
                          if (data) {
                            addItemsOnline({
                              ...product,
                              quantity,
                              isKiot: false,
                            });
                            toast({
                              title: "Them vao gio hang online thanh cong",
                            });
                          }
                        }}
                        className="w-fit bg-green-600 text-white  h-12 mt-6 rounded-sm hover:bg-green-700 px-4 py-1"
                      >
                        <AddShoppingCartIcon className="w-6 h-6 mr-2" />
                        Them vao gio hang online
                      </button>
                    )}

                    {product.isKiotProduct && (
                      <button
                        onClick={async () => {
                          const data = await axios
                            .post(`product-in-carts/create/${idOfProduct}`, {
                              quantity,
                              isKiot: true,
                            })
                            .then((res) => res)
                            .catch((e) => console.log(e));
                          if (data) {
                            addItemsKiot({
                              ...product,
                              quantity,
                              isKiot: true,
                            });
                            toast({
                              title: "Them vao gio hang kiot thanh cong",
                            });
                          }
                        }}
                        className="w-fit bg-green-600 text-white  h-12 mt-6 rounded-sm hover:bg-green-700 px-4 py-1"
                      >
                        <AddShoppingCartIcon className="w-6 h-6 mr-2" />
                        Them vao gio hang kiot
                      </button>
                    )}
                  </div>
                  <button className="w-full bg-green-600 text-white  h-12 mt-6 rounded-sm hover:bg-green-700 px-4 py-1">
                    Mua ngay
                  </button>
                </div>
                <div className="text-lg">{product?.description}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-2/3">
          <ShopCard2 shop={shop} shopInfo={shopInfo} />
        </div>

        <div className="w-2/3 mt-6 bg-white p-8 flex flex-col ">
          <div className="text-lg">CHI TIET SAN PHAM</div>
          <div className="grid grid-cols-6 mt-8 gap-y-4">
            <div className="col-span-1">Danh muc</div>
            <div className="col-span-5">
              <BreadcrumbWithCustomSeparator
                categories={product?.cateName}
                categoriesId={product?.idOfCategory}
                name={product?.name}
              />
            </div>
            <div className="col-span-1">Chi tiet san pham</div>
            <div className="col-span-5">
              {parse(product?.productDetails || "")}
            </div>
          </div>
        </div>

        <div className="p-8 w-1/2 bg-white mt-6">
          <div className="text-lg">DANH GIA SAN PHAM</div>
          <div className="mt-6 p-8 flex flex-row border-green-600 border-[1px] bg-green-50 w-fit">
            <div className="flex flex-col">
              <div className="flex flex-row gap-x-2 text-green-600 items-center">
                <div className="text-2xl">
                  {(shopInfo?.avgRating || 0).toFixed(1)}
                </div>
                <div>tren</div>
                <div className="text-xl">5</div>
              </div>
              <div>
                <Star rating={shopInfo?.avgRating} />
              </div>
            </div>
            <div className="flex flex-row items-center gap-x-4 ml-16">
              <div className="px-3 py-1 text-green-600 border-green-600 border-[1px] hover:cursor-grab">
                Tat ca
              </div>
              <div className="px-3 py-1 border-[1px] border-gray-500 hover:cursor-grab">
                5 sao
              </div>
              <div className="px-3 py-1 border-[1px] border-gray-500 hover:cursor-grab">
                4 sao
              </div>
              <div className="px-3 py-1 border-[1px] border-gray-500 hover:cursor-grab">
                3 sao
              </div>
              <div className="px-3 py-1 border-[1px] border-gray-500 hover:cursor-grab">
                2 sao
              </div>
              <div className="px-3 py-1 border-[1px] border-gray-500 hover:cursor-grab">
                1 sao
              </div>
            </div>
          </div>
          <div className="mt-6">
            {listRating &&
              listRating.map((rating: any, index: number) => {
                return (
                  <div className="flex flex-row gap-x-4 py-4 border-b-[1px] border-gray-300" key={index}>
                    <div>
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={rating?.userAvatar.url} />
                        <AvatarFallback>HN</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex flex-col gap-y-2">
                      <div>{rating?.userName}</div>
                      <div><Star  rating={rating?.rating}/></div>
                      <div>{formatDate(rating?.createdAt)}</div>
                      <div>{rating?.comment}</div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="w-full">
          <Footer />
        </div>
      </div>
    </>
  );
}
