import i18n from "i18n";

i18n.configure({
  defaultLocale: "en",
  directory: "src/locales",
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
