const Frequently = () => {
  return (
    <section className="container mx-auto mb-12 md:mb-16">
      <h2 className="text-4xl font-bold font-montserrat text-center mb-8">
        Frequently Asked Questions
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-5 font-hind">
        <div className="join join-vertical w-full">
          <div className="collapse collapse-arrow join-item border-base-300 border">
            <input type="radio" name="my-accordion-4" defaultChecked />
            <div className="collapse-title text-xl font-medium">
              What is Scholars?
            </div>
            <div className="collapse-content">
              <p>
                Scholars is a free college scholarship search platform that
                helps students find scholarships they qualify for. As one of the
                most widely used and trusted scholarship search engines, we’ve
                helped over 26 million students and families connect with
                college scholarship opportunities.
              </p>
            </div>
          </div>
          <div className="collapse collapse-arrow join-item border-base-300 border">
            <input type="radio" name="my-accordion-4" />
            <div className="collapse-title text-xl font-medium">
              How does Scholars stand out from other scholarship platforms?
            </div>
            <div className="collapse-content">
              <p>
                Scholars is one of the most trusted and widely used scholarship
                search platforms, featuring a verified and continuously updated
                scholarship database. Our comprehensive scholarship listings
                cater to all types of students, ensuring a wide range of
                opportunities. We maintain accuracy by reviewing listings,
                removing expired scholarships, and incorporating user feedback.
                New scholarships are added daily, and 50% of our database
                consists of location-based scholarships, which often provide a
                better chance of winning.
              </p>
            </div>
          </div>
          <div className="collapse collapse-arrow join-item border-base-300 border">
            <input type="radio" name="my-accordion-4" />
            <div className="collapse-title text-xl font-medium">
              Do I need to create an account to view scholarships on Scholars?
            </div>
            <div className="collapse-content">
              <p>
                No, you can browse scholarships on Scholarships.com without
                creating an account by visiting our Scholarship Directory.
                However, registering allows you to receive personalized
                scholarship matches based on your background, interests, and
                eligibility, making it easier to find opportunities that are the
                best fit for you.
              </p>
            </div>
          </div>
        </div>

        <div className="join join-vertical w-full">
          <div className="collapse collapse-arrow join-item border-base-300 border">
            <input type="radio" name="my-accordion-4" defaultChecked />
            <div className="collapse-title text-xl font-medium">
              Is Scholars completely free?
            </div>
            <div className="collapse-content">
              <p>
                Yes, Scholars is completely free to use. There are no fees to
                search for scholarships, create an account, or access any of our
                resources. Our goal is to help students find and win
                scholarships without any cost or obligation.
              </p>
            </div>
          </div>
          <div className="collapse collapse-arrow join-item border-base-300 border">
            <input type="radio" name="my-accordion-4" />
            <div className="collapse-title text-xl font-medium">
              Are the scholarships on Scholars legitimate?
            </div>
            <div className="collapse-content">
              <p>
                Yes, Scholars only lists legitimate scholarships. Our database
                is vetted by our expert staff and updated daily, and each
                scholarship is verified to ensure accuracy and authenticity. We
                encourage users to report anything they may find suspicious or
                concerning and take the feedback we receive very seriously.
                Scholarships.com has been a trusted resource for students,
                parents, and educators for over 25 years.
              </p>
            </div>
          </div>
          <div className="collapse collapse-arrow join-item border-base-300 border">
            <input type="radio" name="my-accordion-4" />
            <div className="collapse-title text-xl font-medium">
              How can I help with a scholarship question?
            </div>
            <div className="collapse-content">
              <p>
                If you have a question about a scholarship, we recommend
                checking the scholarship listing first for details. Many
                listings include contact information for the provider, who can
                give the most accurate information. If you need further
                assistance or want to report an issue with a scholarship, you
                can contact us for support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Frequently;
