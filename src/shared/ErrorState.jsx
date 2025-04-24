const ErrorState = ({ title, message, actionLabel, action }) => {
  return (
    <div className="grow flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 text-4xl">⚠️</div>
      <h2 className="text-2xl font-montserrat font-bold mb-3">{title}</h2>
      <p className="font-hind text-base-content/80 max-w-md mb-6">{message}</p>

      {actionLabel && action && (
        <button onClick={() => action()} className="btn btn-primary mt-4">
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default ErrorState;
