"use client";
import Slider from "react-slick";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { NetflixContentCard } from "./NetflixContentCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

function PrevArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      className={`hidden lg:block  md:group-hover/carousel:opacity-100 focus:opacity-100  absolute -left-6 top-1/2 transform -translate-y-1/2 z-10  bg-background/60 hover:bg-background/90  shadow-md p-3 rounded-xl transition sm:p-2 opacity-0 -ml-3 md:-ml-1 
        
        `}
    >
      <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
    </button>
  );
}

//  <button
//               onClick={() => scroll('left')}
//               className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2 bg-background/60 hover:bg-background/90 rounded-full shadow-md
//                          opacity-0 md:group-hover/carousel:opacity-100 transition-all focus:opacity-100
//                          -ml-3 md:-ml-1 disabled:opacity-20 disabled:cursor-not-allowed"
//               aria-label="Scroll left"
//               disabled={!canScrollLeft}
//             >
//               <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
//             </button>

function NextArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      className={`hidden lg:block absolute  md:group-hover/carousel:opacity-100 -right-6 top-1/2 transform -translate-y-1/2 z-10  bg-background/60 hover:bg-background/90  shadow-md p-3 rounded-xl transition sm:p-2 opacity-0 -ml-3 md:-ml-1`}
    >
      {/* <FaArrowRightLong size={30} /> */}
      <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
    </button>
  );
}

export default function ContentCarousel({
  title,
  items,
}: {
  title: string;
  items: any[];
}) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3.5,
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2.5,
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 375,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 320,
        settings: {
          slidesToShow: 1.7,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <section className="space-y-3 group/carousel">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="relative">
        <Slider {...settings}>
          {items?.map((item: any, index: number) => (
            <div key={index} className="px-2">
              <NetflixContentCard
                key={item.id}
                review={item}
                className="w-[120px] xs:w-[130px] sm:w-[150px] md:w-[170px] lg:w-[190px] xl:w-[210px]"
              />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}

// <ScrollArea className="w-full whitespace-nowrap rounded-md">
//   <div
//     className="flex w-max space-x-2 sm:space-x-3 pb-4"
//     ref={contentWrapperRef}
//   >
//     {items.map((item) => (
//       <NetflixContentCard
//         key={item.id}
//         review={item}
//         className="w-[120px] xs:w-[130px] sm:w-[150px] md:w-[170px] lg:w-[190px] xl:w-[210px]"
//       />
//     ))}
//   </div>
//   {/*
//             The ScrollBar can be kept for accessibility or touch devices that might not see buttons.
//             It's visually hidden by default by ShadCN if not needed or can be styled further.
//             Making it visible on hover along with buttons can be an option.
//           */}
//   <ScrollBar
//     orientation="horizontal"
//     className="invisible md:visible md:group-hover/carousel:visible"
//   />
// </ScrollArea>;
// {
//   showScrollButtons && (
//     <>
//       <button
//         onClick={() => scroll("left")}
//         className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2 bg-background/60 hover:bg-background/90 rounded-full shadow-md
//                          opacity-0 md:group-hover/carousel:opacity-100 transition-all focus:opacity-100
//                          -ml-3 md:-ml-1 disabled:opacity-20 disabled:cursor-not-allowed"
//         aria-label="Scroll left"
//         disabled={!canScrollLeft}
//       >
//         <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
//       </button>
//       <button
//         onClick={() => scroll("right")}
//         className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2 bg-background/60 hover:bg-background/90 rounded-full shadow-md
//                          opacity-0 md:group-hover/carousel:opacity-100 transition-all focus:opacity-100
//                          -mr-3 md:-mr-1 disabled:opacity-20 disabled:cursor-not-allowed"
//         aria-label="Scroll right"
//         disabled={!canScrollRight}
//       >
//         <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
//       </button>
//     </>
//   );
// }
