const worksData = [
  {
    heading: "Find College Scholarships",
    paragraph:
      "Get matched to college scholarships tailored to you! Complete your profile, and we will instantly search millions of scholarships to match you with the best opportunities, saving you time and maximizing your chances of success.",
  },
  {
    heading: "Organize Your Matches",
    paragraph:
      "Filter your scholarship matches by due date or award amount. Keep track of your favorite scholarships, those you’ve applied to, and those you’ve won. With Scholarships.com, you’ll never miss an opportunity or scholarship deadline!",
  },
  {
    heading: "Apply and Win",
    paragraph:
      "We’ve created a personalized list of college scholarships just for you! Now’s the time to apply for the scholarships you’ve been matched with. Start your applications today and make college more affordable!",
  },
];

const HowScholarsWorks = () => {
  return (
    <section className="container mx-auto mb-12 md:mb-16">
      <div className="mb-8">
        <h2 className="text-4xl font-bold font-montserrat text-center mb-4">
          How Scholars Works
        </h2>
        <p className="w-4/5 mx-auto text-center font-hind text-lg">
          Scholars is a free college scholarship search platform that matches
          you to college scholarships you qualify for.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 px-5 md:px-0">
        {worksData.map((item, idx) => (
          <div key={idx} className="indicator w-full p-5 bg-blue rounded-xl">
            <span className="indicator-item indicator-start badge badge-lg text-white font-montserrat rounded-full bg-orange">
              {idx + 1}
            </span>
            <div className="text-white">
              <h3 className="text-2xl font-montserrat font-bold mb-4">
                {item.heading}
              </h3>
              <p className="font-hind">{item.paragraph}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowScholarsWorks;
