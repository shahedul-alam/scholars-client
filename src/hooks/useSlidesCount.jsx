import { useState, useEffect } from "react";

const useSlidesCount = () => {
  const [slides, setSlides] = useState(getSlidesNumber(window.innerWidth));

  useEffect(() => {
    const handleResize = () => {
      setSlides(getSlidesNumber(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return slides;
};

function getSlidesNumber(width) {
  if (width < 640) return 1;
  if (width < 1024) return 2;
  return 3;
}

export default useSlidesCount;
