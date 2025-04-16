import axios from "axios";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router";

const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const ApplicationForm = ({ data }) => {
  const [isDisable, setIsDisable] = useState(false);
  const navigate = useNavigate();
  const { successToast, errorToast } = useAuth();
  const { user, scholarship } = data;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const studyGap = watch("hasStudyGap");

  const onSubmit = async (data) => {
    try {
      const imageFile = { image: data.photo[0] };
      const res = await axios.post(image_hosting_api, imageFile, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      data.photoURL = res.data.data.display_url;
      data.userId = user._id;
      data.name = user.displayName;
      data.email = user.email;
      data.scholarshipId = scholarship._id;
      data.status = "pending";
      data.feedback = undefined;
      data.currentDate = new Date();

      await axios.post("http://localhost:5000/submit-application", data);

      setIsDisable(true);

      successToast("Your application is submitted!");

      navigate("/user-dashboard/application", { replace: true });
    } catch (error) {
      errorToast(error.response.data.message);
    }
  };

  return (
    <section className="container mx-auto mb-12 md:mb-16">
      <div className="mb-8 pt-8">
        <h2 className="text-4xl font-bold font-montserrat text-center mb-4">
          Application
        </h2>
        <p className="w-4/5 mx-auto text-center font-hind text-lg">
          Fill up the form below, check every information before you hit submit
          button
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-md mx-auto p-4 shadow-md bg-white rounded"
      >
        {/* Read-only Scholarship Fields */}
        <div>
          <label>University Name</label>
          <input
            type="text"
            value={scholarship.universityName}
            readOnly
            className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label>Scholarship Category</label>
          <input
            type="text"
            value={scholarship.scholarshipCategory}
            readOnly
            className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label>Subject Category</label>
          <input
            type="text"
            value={scholarship.subjectName}
            readOnly
            className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label>Phone Number</label>
          <input
            type="tel"
            {...register("phone", { required: "Phone number is required" })}
            className="input input-bordered w-full"
          />
          {errors.phone && (
            <p className="text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Photo Upload */}
        <div>
          <label>Photo</label>
          <input
            type="file"
            accept="image/*"
            {...register("photo", { required: "Photo is required" })}
            className="file-input w-full"
          />
          {errors.photo && (
            <p className="text-red-500">{errors.photo.message}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label>Address</label>
          <input
            type="text"
            placeholder="Village"
            {...register("village", { required: true })}
            className="input input-bordered w-full mb-2"
          />
          <input
            type="text"
            placeholder="District"
            {...register("district", { required: true })}
            className="input input-bordered w-full mb-2"
          />
          <input
            type="text"
            placeholder="Country"
            {...register("country", { required: true })}
            className="input input-bordered w-full"
          />
        </div>

        {/* Gender */}
        <div>
          <label>Gender</label>
          <select
            {...register("gender", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Degree */}
        <div>
          <label>Applying for Degree</label>
          <select
            {...register("degree", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select degree</option>
            <option value="Diploma">Diploma</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Masters">Masters</option>
          </select>
        </div>

        {/* SSC Result */}
        <div>
          <label>SSC Result</label>
          <input
            type="text"
            {...register("ssc", { required: true })}
            className="input input-bordered w-full"
          />
        </div>

        {/* HSC Result */}
        <div>
          <label>HSC Result</label>
          <input
            type="text"
            {...register("hsc", { required: true })}
            className="input input-bordered w-full"
          />
        </div>

        {/* Study Gap */}
        <div>
          <label>Do you have a study gap?</label>
          <select
            {...register("hasStudyGap")}
            className="select select-bordered w-full"
          >
            <option value="">Select option</option>
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>

        {/* If study gap is Yes, show a text input */}
        {studyGap === "Yes" && (
          <div>
            <label>Study Gap Duration / Reason</label>
            <input
              type="text"
              {...register("studyGapReason")}
              className="input input-bordered w-full"
              placeholder="Enter details..."
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isDisable}
          className="btn bg-orange text-white w-full"
        >
          Submit Application
        </button>
      </form>
    </section>
  );
};

export default ApplicationForm;
