/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import axios from "../AxiosCustom/custome_Axios";
import StarIcon from "@mui/icons-material/Star";
import ItemCardSmall from "./itemCardSmall";
import { useRouter } from "next/navigation";

export default function ShopCard({ shop }: { shop: any }) {
  const idOfShop = shop?.id;
  const avgRating = shop?.avgRating || 0;
  const numberOfProduct = shop?.numberOfProduct || 0;
  const router = useRouter();
  const avatar =
    shop?.avatar.url ||
    "https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper-thumbnail.png";

  const [products, setProducts] = useState<any>([]);

  useEffect(() => {
    async function fetchData() {
      let products = await axios
        .get(`products`, {
          params: {
            filter: {
              limit: 4,
              where: {
                idOfShop,
              },
            },
          },
        })
        .then((res) => res)
        .catch((e) => console.log(e));

      setProducts(products);
    }

    fetchData();
  }, [idOfShop]);


  return (
    <div className="flex flex-row items-center bg-white gap-x-6 w-full mt-4 p-4">
      <div className="flex flex-col items-center gap-y-2 px-8 py-4 border-2">
        <div className="w-16 ">
          <img src={avatar} className="rounded-full aspect-square"></img>
        </div>
        <div className="text-lg">{shop?.name}</div>
        <div className="flex flex-row justify-between text-sm w-full">
          <div>
            <StarIcon color="success" className="w-fit" />
            {avgRating.toFixed(1)}
          </div>
          <div className="w-fit">{products?.length} sản phẩm</div>
        </div>
        <div
          className="px-2 py-1 border-2 border-green-600 rounded-sm hover:cursor-grab"
          onClick={() => {
            router.push(`/shop/${idOfShop}`);
          }}
        >
          Xem Shop
        </div>
      </div>
      <div className="grid md:grid-cols-4 grid-cols-2">
        {products?.map((product: any) => {
          return <ItemCardSmall product={product} key={product.id} />;
        })}
      </div>
    </div>
  );
}
