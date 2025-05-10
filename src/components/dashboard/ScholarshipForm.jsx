import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const ScholarshipForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const axiosSecure = useAxiosSecure();
  const { user, successToast, errorToast } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm();

  // Extract image hosting configuration
  const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      let imageUrl = "";
      if (data.photo && data.photo[0]) {
        const imageFormData = new FormData();
        imageFormData.append("image", data.photo[0]);

        try {
          const response = await axios.post(image_hosting_api, imageFormData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (response.data?.success) {
            imageUrl = response.data.data.display_url;
          } else {
            throw new Error("Failed to upload image");
          }
        } catch (error) {
          console.error("Image upload failed:", error);
        }
      }
      const scholarshipData = {
        scholarshipName: data.scholarshipName.trim(),
        universityName: data.universityName.trim(),
        universityImageLogo: imageUrl,
        universityLocationAddress: `${data.universityCity.trim()}, ${data.universityCountry.trim()}`,
        universityWorldRank: parseInt(data.universityWorldRank),
        subjectName: data.subjectCategory,
        scholarshipCategory: data.scholarshipCategory,
        degree: data.degree,
        scholarshipDescription: data.scholarshipDescription.trim(),
        stipend: data.stipend ? parseFloat(data.stipend) : null,
        tuitionFees: data.tuitionFees ? parseFloat(data.tuitionFees) : null,
        applicationFees: parseFloat(data.applicationFees),
        serviceCharge: parseFloat(data.serviceCharge),
        applicationDeadline: data.applicationDeadline,
        postDate: new Date().toISOString(),
        postedUserEmail: user?.email,
        reviews: [],
      };

      await axiosSecure.post(
        `/post-scholarship-moderator?email=${user.email}`,
        scholarshipData
      );

      successToast("Scholarship posted successfully!");
      reset({
        scholarshipName: "",
        universityName: "",
        universityCountry: "",
        universityCity: "",
        universityWorldRank: "",
        subjectCategory: "",
        scholarshipCategory: "",
        degree: "",
        scholarshipDescription: "",
        stipend: "",
        tuitionFees: "",
        applicationFees: "",
        serviceCharge: "",
        applicationDeadline: "",
        photo: null,
      });
      setPreviewImage("");
    } catch (error) {
      errorToast(
        error?.response?.data?.message || "Failed to post scholarship"
      );
      console.error("Error posting scholarship:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreviewImage(URL.createObjectURL(file));
  };

  return (
    <div className="max-w-xl">
      <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          label="Scholarship Name"
          error={errors.scholarshipName}
          required
        >
          <input
            {...register("scholarshipName", { required: true })}
            className="input input-bordered w-full"
          />
        </FormField>

        <FormField
          label="University Name"
          error={errors.universityName}
          required
        >
          <input
            {...register("universityName", { required: true })}
            className="input input-bordered w-full"
          />
        </FormField>

        <div className="form-control">
          <label className="label">University Logo (Image Upload)</label>
          <input
            type="file"
            accept="image/*"
            {...register("photo")}
            onChange={handleImageChange}
            className="file-input file-input-bordered w-full"
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Logo Preview"
              className="mt-2 rounded w-60 h-32 object-contain"
            />
          )}
        </div>

        <FormField
          label="University Country"
          error={errors.universityCountry}
          required
        >
          <input
            {...register("universityCountry", { required: true })}
            className="input input-bordered w-full"
          />
        </FormField>

        <FormField
          label="University City"
          error={errors.universityCity}
          required
        >
          <input
            {...register("universityCity", { required: true })}
            className="input input-bordered w-full"
          />
        </FormField>

        <FormField
          label="University World Rank"
          error={errors.universityWorldRank}
          required
        >
          <input
            type="number"
            {...register("universityWorldRank", { required: true })}
            className="input input-bordered w-full"
          />
        </FormField>

        <FormField
          label="Subject Category"
          error={errors.subjectCategory}
          required
        >
          <select
            {...register("subjectCategory", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Engineering">Engineering</option>
            <option value="Doctor">Doctor</option>
          </select>
        </FormField>

        <FormField
          label="Scholarship Category"
          error={errors.scholarshipCategory}
          required
        >
          <select
            {...register("scholarshipCategory", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select</option>
            <option value="Full fund">Full fund</option>
            <option value="Partial">Partial</option>
            <option value="Self-fund">Self-fund</option>
          </select>
        </FormField>

        <FormField label="Degree" error={errors.degree} required>
          <select
            {...register("degree", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select</option>
            <option value="Diploma">Diploma</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Masters">Masters</option>
          </select>
        </FormField>

        <FormField
          label="Description"
          error={errors.scholarshipDescription}
          required
        >
          <textarea
            type="text"
            {...register("scholarshipDescription")}
            className="textarea textarea-bordered w-full"
          />
        </FormField>

        <FormField label="Stipend (Optional)" error={errors.stipend}>
          <input
            type="number"
            {...register("stipend")}
            className="input input-bordered w-full"
          />
        </FormField>

        <FormField label="Tuition Fees (Optional)" error={errors.tuitionFees}>
          <input
            type="number"
            {...register("tuitionFees")}
            className="input input-bordered w-full"
          />
        </FormField>

        <FormField
          label="Application Fees"
          error={errors.applicationFees}
          required
        >
          <input
            type="number"
            {...register("applicationFees", { required: true })}
            className="input input-bordered w-full"
          />
        </FormField>

        <FormField label="Service Charge" error={errors.serviceCharge} required>
          <input
            type="number"
            {...register("serviceCharge", { required: true })}
            className="input input-bordered w-full"
          />
        </FormField>

        <FormField
          label="Application Deadline"
          error={errors.applicationDeadline}
          required
        >
          <input
            type="date"
            {...register("applicationDeadline", { required: true })}
            className="input input-bordered w-full"
          />
        </FormField>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isDirty || isSubmitting || isLoading}
            className="btn bg-orange text-white"
          >
            {isLoading ? "Posting..." : "Post Scholarship"}
          </button>
        </div>
      </form>
    </div>
  );
};

const FormField = ({ label, error, required, children }) => (
  <div className="form-control">
    <label className="label">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && (
      <p className="text-red-500 text-sm mt-1">
        {error.message || `${label} is required.`}
      </p>
    )}
  </div>
);

export default ScholarshipForm;
