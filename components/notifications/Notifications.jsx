import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { post } from "../../utils/requests";
import * as SecureStore from "expo-secure-store";

export const sendNotification = async () => {
  console.log("MANDO PUSH");
  const pushToken = await SecureStore.getItemAsync("pushToken");
  post("https://exp.host/--/api/v2/push/send", {
    to: pushToken,
    data: { extraData: "Some data" },
    title: "Viaje encontrado!",
    body: "Encontramos un viaje para vos",
  });
};

export const schedulePushNotification = async (seconds) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { data: "goes here" },
    },
    trigger: { seconds: seconds },
  });
};

export const handleNewNotification = async (notificationObject) => {
  try {
    const newNotification = {
      id: notificationObject.messageId,
      date: notificationObject.sentTime,
      title: notificationObject.data.title,
      body: notificationObject.data.message,
      data: JSON.parse(notificationObject.data.body),
    };
    console.log(newNotification);
    await Notifications.setBadgeCountAsync(1);
  } catch (error) {
    console.error(error);
  }
};
