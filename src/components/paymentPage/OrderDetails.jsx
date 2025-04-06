const OrderDetails = ({ data }) => {
  const {
    _id,
    universityName,
    universityImageLogo,
    universityLocationAddress,
    scholarshipCategory,
    applicationDeadline,
    subjectName,
    scholarshipDescription,
    stipend,
    postDate,
    serviceCharge,
    applicationFees,
    reviews,
  } = data;

  return (
    <section className="lg:w-3/5">
      <div className="px-5 border rounded-xl border-base-300">
        <h2 className="font-hind text-2xl font-semibold border-b border-base-300 py-5">
          Order Summary
        </h2>

        <div className="py-5 flex flex-col gap-4 border-b border-base-300">
          <div className="flex justify-between gap-5 font-hind">
            <p>University Name</p>
            <p>{universityName}</p>
          </div>

          <div className="flex justify-between gap-5 font-hind">
            <p>Location</p>
            <p>{universityLocationAddress}</p>
          </div>

          <div className="flex justify-between gap-5 font-hind">
            <p>Category</p>
            <p>{scholarshipCategory}</p>
          </div>

          <div className="flex justify-between gap-5 font-hind">
            <p>Subject</p>
            <p>{subjectName}</p>
          </div>

          <div className="flex justify-between gap-5 font-hind">
            <p>Application Fee</p>
            <p>${applicationFees}</p>
          </div>

          <div className="flex justify-between gap-5 font-hind">
            <p>Service Charge</p>
            <p>${serviceCharge}</p>
          </div>
        </div>
        
        <div className="py-5">
          <div className="flex justify-between gap-5 font-hind text-lg font-semibold">
            <p>Total</p>
            <p>${serviceCharge + applicationFees}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderDetails;
