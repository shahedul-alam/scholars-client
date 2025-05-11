import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import Loading from "../../shared/Loading";

const ProfileScreen = () => {
  const { user, loading, dbUser } = useAuth();
  const { displayName, email, emailVerified, photoURL } = user || {};
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // Get user initials for fallback avatar
  const getInitials = () => {
    if (!displayName) return "U";
    return displayName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) <Loading />;

  return (
    <section className="grow px-4 md:px-0">
      <div className="bg-white shadow-md rounded-xl border border-base-300 overflow-hidden">
        {/* Header Banner */}
        <div className="h-32 bg-gradient-to-r from-orange to-amber-400"></div>

        {/* Profile Content */}
        <div className="px-6 pb-6 relative">
          {/* Avatar - positioned to overlap the banner */}
          <div className="avatar -mt-16 mb-4">
            <div className="ring-orange ring-offset-base-100 w-32 rounded-full ring-4 ring-offset-2 bg-base-200 shadow-lg">
              {!imageError && photoURL ? (
                <img
                  src={photoURL}
                  alt={`${displayName || "User"}'s profile`}
                  onError={handleImageError}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-orange text-white text-3xl font-bold">
                  {getInitials()}
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-4 font-hind">
            <div>
              <h1 className="text-2xl font-bold font-montserrat">
                {displayName || "User"}
              </h1>
              <p className="text-gray-500">{email || "No email available"}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <InfoCard
                title="Account Information"
                items={[
                  { label: "Full Name", value: displayName || "Not provided" },
                  { label: "Email", value: email || "Not provided" },
                  {
                    label: "Email Verification",
                    value: emailVerified ? (
                      <span className="badge badge-success text-white">
                        Verified
                      </span>
                    ) : (
                      <span className="badge badge-warning text-white">
                        Unverified
                      </span>
                    ),
                  },
                  ...(dbUser?.role !== "user"
                    ? [
                        {
                          label: "Role",
                          value: dbUser?.role || "Not provided",
                        },
                      ]
                    : []),
                ]}
              />

              <InfoCard
                title="Account Settings"
                className="bg-gray-50"
                items={[
                  {
                    label: "Update Profile",
                    value: (
                      <button className="btn btn-sm btn-primary">Edit</button>
                    ),
                  },
                  {
                    label: "Change Password",
                    value: (
                      <button className="btn btn-sm btn-outline">Reset</button>
                    ),
                  },
                ]}
              />
            </div>

            <div className="mt-6 pt-4 border-t border-base-300">
              <p className="text-sm text-gray-500">
                Account created:{" "}
                {user?.metadata?.creationTime
                  ? new Date(user.metadata.creationTime).toLocaleDateString()
                  : "Unknown"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Reusable info card component
const InfoCard = ({ title, items, className = "" }) => {
  return (
    <div className={`p-4 rounded-lg border border-base-200 ${className}`}>
      <h3 className="font-semibold mb-3 font-montserrat">{title}</h3>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{item.label}:</span>
            <div className="text-sm font-medium">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileScreen;
