/* eslint-disable @next/next/no-img-element */
"use client";
import Footer from "@/module/Footer";
import Header from "@/module/Header";
import Slider from "@/module/base/slider";
import { useParams, useRouter } from "next/navigation";

export default function Home() {
  const params = useParams();

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
          <div className="h-[200px]"> Cate body</div>
        </div>
        <div className="w-full">
          <Footer />
        </div>
      </div>
    </>
  );
}
