import '../../../config.js';
import { createContext } from "react";

const NotificationContext = createContext();

export const NotificationProvider = NotificationContext.Provider;

export default NotificationContext;

