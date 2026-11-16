const Notification = ({ message, notificationType = "success" }) => {
  if (message === null) {
    return null;
  }

  return <div className={`notification ${notificationType}`}>{message}</div>;
};

export default Notification;
