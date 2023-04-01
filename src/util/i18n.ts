import i18n from "i18n";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
i18n.configure({
  defaultLocale: "en",
  directory: path.join(__dirname, "..", "locales"),
  locales: ["en", "pt_br"],
  logErrorFn: function (msg: string) {
    console.log(msg);
  },
  logWarnFn: function (msg: string) {
    console.log(msg);
  },
  missingKeyFn: function (_locale: string, value: string) {
    return value;
  },
  objectNotation: true,
  retryInDefaultLocale: true,
});
// make a language detector decorator

i18n.setLocale("en");

export { i18n };
