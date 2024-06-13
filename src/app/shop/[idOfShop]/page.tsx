/* eslint-disable @next/next/no-img-element */
"use client";

import Footer from "@/module/Footer";
import Header from "@/module/Header";
import Slider from "@/module/base/slider";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useMemo, useState } from "react";
import axios from "../../../module/AxiosCustom/custome_Axios";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getDistance } from "@/utils/getDistance";
import { Input } from "@/components/ui/input";
import { list } from "postcss";
import { set } from "react-hook-form";
import ItemCard from "@/module/base/itemCard";
import ShopCard from "@/module/base/shopCard";
import SearchIcon from "@mui/icons-material/Search";
import KiotCard from "@/module/base/KiotCard";

export default function Home() {
  const params = useParams();
  const searchParams = useSearchParams();
  const idOfShop = params.idOfShop;

  console.log(idOfShop);
  const [listCategory, setListCategory] = useState([]);
  const [listProduct, setListProduct] = useState([]);
  const category: any = searchParams.get("category");

  let categoryObj = useMemo(() => {
    return JSON.parse(category) || [];
  }, [category]);

  const typeProductList = [
    {
      id: "online",
      name: "Online",
    },
    {
      id: "kiot",
      name: "kiot",
    },
  ];

  const typeProduct: any = searchParams.get("typeProduct");
  let typeProductObj = useMemo(() => {
    return JSON.parse(typeProduct) || [];
  }, [typeProduct]);
  let keyWord: any = searchParams.get("keyword");
  if (keyWord == "null") {
    keyWord = JSON.parse(keyWord);
  }

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const response: any = await axios
        .get("/categories")
        .then((res) => res)
        .catch((e) => console.log(e));

      setListCategory(response);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      let listProduct: any = [];

      if (!keyWord) {
        listProduct = await axios
          .get("/products", {
            params: {
              filter: {
                where: {
                  idOfShop,
                  idOfCategory: { inq: categoryObj },
                },
              },
            },
          })
          .then((res) => res);
      } else {
        listProduct = await axios
          .get(`/searchesProduct/${keyWord}`, {
            params: {
              filter: {
                where: {
                  idOfShop,
                  idOfCategory: { inq: categoryObj },
                },
              },
            },
          })
          .then((res) => res);
      }

      if (typeProductObj.length == 1) {
        if (typeProductObj[0] == "online") {
          listProduct = listProduct.filter((item: any) => item.isOnlineProduct);
        } else {
          listProduct = listProduct.filter((item: any) => item.isKiotProduct);
        }
      }

      setListProduct(listProduct);
    }

    fetchData();
  }, [keyWord, categoryObj, typeProductObj, idOfShop]);

  return (
    <>
      <Header />

      <div className="flex flex-col justify-center items-center bg-gray-100">
        <div className="w-2/3">
          <div className="grid grid-cols-3 grid-rows-2 mt-[100px] gap-x-2 gap-y-2"></div>
          <div className="grid grid-cols-6 mt-12">
            <div className="flex flex-col col-span-1 border-r-2 border-gray-200">
              <div className="text-xl font-medium">
                <FilterAltOutlinedIcon className="mr-2" /> Bộ lọc tìm kiếm
              </div>
              <div className="mt-4 flex flex-col gap-y-2">
                <div className="text-lg mt-2">Theo danh mục</div>

                {listCategory.map((item: any) => {
                  return (
                    <div key={item.id} className="text-sm mt-2 ">
                      <Checkbox
                        checked={category && categoryObj.includes(item.id)}
                        className="mr-2"
                        onCheckedChange={(data) => {
                          if (data) {
                            if (category) {
                              categoryObj.push(item.id);
                              router.push(
                                `${idOfShop}?category=${JSON.stringify(
                                  categoryObj
                                )}&keyword=${keyWord}&typeProduct=${typeProduct}`
                              );
                            } else {
                              router.push(
                                `${idOfShop}?category=${encodeURIComponent(
                                  JSON.stringify([item.id])
                                )}&keyword=${keyWord}&&typeProduct=${typeProduct}`
                              );
                            }
                          } else {
                            if (category) {
                              categoryObj = categoryObj.filter(
                                (cate: any) => cate !== item.id
                              );
                              router.push(
                                `${idOfShop}?category=${JSON.stringify(
                                  categoryObj
                                )}&keyword=${keyWord}&typeProduct=${typeProduct}`
                              );
                            } else {
                              router.push(
                                `${idOfShop}?category=${JSON.stringify(
                                  []
                                )}&keyword=${keyWord}&  &typeProduct=${typeProduct}`
                              );
                            }
                          }
                        }}
                      />
                      {item.cateName}
                    </div>
                  );
                })}

                <div className="text-lg mt-2">Theo loại vận chuyển </div>

                {typeProductList.map((item: any) => {
                  return (
                    <div key={item.id} className="text-sm mt-2 ">
                      <Checkbox
                        checked={
                          typeProductList && typeProductObj.includes(item.id)
                        }
                        className="mr-2"
                        onCheckedChange={(data) => {
                          if (data) {
                            if (typeProduct) {
                              typeProductObj.push(item.id);
                              router.push(
                                `?category=${category}&keyword=${keyWord}&typeProduct=${JSON.stringify(
                                  typeProductObj
                                )}`
                              );
                            } else {
                              router.push(
                                `?category=${category}&keyword=${keyWord}&typeProduct=${JSON.stringify(
                                  [item.id]
                                )}`
                              );
                            }
                          } else {
                            if (typeProduct) {
                              typeProductObj = typeProductObj.filter(
                                (cate: any) => cate !== item.id
                              );
                              router.push(
                                `?category=${category}&keyword=${keyWord}&typeProduct=${JSON.stringify(
                                  typeProductObj
                                )}`
                              );
                            } else {
                              router.push(
                                `?category=${category}&keyword=${keyWord}&typeProduct=${JSON.stringify(
                                  []
                                )}`
                              );
                            }
                          }
                        }}
                      />
                      {item.name}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="pl-4 col-span-5">
              <div>Kêt quả tìm kiếm cho từ khóa {keyWord}</div>

              {listProduct?.length > 0 && (
                <div className="grid md:grid-cols-5 grid-cols-3 gap-x-4 mt-4">
                  {listProduct?.map((product: any) => {
                    return <ItemCard product={product} key={product.id} />;
                  })}
                </div>
              )}

              {listProduct?.length == 0 && (
                <div className="flex justify-center items-center bg-white h-[300px] mt-4 mb-4">
                  <SearchIcon /> Không có sản phẩm nào phu hop
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Footer />
        </div>
      </div>
    </>
  );
}
