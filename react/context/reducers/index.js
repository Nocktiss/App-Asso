import notificationReducer from "./notification";

export default ({ notification }, action) => {
  return {
    notification: notificationReducer(notification, action),
  };
};
