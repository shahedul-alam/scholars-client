import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState } from "react";

const sliderData = [
  {
    heading: "Discover Your Dream Scholarship Today",
    paragraph:
      "Unlock your potential with a wide range of scholarships. From engineering to arts, find the perfect opportunity to fund your education and achieve your academic goals.",
    button: "Explore Scholarships",
    imageURL:
      "https://i.postimg.cc/5tn86Vtx/shamin-haky-RIk-i9r-XPao-unsplash.jpg",
  },
  {
    heading: "Get Expert Guidance on Your Scholarship Journey",
    paragraph:
      "Navigating the scholarship application process can be tough. Access our resources and tips to craft a winning application and increase your chances of success.",
    button: "Learn More",
    imageURL:
      "https://i.postimg.cc/nLHvFzpR/vasily-koloda-8-Cq-Dv-Puo-k-I-unsplash.jpg",
  },
  {
    heading: "Full Fund Scholarship at Oxford University",
    paragraph:
      "Don't miss out on this prestigious scholarship opportunity. Apply now for a chance to study at one of the world's top universities. Deadline: December 15, 2024",
    button: "Apply Now",
    imageURL:
      "https://i.postimg.cc/W3zgZHD0/qingqing-cai-158z33c3-H5o-unsplash.jpg",
  },
];

const Slider = () => {
  const [details, setDetails] = useState(null);

  const [sliderRef] = useKeenSlider({
    loop: true,
    detailsChanged(s) {
      setDetails(s.track.details);
    },
    initial: 2,
  });

  function scaleStyle(idx) {
    if (!details) return {};
    const slide = details.slides[idx];
    const scale_size = 0.7;
    const scale = 1 - (scale_size - scale_size * slide.portion);
    return {
      transform: `scale(${scale})`,
      WebkitTransform: `scale(${scale})`,
    };
  }

  return (
    <section ref={sliderRef} className="keen-slider zoom-out container mx-auto mb-12 md:mb-16">
      {sliderData.map((item, idx) => (
        <div
          key={idx}
          className="keen-slider__slide zoom-out__slide md:rounded-2xl"
        >
          <div style={scaleStyle(idx)}>
            <div
              className="hero h-[50dvh] md:h-[60dvh]"
              style={{
                backgroundImage: `url(${item.imageURL})`,
              }}
            >
              <div className="hero-overlay bg-opacity-60"></div>
              <div className="hero-content text-neutral-content text-center">
                <div className="max-w-md md:max-w-xl">
                  <h1 className="mb-5 text-4xl md:text-5xl font-bold font-montserrat">
                    {item.heading}
                  </h1>
                  <p className="mb-5 md:w-4/5 md:mx-auto font-hind">
                    {item.paragraph}
                  </p>
                  <button className="btn bg-orange text-white border-none shadow-none font-hind">
                    {item.button}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Slider;
