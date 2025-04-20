import { Link } from "react-router";

const EmptyState = ({ title, message, actionLabel, actionLink }) => {
  return (
    <div className="grow flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 text-4xl">📭</div>
      <h2 className="text-2xl font-montserrat font-bold mb-3">{title}</h2>
      <p className="font-hind text-base-content/80 max-w-md mb-6">{message}</p>

      {actionLabel && actionLink && (
        <Link to={actionLink} className="btn btn-primary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
