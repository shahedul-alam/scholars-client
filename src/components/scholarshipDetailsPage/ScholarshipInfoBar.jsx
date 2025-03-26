import { MdAttachMoney } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { MdSubject } from "react-icons/md";
import { MdOutlineDateRange } from "react-icons/md";

const ScholarshipInfoBar = ({ data }) => {
  const {
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
    <div className="border border-blue rounded-lg md:w-2/5 h-fit">
      <div className="p-6 border-b border-blue">
        <h2 className="font-montserrat text-xl font-semibold">
          Scholarship Information
        </h2>
      </div>

      <div className="p-6 space-y-3 font-hind">
        <div className="flex items-center gap-4">
          <BiCategory className="text-2xl" />
          <div>
            <p className="text-lg font-medium">Category:</p>
            <p className="text-blue">{scholarshipCategory}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <MdSubject className="text-2xl" />
          <div>
            <p className="text-lg font-medium">Subject:</p>
            <p className="text-blue">{subjectName}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <MdAttachMoney className="text-2xl" />
          <div>
            <p className="text-lg font-medium">Stipend:</p>
            <p className="text-blue">{stipend ? `$${stipend}` : "None"}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <MdOutlineDateRange className="text-2xl" />
          <div>
            <p className="text-lg font-medium">Post Date:</p>
            <p className="text-blue">{postDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <MdOutlineDateRange className="text-2xl" />
          <div>
            <p className="text-lg font-medium">Deadline:</p>
            <p className="text-blue">{applicationDeadline}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <MdAttachMoney className="text-2xl" />
          <div>
            <p className="text-lg font-medium">Application Fee:</p>
            <p className="text-blue">${applicationFees}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <MdAttachMoney className="text-2xl" />
          <div>
            <p className="text-lg font-medium">Service Charge:</p>
            <p className="text-blue">${serviceCharge}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipInfoBar;
