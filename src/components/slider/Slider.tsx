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

interface SlideData {
  img: string;
}

interface SliderProps {
  data: SlideData[];
  slidesPerView?: number;
  spaceBetween?: number;
}

const Slider: React.FC<SliderProps> = ({
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
      <div className="absolute top-1/2 transform -translate-y-1/2 left-4 z-10">
        <button
          onClick={handlePrev}
          aria-label="Previous slide"
          className="!text-transparent bg-transparent md:h-[500px] h-[150px] transition-all duration-300"
        >
          <ChevronLeft className="h-12 w-12" />
        </button>
      </div>
      <div className="absolute top-1/2 transform -translate-y-1/2 right-4 z-10">
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

export default Slider;
