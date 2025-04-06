import useAuth from "../../hooks/useAuth";

const UserProfileScreen = () => {
  const { user } = useAuth();
  const { displayName, email, emailVerified, photoURL } = user;

  return (
    <div className="grow">
      <div className="flex gap-6 items-start p-5 rounded-xl border border-base-300">
        <div className="avatar">
          <div className="ring-orange ring-offset-base-100 w-32 rounded-full ring ring-offset-2">
            <img src={photoURL} alt={`${displayName} photo`} />
          </div>
        </div>

        <div className="space-y-2 font-hind">
          <p className="text-2xl font-semibold">User Details</p>
          <p className="text-sm">Name: {displayName}</p>
          <p className="text-sm">Email: {email}</p>
          <p className="text-sm">Verified: {emailVerified ? "True" : "False"}</p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileScreen;
