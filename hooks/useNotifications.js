import { useState, useEffect } from "react";

export function useNotifications() {
  const [permission, setPermission] = useState("default");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported by the browser
    if ("Notification" in window) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  async function requestPermission() {
    if (!("Notification" in window)) {
      console.warn("This browser does not support desktop notification");
      return "denied";
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return "denied";
    }
  }

  // request on app render
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    requestPermission();
  }, []);

  return {
    permission,
    requestPermission,
    isSupported,
  };
}
