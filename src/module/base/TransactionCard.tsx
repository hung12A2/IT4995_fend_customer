/* eslint-disable @next/next/no-img-element */
"use client";

import { useRouter } from "next/navigation";
import { root } from "postcss";

function formatDate(date: string) {
  const dateObj = new Date(date);

  const formattedDate = `${dateObj
    .toLocaleTimeString("vi-VN")
    .slice(0, 5)} ${dateObj.toLocaleDateString("vi-VN")}`;

  return formattedDate;
}

export default function TransactionCard({ transaction }: { transaction: any }) {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        if (!transaction?.idOfOrder.includes("VNP")) {
          router.push(`/user/purchase/order/${transaction?.idOfOrder}`);
        } else {
          router.push(
            `/user/wallet/rechargesuccess?${
              transaction?.idOfOrder.split("-")[1]
            }`
          );
        }
      }}
      className="px-6 py-4 border-b-[1px] border-gray-300 bg-gray-100 hover:cursor-pointer hover:bg-gray-200 flex flex-row justify-between"
    >
      <div className="flex flex-row gap-x-4 items-center">
        <div className="w-14 h-14 rounded-lg ">
          <img src={transaction?.image?.url} alt="Img" />
        </div>
        <div className="flex flex-col gap-y-1">
          <div className="font-medium">
            {transaction?.type == "send" &&
              `Thanh toan cho don hang ${transaction?.idOfOrder?.slice(0, 8)}`}
            {transaction?.type == "receive" &&
              `Hoan tra tu don hang ${transaction?.idOfOrder?.slice(0, 8)}`}
            {transaction?.type == "charge" && `Nap tien VnPay`}
          </div>
          <div className="text-sm">Nap tien thong qua VNpay</div>
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        <div className="flex justify-end">
          {transaction?.type == "receive" && (
            <div className="text-green-600 font-medium">
              +{transaction?.amountMoney} VND
            </div>
          )}
          {transaction?.type == "send" && (
            <div className="text-red-600 font-medium">
              +{transaction?.amountMoney} VND
            </div>
          )}
          {transaction?.type == "charge" && (
            <div className="text-green-600 font-medium">
              +{transaction?.amountMoney} VND
            </div>
          )}
        </div>
        <div>{formatDate(transaction?.createdAt)}</div>
      </div>
    </div>
  );
}
