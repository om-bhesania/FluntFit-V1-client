import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";
import CategoryCard from "../../components/cards/CategoryCard";
import SectionTitle from "../../components/section/SectionTitle";
import { CategoryData, HomeData, tshirts } from "../../utils/dummyData";
import AddToCartCard from "./../../components/cards/AddToCartCard";

function HomeComponent() {
  return (
    <>
      <section className="hero-section -mt-6 mb-6">
        <div className="relative w-full h-[700px]">
          {HomeData.map((item: any) => (
            <>
              <motion.div className="absolute top-0 bottom-0 left-0 right-0 bg-black/20 z-[5] h-full w-full" />
              <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 z-[6]">
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

              <div className="md:h-full h-[260px] w-full flex items-center justify-center overflow-hidden">
                <img
                  src={item.img}
                  className="w-full h-auto object-contain object-center"
                />
              </div>
            </>
          ))}
        </div>
      </section>

      <section className="half-sleeve-tshirts">
        <div className="container">
          <SectionTitle
            title="Popular Products"
            description="Top Picks to Turn Heads, Our Most-Loved Styles to Flaunt Your Fit"
          />
          <div className="grid md:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(360px,1fr))] grid-cols-2 w-full gap-3 flex-wrap">
            {tshirts.map((item, index) => (
              <AddToCartCard
                imageUrl={item.imageUrl}
                price={item.price}
                title={item.title}
                key={index}
              />
            ))}
          </div>
          <div className="flex items-center justify-center">
            <Button
              variant="solid"
              color="primary"
              className="mt-5 w-1/5 text-md font-secondary"
            >
              View All <ArrowRightIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <section className="categories-section z-10">
        <div className="container">
          <SectionTitle title="All Categories" />
          <div className="flex items-center justify-between gap-4 w-full max-md:pb-12 h-full max-md:overflow-x-auto scroll-m-0">
            {CategoryData.map((item) => (
              <CategoryCard
                name={item.name}
                image={item.img}
                key={item.id}
                redirectTo={item.url}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="half-sleeve-tshirts">
        <div className="container">
          <SectionTitle
            title="Half Sleeve T-Shirts"
            description="Top Picks to Turn Heads, Our Most-Loved Styles to Flaunt Your Fit"
          />
          <div className="grid md:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(360px,1fr))] grid-cols-2 w-full gap-3 flex-wrap">
            {tshirts.map((item, index) => (
              <AddToCartCard
                imageUrl={item.imageUrl}
                price={item.price}
                title={item.title}
                key={index}
              />
            ))}
          </div>
          <div className="flex items-center justify-center">
            <Button
              variant="solid"
              color="primary"
              className="mt-5 w-1/5 text-md font-secondary"
            >
              View All <ArrowRightIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <section className="half-sleeve-tshirts">
        <div className="container">
          <SectionTitle
            title="Full Sleeve T-Shirts"
            description="Top Picks to Turn Heads, Our Most-Loved Styles to Flaunt Your Fit"
          />
          <div className="grid md:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(360px,1fr))] grid-cols-2 w-full gap-3 flex-wrap">
            {tshirts.map((item, index) => (
              <AddToCartCard
                imageUrl={item.imageUrl}
                price={item.price}
                title={item.title}
                key={index}
              />
            ))}
          </div>
          <div className="flex items-center justify-center">
            <Button
              variant="solid"
              color="primary"
              className="mt-5 w-1/5 text-md font-secondary"
            >
              View All <ArrowRightIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
      <section className="half-sleeve-tshirts">
        <div className="container">
          <SectionTitle
            title="Oversized T-Shirts"
            description="Top Picks to Turn Heads, Our Most-Loved Styles to Flaunt Your Fit"
          />
          <div className="grid md:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(360px,1fr))] grid-cols-2 w-full gap-3 flex-wrap">
            {tshirts.map((item, index) => (
              <AddToCartCard
                imageUrl={item.imageUrl}
                price={item.price}
                title={item.title}
                key={index}
              />
            ))}
          </div>
          <div className="flex items-center justify-center">
            <Button
              variant="solid"
              color="primary"
              className="mt-5 w-1/5 text-md font-secondary"
            >
              View All <ArrowRightIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomeComponent;
