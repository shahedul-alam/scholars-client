import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Rating } from "react-simple-star-rating";
import useSlidesCount from "../../hooks/useSlidesCount";

const ReviewCard = ({ data }) => {
  const {
    reviewerImage,
    reviewerName,
    reviewerComments,
    reviewDate,
    ratingPoint,
  } = data;

  const formattedDate = new Date(reviewDate).toLocaleDateString("en-GB");
  return (
    <div className="keen-slider__slide">
      <div className="p-5 bg-base-200 rounded-xl">
        <div className="flex gap-4 items-center mb-3">
          <div className="avatar">
            <div className="w-24 rounded-full bg-white">
              <img src={reviewerImage} />
            </div>
          </div>
          <div>
            <h2 className="font-hind text-2xl font-semibold">{reviewerName}</h2>
            <Rating
              SVGclassName="inline"
              size={16}
              initialValue={ratingPoint}
              allowFraction
              readonly
            />
            <p className="text-sm font-hind">{formattedDate}</p>
          </div>
        </div>
        <p className="font-hind">{reviewerComments}</p>
      </div>
    </div>
  );
};

const UserReviews = ({ data }) => {
  const slides = useSlidesCount();

  const [sliderRef] = useKeenSlider({
    loop: true,
    mode: "free-snap",
    slides: {
      perView: slides,
      spacing: 16,
    },
  });

  return (
    <section className="container mx-auto mb-12 md:mb-16">
      <div className="px-4 md:px-0">
        <div ref={sliderRef} className="keen-slider">
          {data.reviews.map((item, index) => (
            <ReviewCard key={index} data={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserReviews;
