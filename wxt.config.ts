import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  manifest:{
    permissions: ["storage", "scripting", "activeTab", "contextMenus"],
    name:"Sun-Panel BE",
    version:"0.1.1",
  }
});
