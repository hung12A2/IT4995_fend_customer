/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/navigation";

export default function ItemCard({ product }: { product: any }) {
  const route = useRouter();
  return (
    <div
      onClick={() => route.push(`/product/${product.id}`)}
      key={product.id}
      className="hover:z-10 transform hover:-translate-y-1 transition duration-200 flex bg-white flex-col items-center justify-center hover:cursor-grab p-2 hover:border-green-400 hover:border-[1px] hover:shadow-lg"
    >
      <img
        src={product.image[0].url}
        className="aspect-square  hover:brightness-105 w-full "
        alt={product.productName}
      />
      <div className="w-full">
        <div className="flex justify-start w-full mt-2">{product.name}</div>
        <div className="mt-2 flex flex-row justify-between">
          <div className="text-green-800">{product.price}đ</div>
          <div className=" text-sm">
            Đã bán: {product?.numberOfSold ? product?.numberOfSold : 0}
          </div>
        </div>
      </div>
    </div>
  );
}
