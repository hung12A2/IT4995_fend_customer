/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import axios from "../AxiosCustom/custome_Axios";
import StarIcon from "@mui/icons-material/Star";
import ItemCardSmall from "./itemCardSmall";
import { useRouter } from "next/navigation";
import { set } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ChatIcon from "@mui/icons-material/Chat";
import StoreIcon from "@mui/icons-material/Store";

export default function ShopCard2({
  shop,
  shopInfo,
}: {
  shop: any;
  shopInfo: any;
}) {
  const idOfShop = shop?.id;
  const router = useRouter();
  const avatar =
    shop?.avatar.url ||
    "https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper-thumbnail.png";

  return (
    <div className="px-8 mt-4 bg-white py-6 flex flex-row w-full">
      <div className="flex flex-row gap-x-4 pr-4 border-r-2 border-gray-300">
        <Avatar className="w-[78px] h-[78px]">
          <AvatarImage src={avatar} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-center gap-y-2">
          <div>{shop?.name}</div>
          <div className="flex flex-row gap-x-4">
            <div className="px-2 hover:cursor-grab hover:bg-green-500 bg-green-600 text-white text-sm">
              <ChatIcon fontSize="small" /> Chat
            </div>
            <div className="px-2 hover:cursor-grab hover:bg-green-100 border-gray-300 border-[1px] text-sm">
              <StoreIcon fontSize="small" /> Xem shop
            </div>
          </div>
        </div>
      </div>
      <div className="pl-6 grid grid-cols-3 gap-x-12 grow">
        <div className="col-span-1 flex flex-col justify-center gap-y-4">
          <div className="flex flex-row justify-between items-center">
            <div>Danh gia</div>
            <div>{shopInfo?.numberOfRating}</div>
          </div>
          <div className="flex flex-row justify-between items-center">
            <div>San pham</div>
            <div>{shopInfo?.numberOfProduct}</div>
          </div>
        </div>
        <div className="col-span-1 flex flex-col justify-center gap-y-4">
          <div className="flex flex-row justify-between items-center">
            <div>Danh gia trung binh</div>
            <div>{shopInfo?.avgRating}</div>
          </div>
          <div className="flex flex-row justify-between items-center">
            <div>Order</div>
            <div>{shopInfo?.numberOfOrder}</div>
          </div>
        </div>
        <div className="col-span-1 flex flex-col justify-center gap-y-4">
          <div className="flex flex-row justify-between items-center">
            <div>Ti le Order thanh cong</div>
            <div>
              {(
                (shopInfo?.numberOfSuccesOrder / shopInfo?.numberOfOrder) *
                100
              ).toFixed(2)}
              %
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
