import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { persistor, store } from "./Context/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Toaster
          position="bottom-right"
          toastOptions={{
            // Define default options
            className: "",
            duration: 5000,
            style: {
              background: `${({ theme }) => theme.bg}`,
              color: `${({ theme }) => theme.text}`,
            },
          }}
        />
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
