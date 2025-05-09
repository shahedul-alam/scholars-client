const ApplicationFeedbackModal = ({ feedbackModalId }) => {
  return (
    <dialog id={feedbackModalId} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Hello!</h3>
        <p className="py-4">Press ESC key or click the button below to close</p>
        <div className="modal-action"></div>
      </div>
    </dialog>
  );
};

export default ApplicationFeedbackModal;
