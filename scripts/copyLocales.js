const fs = require("fs-extra");
const path = require("path");

async function copyLocales() {
  await fs.copy(
    path.resolve(
      __dirname,
      "../node_modules/@orderly.network/i18n/dist/locales"
    ),
    path.resolve(__dirname, "../public/locales")
  );
}

copyLocales();
