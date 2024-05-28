/* eslint-disable @next/next/no-img-element */
"use client";
import Header from "@/module/Header";
import Slider from "@/module/base/slider";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "../module/AxiosCustom/custome_Axios";
import ItemCard from "@/module/base/itemCard";
import Footer from "@/module/Footer";
import { getDistance } from "@/utils/getDistance";
import LocationCard from "@/module/base/locationCard";
import { set } from "react-hook-form";

export default function Home() {
  const route = useRouter();
  const params = useParams();
  const [listCategory, setListCategory] = useState([]);
  const [listProduct, setListProduct] = useState([]);
  const [location, setLocation] = useState<any>();
  const [listProductKiot, setListProductKiot] = useState([]); // list product kiot
  const [listKiot, setListKiot] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response: any = await axios
        .get("/categories")
        .then((res) => res)
        .catch((e) => console.log(e));
      setListCategory(response);

      const dataProducts: any = await axios
        .get("/products", {
          params: {
            filter: {
              order: "numberOfSold DESC",
              limit: 10,
              where: {
                status: "active",
              },
            },
          },
        })
        .then((res) => res)
        .catch((e) => console.log(e));

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

      let dataKiotNear: any = await axios.get(`kiots`, {
        params: {
          filter: {
            where: {
              pickUpGeometry: {
                near: dataLocation[0]?.geometry,
                maxDistance: 10,
                unit: "kilometers",
              },
            },
          },
        },
      });

      const listIdKiot = dataKiotNear.map((kiot: any) => kiot.id);

      let listDistance: any = [];

      // listDistance = await Promise.all(
      //   dataKiotNear.map(async (kiot: any) => {
      //     const to = `${dataLocation[0].geometry.lat},${dataLocation[0].geometry.lng}`;
      //     const from = `${kiot.pickUpGeometry.lat},${kiot.pickUpGeometry.lng}`;
      //     const distanceData = await getDistance(from, to);
      //     const distance =
      //       +distanceData.rows[0].elements[0].distance.text.split(" ")[0];

      //     const estimateTime =
      //       +distanceData.rows[0].elements[0].duration.text.split(" ")[0];
      //     return {
      //       distance,
      //       estimateTime,
      //       kiotId: kiot.id,
      //     };
      //   })
      // );
      let dataProductKiot: any = [];

      if (dataKiotNear.length > 0) {
        dataProductKiot = await axios.get(`products`, {
          params: {
            filter: {
              where: {
                isKiotProduct: true,
                idOfKiot: {
                  inq: listIdKiot,
                },
              },
            },
          },
        });

        dataProductKiot = dataProductKiot.map((product: any) => {
          const kiot = listDistance.find(
            (kiot: any) => kiot.kiotId === product.idOfKiot
          );
          return {
            ...product,
            distance: kiot?.distance,
            estimateTime: kiot?.estimateTime,
          };
        });
      }

      setListProductKiot(dataProductKiot);
      setListKiot(dataKiotNear);
      setLocation(dataLocation);
      setListProduct(dataProducts);
    }

    fetchData();
  }, []);
  return (
    <>
      <Header />

      <div className="flex flex-col justify-center items-center bg-gray-100">
        <div className="w-2/3">
          <div className="grid grid-cols-3 grid-rows-2 mt-[160px] gap-x-2 gap-y-2">
            <div className="row-start-1 row-end-3 col-start-1 col-end-3">
              <Slider />
            </div>
            <div className=" row-start-1 row-end-2">
              <img
                src="https://cf.shopee.vn/file/vn-50009109-cbf7420946bc7b86d2d06cc8f35ba1f7_xhdpi"
                alt="img1"
              />
            </div>
            <div className=" row-start-2 row-end-3">
              <img
                src="https://cf.shopee.vn/file/vn-50009109-410d812d0b4a83b54ff11446d0d65de0_xhdpi"
                alt="img1"
              />
            </div>
          </div>
          <div className="border-[1px] shadow-lg border-gray-200 mt-10"></div>

          <div className="shadow-lg border-gray-200 bg-white px-4 py-4">
            <h1 className="text-xl mt-6 text-gray-700">Danh muc</h1>
            <div className="grid grid-cols-10 pb-4 mt-10 gap-x-3 gap-y-2">
              {listCategory?.map((cate: any) => (
                <div
                  onClick={() => route.push(`${cate.id}`)}
                  key={cate.id}
                  className="flex flex-col items-center justify-center hover:cursor-grab p-2"
                >
                  <img
                    src={cate.image.url}
                    className="aspect-square rounded-lg hover:brightness-105 w-full "
                    alt={cate.cateName}
                  />
                  <span className="mt-3">{cate.cateName}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border-gray-200  px-4 py-4 mt-6">
            <div className="flex flex-col justify-center items-center bg-white">
              <h1 className="text-xl mt-2 text-green-700 mt-4">
                Top san pham ban chay
              </h1>
              <div className="border-2 border-green-300 w-full"></div>
            </div>

            <div className="grid grid-cols-6 pb-4 mt-10 gap-x-4 gap-y-2">
              {listProduct?.map((product: any) => {
                return <ItemCard product={product} key={product.id} />;
              })}
            </div>
          </div>

          <div className="border-gray-200  px-4 py-4 mt-6">
            <div className="flex flex-col justify-center items-center bg-white">
              <h1 className="text-xl mt-2 text-green-700 mt-4">
                Cac san pham o gan ban
              </h1>
              <div className="border-2 border-green-300 w-full"></div>
            </div>

            <div className="flex flex-row gap-x-10 mt-4">
              <LocationCard
                location={location}
                setLocation={(newLocation: any) => {
                  setLocation(newLocation);
                }}
              />
              <div className="border-[1px] px-2 py-1 rounded-sm border-green-600 hover:cursor-grab">
                10km
              </div>
            </div>

            {listProductKiot?.length > 0 ? (
              <div className="grid grid-cols-6 pb-4 mt-10 gap-x-4 gap-y-2">
                {listProductKiot?.map((product: any) => {
                  return <ItemCard product={product} key={product.id} />;
                })}
              </div>
            ) : (
              <div className="mt-8 text-xl font-medium flex justify-center items-center">
                Khong co san pham nao gan ban
              </div>
            )}
          </div>
        </div>
        <div className="w-full">
          <Footer />
        </div>
      </div>
    </>
  );
}
