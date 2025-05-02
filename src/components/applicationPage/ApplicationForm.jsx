import axios from "axios";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router";
import { axiosPublic } from "../../hooks/useAxiosSecure";

const ApplicationForm = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { successToast, errorToast } = useAuth();
  const { user, scholarship, payment } = data;

  // Image hosting configuration
  const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: "",
      village: "",
      district: "",
      country: "",
      gender: "",
      degree: "",
      ssc: "",
      hsc: "",
      hasStudyGap: "",
      studyGapReason: "",
    },
  });

  const studyGap = watch("hasStudyGap");

  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);

      // Handle photo upload
      if (!formData.photo || !formData.photo[0]) {
        throw new Error("Photo is required");
      }

      const formDataForImage = new FormData();
      formDataForImage.append("image", formData.photo[0]);

      const res = await axios.post(image_hosting_api, formDataForImage, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!res.data?.data?.display_url) {
        throw new Error("Failed to upload image");
      }

      // Remove photo field and prepare application data
      const { photo, ...applicationData } = formData;

      const finalApplicationData = {
        ...applicationData,
        photoURL: res.data.data.display_url,
        userId: user._id,
        name: user.displayName,
        email: user.email,
        scholarshipId: scholarship._id,
        paymentId: payment._id,
        status: "pending",
        feedback: "",
        currentDate: new Date().toISOString(),
        // Clear study gap reason if not applicable
        studyGapReason:
          formData.hasStudyGap === "No" ? "" : formData.studyGapReason,
      };

      // Submit application
      await axiosPublic.post("/submit-application", finalApplicationData);

      successToast("Your application has been submitted successfully!");
      navigate("/dashboard/applications", { replace: true });
    } catch (error) {
      console.error("Application submission error:", error);
      errorToast(
        error?.response?.data?.message || "Failed to submit application"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions to reduce repetition
  const renderReadOnlyField = (label, value) => (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">{label}</span>
      </label>
      <input
        type="text"
        value={value}
        readOnly
        className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
      />
    </div>
  );

  const renderTextField = (name, label, placeholder = "", required = true) => (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">{label}</span>
      </label>
      <input
        type="text"
        placeholder={placeholder}
        {...register(name, {
          required: required ? `${label} is required` : false,
        })}
        className="input input-bordered w-full"
      />
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );

  const renderSelectField = (name, label, options, required = true) => (
    <div className="form-control">
      <label className="label">
        <span className="label-text font-medium">{label}</span>
      </label>
      <select
        {...register(name, {
          required: required ? `${label} is required` : false,
        })}
        className="select select-bordered w-full"
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );

  return (
    <section className="container mx-auto mb-12 md:mb-16">
      <div className="mb-8 pt-8">
        <h2 className="text-4xl font-bold font-montserrat text-center mb-4">
          Scholarship Application
        </h2>
        <p className="w-4/5 mx-auto text-center font-hind text-lg">
          Please fill in all required information. Review carefully before
          submitting.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-w-md mx-auto p-6 shadow-md bg-white rounded"
      >
        {/* Scholarship Information Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Scholarship Details</h3>
          {renderReadOnlyField("University Name", scholarship.universityName)}
          {renderReadOnlyField(
            "Scholarship Category",
            scholarship.scholarshipCategory
          )}
          {renderReadOnlyField("Subject", scholarship.subjectName)}
        </div>

        {/* Personal Information Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
          {renderTextField("phone", "Phone Number")}

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Photo</span>
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("photo", { required: "Photo is required" })}
              className="file-input file-input-bordered w-full"
            />
            {errors.photo && (
              <p className="text-red-500 text-sm mt-1">
                {errors.photo.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label className="label">
              <span className="label-text font-medium">Address</span>
            </label>
            <div className="grid gap-2">
              {renderTextField("village", "Village", "Enter village or street")}
              {renderTextField(
                "district",
                "District",
                "Enter district or city"
              )}
              {renderTextField("country", "Country", "Enter country")}
            </div>
          </div>

          {renderSelectField("gender", "Gender", [
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
            { value: "Other", label: "Other" },
          ])}
        </div>

        {/* Educational Information Section */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3">
            Educational Information
          </h3>
          {renderSelectField("degree", "Applying for Degree", [
            { value: "Diploma", label: "Diploma" },
            { value: "Bachelor", label: "Bachelor" },
            { value: "Masters", label: "Masters" },
          ])}

          {renderTextField("ssc", "SSC Result", "Enter your SSC GPA/Grade")}
          {renderTextField("hsc", "HSC Result", "Enter your HSC GPA/Grade")}

          {renderSelectField("hasStudyGap", "Do you have a study gap?", [
            { value: "No", label: "No" },
            { value: "Yes", label: "Yes" },
          ])}

          {studyGap === "Yes" &&
            renderTextField(
              "studyGapReason",
              "Study Gap Reason",
              "Please explain the duration and reason"
            )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`btn bg-orange text-white w-full ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </section>
  );
};

export default ApplicationForm;
