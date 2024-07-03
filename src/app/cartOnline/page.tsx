/* eslint-disable @next/next/no-img-element */
"use client";
import Header from "@/module/Header";
import { useCartContext } from "@/provider/cart.provider";
import { use, useEffect, useState } from "react";
import axios from "../../module/AxiosCustom/custome_Axios";
import { Checkbox } from "@/components/ui/checkbox";
import StoreIcon from "@mui/icons-material/Store";
import { Input } from "@/components/ui/input";
import { set } from "react-hook-form";
import { Button } from "@/components/ui/button";
import ItemCard from "@/module/base/itemCard";
import { useRouter } from "next/navigation";

export default function Page() {
  const { onlineItems, addItemsOnline, setOnlineOrderItems } = useCartContext();
  const [listProduct, setListProduct] = useState<any>([]);
  const [quantityValues, setQuantityValues] = useState<any>({});
  const [storeCheckboxes, setStoreCheckboxes] = useState<any>({});
  const [productCheckboxes, setProductCheckboxes] = useState<any>({});
  const [recommendedProducts, setRecommendedProducts] = useState<any>([]);
  const [total, setTotal] = useState<any>(0);
  const router = useRouter();

  async function apiAddOnline({ idOfProduct, quantity, isKiot }: any) {
    const data = await axios
      .post(`product-in-carts/create/${idOfProduct}`, {
        quantity,
        isKiot,
      })
      .then((res) => res)
      .catch((e) => console.log(e));

    return data;
  }

  useEffect(() => {
    async function fetchData() {
      if (onlineItems) {
        let quantity: any = {};
        const groupedProducts = onlineItems.reduce((acc: any, item: any) => {
          quantity[item.id] = item.quantity;

          if (!acc[item.idOfShop]) {
            acc[item.idOfShop] = [];
          }
          acc[item.idOfShop].push(item);
          return acc;
        }, {});

        let groupedProductsArray = Object.keys(groupedProducts).map(
          (idOfShop) => ({
            idOfShop,
            items: groupedProducts[idOfShop],
          })
        );

        let listIdOfShop = groupedProductsArray.map(
          (item: any) => item.idOfShop
        );
        let storesData: any = await axios
          .get(`stores`, {
            params: {
              filter: {
                where: {
                  id: {
                    inq: listIdOfShop,
                  },
                },
              },
            },
          })
          .then((res) => res)
          .catch((err) => console.log(err));

        groupedProductsArray = groupedProductsArray.map((item: any) => {
          let store = storesData.find(
            (store: any) => store.id === item.idOfShop
          );
          return {
            ...item,
            store,
          };
        });

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
        setRecommendedProducts(dataProducts);
        setQuantityValues(quantity);
        setListProduct(groupedProductsArray);
      }
    }

    fetchData();
  }, [onlineItems]);
  return (
    <div className="bg-gray-100">
      <Header />

      <div className="flex flex-col justify-center items-center  mt-[104px]">
        <div className="grid grid-cols-10 w-2/3 bg-white px-12 mt-8 py-4">
          <div className="col-span-1">
            <div></div>
          </div>
          <div className="col-span-3">Sản phẩm</div>
          <div className="col-span-2">Đơn giá</div>
          <div className="col-span-2">Số lượng</div>
          <div className="col-span-1">Số tiền</div>
          <div className="col-span-1">Thao tác</div>
        </div>

        <div className="mb-8 w-full flex justify-center">
          {listProduct &&
            listProduct.map((item: any) => {
              const store = item.store;
              const products = item.items;
              return (
                <div
                  className="p-6 mt-6 w-2/3 bg-white flex flex-col "
                  key={item.idOfShop}
                >
                  <div className="flex flex-row px-6 items-center">
                    <Checkbox
                      className="mr-6"
                      defaultChecked={storeCheckboxes[item.idOfShop] || false}
                      checked={storeCheckboxes[item.idOfShop] || false}
                      onCheckedChange={(e: any) => {
                        const isChecked = e;
                        setStoreCheckboxes({
                          ...storeCheckboxes,
                          [item.idOfShop]: isChecked,
                        });

                        const newProductCheckboxes = { ...productCheckboxes };
                        let totalShop = 0;
                        products.forEach((product: any) => {
                          if (isChecked) {
                            if (newProductCheckboxes[product.id] != true) {
                              totalShop += product.price * product.quantity;
                            }
                          } else {
                            if (newProductCheckboxes[product.id] == true) {
                              totalShop -= product.price * product.quantity;
                            }
                          }
                          newProductCheckboxes[product.id] = isChecked;
                        });
                        setTotal(total + totalShop);
                        setProductCheckboxes(newProductCheckboxes);
                      }}
                    />

                    <StoreIcon className="mr-4" />
                    <div>{store.name}</div>
                  </div>
                  {products.map((product: any) => {
                    return (
                      <div
                        className="grid grid-cols-10 mt-3 border-b-2  py-4 border-gray-200 px-6"
                        key={product.id}
                      >
                        <div className="col-span-1 flex flex-col justify-center ">
                          <Checkbox
                            defaultChecked={
                              productCheckboxes[product.id] || false
                            }
                            checked={productCheckboxes[product.id] || false}
                            onCheckedChange={(e: any) => {
                              if (e) {
                                setTotal(
                                  total + product.price * product.quantity
                                );
                              } else {
                                setTotal(
                                  total - product.price * product.quantity
                                );
                              }
                              setProductCheckboxes({
                                ...productCheckboxes,
                                [product.id]: e,
                              });
                              productCheckboxes[product.id] = e;
                              let allProductsChecked = false;
                              allProductsChecked = products.every(
                                (product: any) =>
                                  productCheckboxes[product.id] || false
                              );

                              setStoreCheckboxes({
                                ...storeCheckboxes,
                                [item.idOfShop]: allProductsChecked,
                              });
                            }}
                          />
                        </div>
                        <div className="col-span-3 flex flex-row ">
                          <img
                            src={product?.image[0]?.url}
                            alt=""
                            className="w-20 h-20 rounded-sm object-cover"
                          />
                          <div className="ml-4">
                            <div>{product.name}</div>
                          </div>
                        </div>
                        <div className="col-span-2 flex flex-row items-center">
                          {product.price}
                          <span className="text-sm font-light">đ</span>
                        </div>
                        <div className="col-span-2 flex flex-row items-center">
                          <button
                            onClick={() => {
                              if (quantityValues[product.id] > 0)
                                setQuantityValues({
                                  ...quantityValues,
                                  [product.id]:
                                    (quantityValues[product.id] || 0) - 1,
                                });
                              addItemsOnline({
                                ...product,
                                quantity: (quantityValues[product.id] || 0) - 1,
                                isKiot: false,
                              });
                              apiAddOnline({
                                idOfProduct: product.id,
                                quantity: (quantityValues[product.id] || 0) - 1,
                                isKiot: false,
                              });
                            }}
                          >
                            -
                          </button>
                          <Input
                            type="number"
                            className="w-20 h-8 border border-gray-300 mx-2 text-center"
                            defaultValue={product.quantity}
                            value={
                              quantityValues[product.id] || product.quantity
                            }
                            onChange={(e) => {
                              setQuantityValues({
                                ...quantityValues,
                                [product.id]: e.target.value,
                              });

                              addItemsOnline({
                                ...product,
                                quantity: e.target.value,
                                isKiot: false,
                              });
                              apiAddOnline({
                                idOfProduct: product.id,
                                quantity: e.target.value,
                                isKiot: false,
                              });
                            }}
                          />
                          <button
                            onClick={() => {
                              addItemsOnline({
                                ...product,
                                quantity: (quantityValues[product.id] || 0) + 1,
                                isKiot: false,
                              });
                              setQuantityValues({
                                ...quantityValues,
                                [product.id]:
                                  (quantityValues[product.id] || 0) + 1,
                              });
                              apiAddOnline({
                                idOfProduct: product.id,
                                quantity: (quantityValues[product.id] || 0) + 1,
                                isKiot: false,
                              });
                            }}
                          >
                            +
                          </button>
                        </div>
                        <div className="col-span-1 flex flex-row items-center">
                          {product.price * product.quantity}{" "}
                          <span className="text-sm font-light">đ</span>
                        </div>
                        <div className="col-span-1 flex items-center">
                          <button className="bg-red-500 text-white px-4 py-2 rounded">
                            Xoa
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </div>
        <div className="border-gray-200 w-2/3 bg-white mb- px-4 py-4">
          <div className="flex flex-col justify-center items-center bg-white">
            <h1 className="text-xl mt-2 text-green-700 mt-4">
             Top sản phẩm bán chạy
            </h1>
            <div className="border-2 border-green-300 w-full"></div>
          </div>

          <div className="grid grid-cols-6 pb-4 mt-10 gap-x-4 gap-y-2">
            {recommendedProducts?.map((product: any) => {
              return <ItemCard product={product} key={product.id} />;
            })}
          </div>
        </div>
        <div className="w-full flex justify-center items-center ">
          {/* footer */}
          <div className="fixed bottom-0 px-6  py-6 bg-white shadow-xl border-2 flex flex-row w-2/3 justify-between">
            <Button className="bg-red-500 text-white px-16">Xoa</Button>
            <div className="flex flex-row gap-x-12">
              <div className="flex items-center ">
                Tổng thanh toán: (
                {Object.values(productCheckboxes).filter(Boolean).length} san
                pham):{" "}
                <span className="text-xl underline text-green-700 font-medium ml-2">
                  {total}d
                </span>
              </div>

              <Button
                onClick={() => {
                  const selectedProducts = Object.entries(productCheckboxes)
                    .filter(([productId, isChecked]) => isChecked)
                    .map(([productId]) => productId);

                  const selectedData = listProduct
                    .map((shop: any) => {
                      const selectedItems = shop.items.filter((item: any) =>
                        selectedProducts.includes(item.id)
                      );

                      return {
                        shop: shop.store,
                        items: selectedItems,
                      };
                    })
                    .filter((shop: any) => shop.items.length > 0);

                    console.log(JSON.stringify(selectedData));

                  const state = encodeURIComponent(JSON.stringify(selectedData));
                  router.push(`/checkoutOnline/?state=${state}`);
                }}
                className="px-16 py-2  bg-green-700 text-md text-white"
              >
                Mua hàng
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
