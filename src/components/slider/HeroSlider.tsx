import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { motion } from "framer-motion";
import { Button } from "@nextui-org/react";

interface HeroSlideData {
  title?: string;
  img: string;
  description?: string;
}

interface HeroSliderProps {
  data: HeroSlideData[];
  slidesPerView?: number;
  spaceBetween?: number;
}

const HeroSlider: React.FC<HeroSliderProps> = ({
  data,
  slidesPerView = 3,
  spaceBetween = 50,
}) => {
  const [swiperInstance, setSwiperInstance] = useState<any | null>(null);

  const handleNext = () => {
    swiperInstance?.slideNext();
  };

  const handlePrev = () => {
    swiperInstance?.slidePrev();
  };

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        spaceBetween={spaceBetween}
        loop={true}
        autoplay={{ delay: 10000, disableOnInteraction: false }}
        navigation={false}
        slidesPerView={slidesPerView}
        pagination={{ clickable: true }}
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper) => setSwiperInstance(swiper)}
      >
        {data.map((item, index) => (
          <SwiperSlide key={index} className="w-full">
            <motion.div className="absolute top-0 bottom-0 left-0 right-0 bg-black/20 z-50 h-full w-full" />
            <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 z-[60]">
              <div className="font-semibold text-white text-5xl">
                {item.title}
              </div>
              <div className="font-semibold text-white text-2xl font-heading">
                {item.description}
              </div>
              <div className="mt-5">
                <Button variant="shadow" color={"primary"}>
                  Shop Now
                </Button>
              </div>
            </div>
            {item.img && (
              <div className="md:h-[700px] h-[260px] w-full flex items-center justify-center">
                <img
                  src={item.img}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-auto object-contain object-center"
                />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <div className="absolute top-1/2 transform -translate-y-1/2 left-4 z-[100]">
        <button
          onClick={handlePrev}
          aria-label="Previous slide"
          className="!text-transparent bg-transparent md:h-[500px] h-[150px] transition-all duration-300"
        >
          <ChevronLeft className="h-12 w-12" />
        </button>
      </div>
      <div className="absolute top-1/2 transform -translate-y-1/2 right-4 z-[100]">
        <button
          onClick={handleNext}
          aria-label="Next slide"
          className="!text-transparent bg-transparent md:h-[500px] h-[150px] transition-all duration-300"
        >
          <ChevronRight className="h-12 w-12" />
        </button>
      </div>
    </div>
  );
};

export default HeroSlider;
