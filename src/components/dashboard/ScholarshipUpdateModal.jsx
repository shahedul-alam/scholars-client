import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ScholarshipUpdateModal = ({ modalId, scholarship }) => {
  const [isLoading, setIsLoading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const { user, successToast, errorToast } = useAuth();

  // Extract image hosting configuration
  const image_hosting_key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
  const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

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
    applicationFees,
    serviceCharge,
    reviews,
  } = scholarship;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
    watch,
  } = useForm();

  const [previewImage, setPreviewImage] = useState("");

  // Prefill form when scholarship data is available
  useEffect(() => {
    if (scholarship) {
      reset({
        universityName: universityName || "",
        photo: "",
        scholarshipCategory: scholarshipCategory || "",
        universityLocationAddress: universityLocationAddress || "",
        applicationDeadline: applicationDeadline || "",
        subjectName: subjectName || "",
        scholarshipDescription: scholarshipDescription || "",
        stipend: stipend || "",
        serviceCharge: serviceCharge || "",
        applicationFees: applicationFees || "",
      });
      setPreviewImage(scholarship.universityImageLogo);
    }
  }, [scholarship, reset]);

  const logoInput = watch("universityImageLogo");

  useEffect(() => {
    // If it's a FileList (new upload)
    if (logoInput instanceof FileList && logoInput.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(logoInput[0]);
    }

    // If it's a string URL (pre-filled value)
    else if (typeof logoInput === "string") {
      setPreviewImage(logoInput);
    }
  }, [logoInput]);

  const closeModal = () => {
    document.getElementById(modalId).close();
  };

  const onSubmit = async (formData) => {
    try {
      setIsLoading(true);
      let photoURL = universityImageLogo;

      // If user uploaded new photo
      if (formData.photo?.[0]) {
        const imageFormData = new FormData();
        imageFormData.append("image", formData.photo[0]);

        try {
          const res = await axios.post(image_hosting_api, imageFormData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (res.data?.success) {
            photoURL = res.data.data.display_url;
          } else {
            throw new Error("Failed to upload image");
          }
        } catch (error) {
          console.error("Image upload failed:", error);
        }
      }

      const {
        photo,
        serviceCharge,
        applicationFees,
        stipend,
        ...dataToUpdate
      } = formData;

      const updatedData = {
        ...dataToUpdate,
        universityImageLogo: photoURL,
        serviceCharge: parseInt(serviceCharge),
        applicationFees: parseInt(applicationFees),
        stipend: parseInt(stipend),
        postDate: new Date().toISOString(),
        reviews,
      };

      await axiosSecure.patch(
        `/update-scholarship/${_id}?email=${user.email}`,
        updatedData
      );

      successToast("Scholarship updated successfully!");
      closeModal();
    } catch (error) {
      errorToast(
        error?.response?.data?.message || "Failed to update scholarship"
      );
      console.error("Update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box">
        <h3 className="font-bold font-montserrat text-lg mb-4">
          Edit scholarship of {universityName}
        </h3>

        <div>
          <form
            method="dialog"
            className="w-full space-y-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="form-control">
              <label className="label">University Name</label>
              <input
                {...register("universityName", { required: true })}
                className="input input-bordered w-full"
              />
              {errors[universityName] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[universityName].message}
                </p>
              )}
            </div>

            <div className="form-control">
              <label className="label">University Logo (Image Upload)</label>
              <input
                type="file"
                accept="image/*"
                {...register("photo")}
                className="file-input file-input-bordered w-full"
              />
              {errors[universityImageLogo] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[universityImageLogo].message}
                </p>
              )}
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Logo Preview"
                  className="mt-2 rounded w-60 h-32 object-contain"
                />
              )}
            </div>

            <div className="form-control">
              <label className="label">Scholarship Category</label>
              <input
                {...register("scholarshipCategory", { required: true })}
                className="input input-bordered w-full"
              />
              {errors[universityImageLogo] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[universityImageLogo].message}
                </p>
              )}
            </div>

            <div className="form-control">
              <label className="label">University Address</label>
              <input
                {...register("universityLocationAddress", { required: true })}
                className="input input-bordered w-full"
              />
              {errors[universityLocationAddress] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[universityLocationAddress].message}
                </p>
              )}
            </div>

            <div className="form-control">
              <label className="label">Application Deadline</label>
              <input
                type="date"
                {...register("applicationDeadline", { required: true })}
                className="input input-bordered w-full"
              />
              {errors[applicationDeadline] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[applicationDeadline].message}
                </p>
              )}
            </div>

            <div className="form-control">
              <label className="label">Subject Name</label>
              <input
                {...register("subjectName", { required: true })}
                className="input input-bordered w-full"
              />
              {errors[subjectName] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[subjectName].message}
                </p>
              )}
            </div>

            <div className="form-control">
              <label className="label">Scholarship Description</label>
              <textarea
                {...register("scholarshipDescription", { required: true })}
                className="textarea textarea-bordered w-full"
              />
              {errors[scholarshipDescription] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[scholarshipDescription].message}
                </p>
              )}
            </div>

            <div className="form-control">
              <label className="label">Stipend</label>
              <input
                {...register("stipend", { required: true })}
                className="input input-bordered w-full"
              />
              {errors[stipend] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[stipend].message}
                </p>
              )}
            </div>

            <div className="form-control">
              <label className="label">Service Charge</label>
              <input
                {...register("serviceCharge", { required: true })}
                className="input input-bordered w-full"
              />
              {errors[serviceCharge] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[serviceCharge].message}
                </p>
              )}
            </div>

            <div className="form-control">
              <label className="label">Application Fees</label>
              <input
                {...register("applicationFees", { required: true })}
                className="input input-bordered w-full"
              />
              {errors[applicationFees] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[applicationFees].message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="btn"
                onClick={closeModal}
                aria-label="Close review dialog"
              >
                Close
              </button>

              <button
                type="submit"
                disabled={!isDirty || isSubmitting || isLoading}
                className="btn bg-orange text-white"
              >
                {isLoading ? "Updating..." : "Update Scholarship"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ScholarshipUpdateModal;
