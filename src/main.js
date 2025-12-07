import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import pinia from "./stores";
import i18n from "./i18n";

// Styles
import "./assets/styles/main.css";

// Create app
const app = createApp(App);

// Use plugins
app.use(pinia);
app.use(router);
app.use(i18n);

// Mount app
app.mount("#app");
