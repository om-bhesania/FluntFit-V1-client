import { Button } from "@nextui-org/react";
import { ArrowRightIcon } from "lucide-react";
import CategoryCard from "../../components/cards/CategoryCard";
import SectionTitle from "../../components/section/SectionTitle";
import HeroSlider from "../../components/slider/HeroSlider";
import { CategoryData, HomeData, tshirts } from "../../utils/dummyData";
import AddToCartCard from "./../../components/cards/AddToCartCard";

function HomeComponent() {
  return (
    <>
      <section className="hero-section -mt-6 mb-6">
        <HeroSlider data={HomeData} slidesPerView={1} spaceBetween={30} />
      </section>

      <section className="half-sleeve-tshirts">
        <div className="container">
          <SectionTitle
            title="Popular Products"
            description="Top Picks to Turn Heads, Our Most-Loved Styles to Flaunt Your Fit"
          />
          <div className="grid md:grid-cols-[repeat(auto-fill,minmax(400px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(360px,1fr))] grid-cols-1 w-full gap-3 flex-wrap">
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
          <div className="flex items-center justify-between max-md:gap-5 w-full max-md:pb-12 h-full max-md:overflow-x-auto scroll-m-0">
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
          <div className="grid md:grid-cols-[repeat(auto-fill,minmax(400px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(360px,1fr))] grid-cols-1 w-full gap-3 flex-wrap">
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
          <div className="grid md:grid-cols-[repeat(auto-fill,minmax(400px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(360px,1fr))] grid-cols-1 w-full gap-3 flex-wrap">
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
          <div className="grid md:grid-cols-[repeat(auto-fill,minmax(400px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(360px,1fr))] grid-cols-1 w-full gap-3 flex-wrap">
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
