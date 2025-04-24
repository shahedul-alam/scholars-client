import axios from "axios";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import { axiosPublic } from "../../hooks/useAxiosSecure";

const UpdateApplicationForm = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { successToast, errorToast } = useAuth();

  // Extract image hosting configuration
  const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty, dirtyFields },
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
      hasStudyGap: "No",
      studyGapReason: "",
    },
  });

  const studyGap = watch("hasStudyGap");

  // Populate form with existing data
  useEffect(() => {
    if (data) {
      reset({
        phone: data.phone || "",
        village: data.village || "",
        district: data.district || "",
        country: data.country || "",
        gender: data.gender || "",
        degree: data.degree || "",
        ssc: data.ssc || "",
        hsc: data.hsc || "",
        hasStudyGap: data.hasStudyGap || "No",
        studyGapReason: data.studyGapReason || "",
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);
      let photoURL = data.photoURL;

      // If user uploaded new photo
      if (formData.photo?.[0]) {
        const formData = new FormData();
        formData.append("image", formData.photo[0]);

        const res = await axios.post(image_hosting_api, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data?.success) {
          photoURL = res.data?.data?.url;
        } else {
          throw new Error("Failed to upload image");
        }
      }

      // Remove photo field from data to be sent
      const { photo, ...dataToUpdate } = formData;

      const updatedData = {
        ...dataToUpdate,
        _id: data._id,
        photoURL,
        userId: data.userId,
        email: data.email,
        name: data.name,
        scholarshipId: data.scholarshipId,
        paymentId: data.paymentId,
        status: "pending",
        feedback: "",
        currentDate: new Date().toISOString(),
      };

      await axiosPublic.patch(
        `/update-application/${updatedData._id}`,
        updatedData
      );

      successToast("Application updated successfully!");
      navigate("/user-dashboard/applications");
    } catch (err) {
      errorToast(
        err?.response?.data?.message || "Failed to update application"
      );
      console.error("Update error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Form field renderer to reduce repetition
  const renderTextField = (name, label, required = true, type = "text") => (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        type={type}
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
        <span className="label-text">{label}</span>
      </label>
      <select
        {...register(name, {
          required: required ? `${label} is required` : false,
        })}
        className="select select-bordered w-full"
      >
        <option value="">Select {label}</option>
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

  const renderReadonlyField = (label, value) => (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        type="text"
        value={value}
        readOnly
        className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
      />
    </div>
  );

  return (
    <section className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">
        Update Application
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-xl mx-auto space-y-4 bg-white shadow-md rounded p-6"
      >
        {/* Scholarship Info (read-only) */}
        {data?.scholarship && (
          <>
            {renderReadonlyField("University", data.scholarship.universityName)}
            {renderReadonlyField(
              "Scholarship Category",
              data.scholarship.scholarshipCategory
            )}
            {renderReadonlyField("Subject", data.scholarship.subjectName)}
          </>
        )}

        {/* Editable Fields */}
        {renderTextField("phone", "Phone")}

        <div className="form-control">
          <label className="label">
            <span className="label-text">Upload Photo (optional)</span>
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("photo")}
            className="file-input file-input-bordered w-full"
          />
        </div>

        {renderTextField("village", "Village")}
        {renderTextField("district", "District")}
        {renderTextField("country", "Country")}

        {renderSelectField("gender", "Gender", [
          { value: "Male", label: "Male" },
          { value: "Female", label: "Female" },
          { value: "Other", label: "Other" },
        ])}

        {renderSelectField("degree", "Degree", [
          { value: "Diploma", label: "Diploma" },
          { value: "Bachelor", label: "Bachelor" },
          { value: "Masters", label: "Masters" },
        ])}

        {renderTextField("ssc", "SSC Result")}
        {renderTextField("hsc", "HSC Result")}

        {renderSelectField("hasStudyGap", "Do you have a study gap?", [
          { value: "No", label: "No" },
          { value: "Yes", label: "Yes" },
        ])}

        {studyGap === "Yes" &&
          renderTextField("studyGapReason", "Study Gap Reason")}

        <button
          type="submit"
          disabled={isLoading || !isDirty}
          className={`btn btn-primary w-full mt-4 ${
            isLoading ? "loading" : ""
          }`}
        >
          {isLoading ? "Updating..." : "Update Application"}
        </button>
      </form>
    </section>
  );
};

export default UpdateApplicationForm;
