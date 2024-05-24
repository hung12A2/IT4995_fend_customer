/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";

const sliderList = [
  {
    id: 1,
    content: "THE BEST CUISINE AWAITS YOUS",
    secondaryContent: "Beefsteak",
    thirContent: "Delicious!",
    discount: "20% | DISCOUNT UPON",
    buttonContent: "Register",
    image:
      "https://cf.shopee.vn/file/vn-50009109-7d0958ac7df3c8d790588f65b3926148_xxhdpi",
  },

  {
    id: 2,
    content: "THE BEST CUISINE AWAITS YOUS",
    secondaryContent: "Best food",
    thirContent: "Healthy food",
    discount: "20% | DISCOUNT UPON",
    buttonContent: "Register",
    image:
      "https://cf.shopee.vn/file/vn-50009109-7d0958ac7df3c8d790588f65b3926148_xxhdpi",
  },

  {
    id: 3,
    content: "THE BEST CUISINE AWAITS YOUS",
    secondaryContent: "Welcome!",
    thirContent: "To my food",
    discount: "20% | DISCOUNT UPON",
    buttonContent: "Register",
    image:
      "https://cf.shopee.vn/file/vn-50009109-7d0958ac7df3c8d790588f65b3926148_xxhdpi",
  },
];

export default function Slider() {
  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      spaceBetween={40}
      slidesPerView={1}
      loop={true}
      pagination={{ clickable: true }}
      autoplay={{ delay: 2500 }}
    >
      {sliderList.map((slider) => (
        <SwiperSlide key={slider.id}>
          <>
            <img src={slider.image}></img>
          </>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
