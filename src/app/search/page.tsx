/* eslint-disable @next/next/no-img-element */
"use client";

import Footer from "@/module/Footer";
import Header from "@/module/Header";
import Slider from "@/module/base/slider";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useMemo, useState } from "react";
import axios from "../../module/AxiosCustom/custome_Axios";
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
  const [listCategory, setListCategory] = useState([]);
  const [listAreaKiot, setListAreaKiot] = useState([]);
  const [listProduct, setListProduct] = useState([]);
  const [listShop, setListShop] = useState([]);
  const [listKiot, setListKiot] = useState([]); // list product kiot
  const [location, setLocation] = useState<any>();
  const category: any = searchParams.get("category");

  let categoryObj = useMemo(() => {
    return JSON.parse(category) || [];
  }, [category]);
  const locationOnline: any = searchParams.get("locationOnline");

  let locationOnlineObject = useMemo(() => {
    return JSON.parse(locationOnline) || [];
  }, [locationOnline]);
  const locationKiot: any = searchParams.get("locationKiot");
  let locationKiotObject = useMemo(() => {
    return JSON.parse(locationKiot) || [];
  }, [locationKiot]);
  const typeProduct: any = searchParams.get("typeProduct");
  let typeProductObj = useMemo(() => {
    return JSON.parse(typeProduct) || [];
  }, [typeProduct]);
  const scope = searchParams.get("type") || "online";
  let keyWord: any = searchParams.get("keyword");
  if (keyWord == "null") {
    keyWord = JSON.parse(keyWord);
  }

  let distance: any = searchParams.get("distance")
    ? searchParams.get("distance")
    : 10;

  const router = useRouter();

  const listAreaOnline = [
    {
      id: "201",
      name: "Hà Nội",
    },
    {
      id: "203",
      name: "Đà Nẵng",
    },
    {
      id: "229",
      name: "Phu Tho",
    },
  ];

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

  const scopeList = [
    {
      id: "online",
      name: "Toàn shop",
    },
    {
      id: "kiot",
      name: "Gần bạn",
    },
  ];

  useEffect(() => {
    async function fetchData() {
      const response: any = await axios
        .get("/categories")
        .then((res) => res)
        .catch((e) => console.log(e));

      const rspAred: any = await axios
        .get(`areas`)
        .then((res) => res)
        .catch((e) => console.log(e));

      setListAreaKiot(rspAred);
      setListCategory(response);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      let dataLocation: any = await axios
        .get(`location-users`, {
          params: {
            filter: {
              isDefaultKiot: true,
            },
          },
        })
        .then((res) => res)
        .catch((e) => console.log(e));
      const locationKiotDefault = dataLocation?.filter(
        (item: any) => item?.isDefaultKiot == true
      )[0];

      setLocation(locationKiotDefault);
      let listShop: any = [];
      let listKiot: any = [];
      let listProduct: any = [];

      if (scope == "online") {
        let data: any;
        if (keyWord) {
          data = await axios
            .get(`searches/${keyWord}`)
            .then((res) => res)
            .catch((e) => console.log(e));

          listShop = data.shop;
          listKiot = data.kiot;
          listProduct = data.products;

          if (locationOnlineObject.length > 0) {
            listShop = listShop.filter((shop: any) => {
              return locationOnlineObject.includes(shop.pickUpProvinceId);
            });
            listKiot = listKiot?.filter((kiot: any) => {
              return locationOnlineObject.includes(kiot.pickUpProvinceId);
            });

            let listStoresArea: any = await axios
              .get(`stores`, {
                params: {
                  filter: {
                    where: {
                      pickUpProvinceId: {
                        inq: locationOnlineObject,
                      },
                    },
                  },
                },
              })
              .then((res) => res)
              .catch((e) => console.log(e));

            const listShopId = listStoresArea?.map((shop: any) => shop.id);
            listProduct = listProduct?.filter((product: any) => {
              return listShopId.includes(product.idOfShop);
            });
          }

          if (typeProductObj.length == 1) {
            if (typeProductObj.includes("online")) {
              listProduct = listProduct?.filter((product: any) => {
                return product.isOnlineProduct;
              });
            } else {
              listProduct = listProduct?.filter((product: any) => {
                return product.isKiotProduct;
              });
            }
          }

          if (categoryObj.length > 0) {
            listProduct = listProduct?.filter((product: any) => {
              return categoryObj.includes(product.idOfCategory);
            });
          }
        } else {
          if (locationOnlineObject.length > 0) {
            listShop = await axios
              .get(`stores`, {
                params: {
                  filter: {
                    where: {
                      pickUpProvinceId: {
                        inq: locationOnlineObject,
                      },
                    },
                  },
                },
              })
              .then((res) => res)
              .catch((e) => console.log(e));
          } else {
            listShop = await axios
              .get(`stores`)
              .then((res) => res)
              .catch((e) => console.log(e));
          }

          let listShopId = listShop.map((shop: any) => shop.id);
          listProduct = await axios.get(`products`, {
            params: {
              filter: {
                where: {
                  idOfShop: {
                    inq: listShopId,
                  },
                },
              },
            },
          });

          if (typeProductObj.length == 1) {
            if (typeProductObj.includes("online")) {
              listProduct = listProduct?.filter((product: any) => {
                return product.isOnlineProduct;
              });
            } else {
              listProduct = listProduct?.filter((product: any) => {
                return product.isKiotProduct;
              });
            }
          }
          if (typeProductObj.length == 2) {
            listProduct = listProduct?.filter((product: any) => {
              return product.isOnlineProduct && product.isKiotProduct;
            });
          }

          if (categoryObj.length > 0) {
            listProduct = listProduct?.filter((product: any) => {
              return categoryObj.includes(product.idOfCategory);
            });
          }

          if (locationKiotObject.length > 0) {
            listKiot = listKiot?.filter((kiot: any) => {
              return locationKiotObject.includes(kiot.idOfArea);
            });

            const listKiotId = listKiot?.map((kiot: any) => kiot.id);
            listProduct = listProduct?.filter((product: any) => {
              return listKiotId.includes(product.idOfKiot);
            });
          }
        }

        listKiot = await Promise.all(
          listKiot?.map(async (kiot: any) => {
            const to = `${locationKiotDefault.geometry.lat},${locationKiotDefault.geometry.lng}`;
            const from = `${kiot.pickUpGeometry.lat},${kiot.pickUpGeometry.lng}`;
            const distanceData = await getDistance(from, to);
            const distance =
              +distanceData.rows[0].elements[0].distance.text.split(" ")[0];

            const estimateTime =
              +distanceData.rows[0].elements[0].duration.text.split(" ")[0];
            return {
              ...kiot,
              distance,
              estimateTime,
            };
          })
        );
      } else {
        let data: any;
        if (keyWord) {
          data = await axios
            .get(`searches/${keyWord}`)
            .then((res) => res)
            .catch((e) => console.log(e));

          listShop = data.shop;
          listKiot = data.kiot;
          listKiot = await Promise.all(
            listKiot?.map(async (kiot: any) => {
              const to = `${locationKiotDefault.geometry.lat},${locationKiotDefault.geometry.lng}`;
              const from = `${kiot.pickUpGeometry.lat},${kiot.pickUpGeometry.lng}`;
              const distanceData = await getDistance(from, to);
              const distance =
                +distanceData.rows[0].elements[0].distance.text.split(" ")[0];

              const estimateTime =
                +distanceData.rows[0].elements[0].duration.text.split(" ")[0];
              return {
                ...kiot,
                distance,
                estimateTime,
              };
            })
          );

          listProduct = data.products || [];
          let listKiotDis: any;
          if (distance) {
            listKiotDis = await axios.get(`kiots`, {
              params: {
                filter: {
                  where: {
                    pickUpGeometry: {
                      near: locationKiotDefault?.geometry,
                      maxDistance: +distance,
                      unit: "kilometers",
                    },
                  },
                },
              },
            });
          }

          let listDistance = await Promise.all(
            listKiotDis?.map(async (kiot: any) => {
              const to = `${locationKiotDefault.geometry.lat},${locationKiotDefault.geometry.lng}`;
              const from = `${kiot.pickUpGeometry.lat},${kiot.pickUpGeometry.lng}`;
              const distanceData = await getDistance(from, to);
              const distance =
                +distanceData.rows[0].elements[0].distance.text.split(" ")[0];

              const estimateTime =
                +distanceData.rows[0].elements[0].duration.text.split(" ")[0];
              return {
                distance,
                estimateTime,
                kiotId: kiot.id,
              };
            })
          );

          listProduct = listProduct?.map((product: any) => {
            const kiot = listDistance.find(
              (kiot: any) => kiot.kiotId === product.idOfKiot
            );
            return {
              ...product,
              distance: kiot?.distance,
              estimateTime: kiot?.estimateTime,
            };
          });

          if (locationKiotObject.length > 0) {
            listKiot = listKiot?.filter((kiot: any) => {
              return locationKiotObject.includes(kiot.pickUpProvinceId);
            });

            let listKiotsArea: any = await axios
              .get(`kiots`, {
                params: {
                  filter: {
                    where: {
                      idOfArea: {
                        inq: locationKiotObject,
                      },
                    },
                  },
                },
              })
              .then((res) => res)
              .catch((e) => console.log(e));

            const listKiotId = listKiotsArea?.map((kiot: any) => kiot.id);
            listProduct = listProduct?.filter((product: any) => {
              return listKiotId.includes(product.idOfKiot);
            });
          }

          if (typeProductObj.length == 1) {
            if (typeProductObj.includes("online")) {
              listProduct = listProduct?.filter((product: any) => {
                return product.isOnlineProduct;
              });
            } else {
              listProduct = listProduct?.filter((product: any) => {
                return product.isKiotProduct;
              });
            }
          }

          if (categoryObj.length > 0) {
            listProduct = listProduct?.filter((product: any) => {
              return categoryObj.includes(product.idOfCategory);
            });
          }

          if (distance) {
            listProduct = listProduct?.filter((product: any) => {
              return product.distance <= distance;
            });
            listKiot = listKiot?.filter((kiot: any) => {
              return kiot.distance <= distance;
            });
          }
        } else {
          if (distance) {
            listKiot = await axios.get(`kiots`, {
              params: {
                filter: {
                  where: {
                    pickUpGeometry: {
                      near: locationKiotDefault?.geometry,
                      maxDistance: +distance,
                      unit: "kilometers",
                    },
                  },
                },
              },
            });
          }
          listKiot = await Promise.all(
            listKiot?.map(async (kiot: any) => {
              const to = `${locationKiotDefault.geometry.lat},${locationKiotDefault.geometry.lng}`;
              const from = `${kiot.pickUpGeometry.lat},${kiot.pickUpGeometry.lng}`;
              const distanceData = await getDistance(from, to);
              const distance =
                +distanceData.rows[0].elements[0].distance.text.split(" ")[0];

              const estimateTime =
                +distanceData.rows[0].elements[0].duration.text.split(" ")[0];
              return {
                ...kiot,
                distance,
                estimateTime,
              };
            })
          );
          const listKiotId = listKiot?.map((kiot: any) => kiot.id);

          if (listKiotId.length > 0) {
            let listDistance = await Promise.all(
              listKiot.map(async (kiot: any) => {
                const to = `${locationKiotDefault.geometry.lat},${locationKiotDefault.geometry.lng}`;
                const from = `${kiot.pickUpGeometry.lat},${kiot.pickUpGeometry.lng}`;
                const distanceData = await getDistance(from, to);
                const distance =
                  +distanceData.rows[0].elements[0].distance.text.split(" ")[0];

                const estimateTime =
                  +distanceData.rows[0].elements[0].duration.text.split(" ")[0];
                return {
                  distance,
                  estimateTime,
                  kiotId: kiot.id,
                };
              })
            );
            listProduct = await axios.get(`products`, {
              params: {
                filter: {
                  where: {
                    idOfKiot: {
                      inq: listKiotId,
                    },
                  },
                },
              },
            });

            listProduct = listProduct?.map((product: any) => {
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

          if (typeProductObj.length == 1) {
            if (typeProductObj.includes("online")) {
              listProduct = listProduct?.filter((product: any) => {
                return product.isOnlineProduct;
              });
            } else {
              listProduct = listProduct?.filter((product: any) => {
                return product.isKiotProduct;
              });
            }
          }

          if (typeProductObj.length == 2) {
            listProduct = listProduct?.filter((product: any) => {
              return product.isOnlineProduct && product.isKiotProduct;
            });
          }

          if (categoryObj.length > 0) {
            listProduct = listProduct?.filter((product: any) => {
              return categoryObj.includes(product.idOfCategory);
            });
          }

          if (locationKiotObject.length > 0) {
            listKiot = listKiot?.filter((kiot: any) => {
              return locationKiotObject.includes(kiot.idOfArea);
            });

            const listKiotId = listKiot?.map((kiot: any) => kiot.id);
            listProduct = listProduct?.filter((product: any) => {
              return listKiotId.includes(product.idOfKiot);
            });
          }
        }

        if (listKiot.length > 0) {
          listKiot = await Promise.all(
            listKiot.map(async (item: any) => {
              const idOfKiot = item.id;
              const data: any = await axios
                .get(`/kiot-infos`, {
                  params: {
                    filter: {
                      where: {
                        idOfKiot,
                      },
                    },
                  },
                })
                .then((res: any) => res[0])
                .catch((err) => console.log(err));

              return {
                ...item,
                numberOfProduct: data.numberOfProduct,
                numberOfOrder: data.numberOfOrder,
                numberOfRating: data.numberOfRating,
                avgRating: data.avgRating,
                numberOfSold: data.numberOfSold,
              };
            })
          );
        }
        if (listShop.length > 0) {
          listShop = await Promise.all(
            listShop.map(async (item: any) => {
              const idOfShop = item.id;
              const data: any = await axios
                .get(`/shop-infos`, {
                  params: {
                    filter: {
                      where: {
                        idOfShop,
                      },
                    },
                  },
                })
                .then((res: any) => res[0])
                .catch((err) => console.log(err));

              return {
                ...item,
                numberOfProduct: data.numberOfProduct,
                numberOfOrder: data.numberOfOrder,
                numberOfRating: data.numberOfRating,
                avgRating: data.avgRating,
                numberOfSold: data.numberOfSold,
              };
            })
          );
        }
      }

      setListShop(listShop);
      setListKiot(listKiot);
      setListProduct(listProduct);
    }
    fetchData();
  }, [
    keyWord,
    categoryObj,
    locationOnlineObject,
    locationKiotObject,
    typeProductObj,
    scope,
    distance,
  ]);

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
                <div className="text-lg mt-2">Theo pham vi</div>
                <RadioGroup>
                  {scopeList.map((item: any) => {
                    return (
                      <div
                        className="flex items-center space-x-2"
                        key={item.id}
                      >
                        <RadioGroupItem
                          checked={scope === item.id}
                          value={item.id}
                          onClick={() => {
                            if (item.id === "online") {
                              router.push(
                                `search?category=${category}&keyword=${keyWord}&&type=${item.id}&typeProduct=${typeProduct}`
                              );
                            } else {
                              router.push(
                                `search?category=${category}&keyword=${keyWord}&type=${item.id}&typeProduct=${typeProduct}&distance=10`
                              );
                            }
                          }}
                        />
                        <Label htmlFor="option-one">{item.name}</Label>
                      </div>
                    );
                  })}
                </RadioGroup>

                {scope === "kiot" && distance && (
                  <>
                    <div className="text-lg mt-2">Theo khoang cach</div>
                    <Input
                      min={1}
                      value={+distance}
                      type="number"
                      onChange={(e: any) => {
                        distance = e.target.value;
                        router.push(
                          `search?category=${category}&keyword=${keyWord}&type=${scope}&typeProduct=${typeProduct}&distance=${e.target.value}&locationKiot=${locationKiot}`
                        );
                      }}
                    />
                  </>
                )}

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
                                `search?category=${JSON.stringify(
                                  categoryObj
                                )}&keyword=${keyWord}&locationOnline=${locationOnline}&typeProduct=${typeProduct}&type=${scope}&locationKiot=${locationKiot}`
                              );
                            } else {
                              router.push(
                                `search?category=${encodeURIComponent(
                                  JSON.stringify([item.id])
                                )}&keyword=${keyWord}&locationOnline=${locationOnline}&typeProduct=${typeProduct}&type=${scope}&locationKiot=${locationKiot}`
                              );
                            }
                          } else {
                            if (category) {
                              categoryObj = categoryObj.filter(
                                (cate: any) => cate !== item.id
                              );
                              router.push(
                                `search?category=${JSON.stringify(
                                  categoryObj
                                )}&keyword=${keyWord}&locationOnline=${locationOnline}&typeProduct=${typeProduct}&type=${scope}&locationKiot=${locationKiot}`
                              );
                            } else {
                              router.push(
                                `search?category=${JSON.stringify(
                                  []
                                )}&keyword=${keyWord}&locationOnline=${locationOnline}&typeProduct=${typeProduct}&type=${scope}&locationKiot=${locationKiot}`
                              );
                            }
                          }
                        }}
                      />
                      {item.cateName}
                    </div>
                  );
                })}

                {scope === "online" && (
                  <>
                    {" "}
                    <div className="text-lg mt-2">Theo nơi bán</div>
                    {listAreaOnline.map((item: any) => {
                      return (
                        <div key={item.id} className="text-sm mt-2 ">
                          <Checkbox
                            checked={
                              locationOnline &&
                              locationOnlineObject.includes(item.id)
                            }
                            className="mr-2"
                            onCheckedChange={(data) => {
                              if (data) {
                                if (locationOnline) {
                                  locationOnlineObject.push(item.id);
                                  router.push(
                                    `search?category=${category}&keyword=${keyWord}&locationOnline=${JSON.stringify(
                                      locationOnlineObject
                                    )}`
                                  );
                                } else {
                                  router.push(
                                    `search?category=${category}&keyword=${keyWord}&locationOnline=${JSON.stringify(
                                      [item.id]
                                    )}`
                                  );
                                }
                              } else {
                                if (locationOnline) {
                                  locationOnlineObject =
                                    locationOnlineObject.filter(
                                      (cate: any) => cate !== item.id
                                    );
                                  router.push(
                                    `search?category=${category}&keyword=${keyWord}&locationOnline=${JSON.stringify(
                                      locationOnlineObject
                                    )}`
                                  );
                                } else {
                                  router.push(
                                    `search?category=${category}&keyword=${keyWord}&locationOnline=${JSON.stringify(
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
                  </>
                )}

                {scope === "kiot" && (
                  <>
                    <div className="text-lg mt-2">Theo nơi bán</div>
                    {listAreaKiot.map((item: any) => {
                      return (
                        <div key={item.id} className="text-sm mt-2 ">
                          <Checkbox
                            checked={
                              locationKiot &&
                              locationKiotObject.includes(item.id)
                            }
                            className="mr-2"
                            onCheckedChange={(data) => {
                              if (data) {
                                if (locationKiot) {
                                  locationKiotObject.push(item.id);
                                  router.push(
                                    `search?category=${category}&keyword=${keyWord}&locationKiot=${JSON.stringify(
                                      locationKiotObject
                                    )}&type=${scope}&typeProduct=${typeProduct}`
                                  );
                                } else {
                                  router.push(
                                    `search?category=${category}&keyword=${keyWord}&locationKiot=${JSON.stringify(
                                      [item.id]
                                    )}&type=${scope}&typeProduct=${typeProduct}`
                                  );
                                }
                              } else {
                                if (locationKiot) {
                                  locationKiotObject =
                                    locationKiotObject.filter(
                                      (cate: any) => cate !== item.id
                                    );
                                  router.push(
                                    `search?category=${category}&keyword=${keyWord}&locationKiot=${JSON.stringify(
                                      locationKiotObject
                                    )}&type=${scope}&typeProduct=${typeProduct}`
                                  );
                                } else {
                                  router.push(
                                    `search?category=${category}&keyword=${keyWord}&locationKiot=${JSON.stringify(
                                      []
                                    )}&type=${scope}&typeProduct=${typeProduct}`
                                  );
                                }
                              }
                            }}
                          />
                          {item.name}
                        </div>
                      );
                    })}
                  </>
                )}

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
                                `search?category=${category}&keyword=${keyWord}&locationOnline=${locationOnline}&typeProduct=${JSON.stringify(
                                  typeProductObj
                                )}&type=${scope}&locationKiot=${locationKiot}`
                              );
                            } else {
                              router.push(
                                `search?category=${category}&keyword=${keyWord}&locationOnline=${locationOnline}&typeProduct=${JSON.stringify(
                                  [item.id]
                                )}&type=${scope}&locationKiot=${locationKiot}`
                              );
                            }
                          } else {
                            if (typeProduct) {
                              typeProductObj = typeProductObj.filter(
                                (cate: any) => cate !== item.id
                              );
                              router.push(
                                `search?category=${category}&keyword=${keyWord}&locationOnline=${locationOnline}&typeProduct=${JSON.stringify(
                                  typeProductObj
                                )}&type=${scope}&locationKiot=${locationKiot}`
                              );
                            } else {
                              router.push(
                                `search?category=${category}&keyword=${keyWord}&locationOnline=${locationOnline}&typeProduct=${JSON.stringify(
                                  []
                                )}&type=${scope}&locationKiot=${locationKiot}`
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
              {listShop?.length > 0 &&
                scope == "online" &&
                keyWord &&
                keyWord !== "" && (
                  <>
                    <p className="flex  items-center">
                      Shop liên quan đến
                      <p className="ml-2 text-lg text-green-700 w-fit">
                        `{keyWord}`
                      </p>
                    </p>
                    <ShopCard shop={listShop[1]} />
                  </>
                )}

              {listKiot?.length > 0 && keyWord && keyWord !== "" && (
                <>
                  <p className="flex  items-center">
                    Kiot liên quan đến
                    <p className="ml-2 text-lg text-green-700 w-fit">
                      `{keyWord}`
                    </p>
                  </p>
                  <KiotCard kiot={listKiot[0]} />
                </>
              )}

              <div>Kêt quả tìm kiếm cho từ khóa {keyWord}</div>

              {listProduct?.length > 0 && (
                <div className="grid md:grid-cols-5 grid-cols-3 mt-4">
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
