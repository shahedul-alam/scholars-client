import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState } from "react";

const sliderData = [
  {
    heading: "Elevate Your Future with Top Engineering Scholarships",
    paragraph:
      "Discover prestigious scholarships for aspiring engineers. Get access to funding for your bachelor's, master's, or doctoral studies. Don't miss out on the opportunity to turn your dreams into reality.",
    button: "Find Engineering Scholarships",
    imageURL:
      "https://i.postimg.cc/5tn86Vtx/shamin-haky-RIk-i9r-XPao-unsplash.jpg",
  },
  {
    heading: "Unlock Your Scholarship Potential: Expert Tips Inside",
    paragraph:
      "Applying for scholarships can be challenging. We've got you covered with expert guidance and resources to help you craft a winning application. From personal statements to interview prep, we'll help you shine.",
    button: "Get Application Tips",
    imageURL:
      "https://i.postimg.cc/nLHvFzpR/vasily-koloda-8-Cq-Dv-Puo-k-I-unsplash.jpg",
  },
  {
    heading: "Your Global Adventure Awaits: Explore Study Abroad Scholarships",
    paragraph:
      "Dreaming of studying in a new country? We can help you find scholarships to fund your international education. Experience diverse cultures, broaden your horizons, and gain a global perspective.",
    button: "Discover Global Scholarships",
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
    <div ref={sliderRef} className="keen-slider zoom-out container mx-auto">
      {sliderData.map((item, idx) => (
        <div key={idx} className="keen-slider__slide zoom-out__slide">
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
                  <button className="btn bg-orange text-white border-none shadow-none rounded-none font-hind">
                    {item.button}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Slider;
