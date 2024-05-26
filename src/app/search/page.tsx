/* eslint-disable @next/next/no-img-element */
"use client";
import Footer from "@/module/Footer";
import Header from "@/module/Header";
import Slider from "@/module/base/slider";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function Home() {
  const params = useParams();
  const searchParams = useSearchParams();

  console.log(searchParams.get('keyword'));

  return (
    <>
      <Header />

      <div className="flex flex-col justify-center items-center bg-gray-100">
        <div className="w-2/3">
          <div className="grid grid-cols-3 grid-rows-2 mt-[100px] gap-x-2 gap-y-2">
          </div>
          <div className="h-[200px]"> Cate body</div>
        </div>
        <div className="w-full">
          <Footer />
        </div>
      </div>
    </>
  );
}
