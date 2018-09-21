"use strict";

const shelljs = require("shelljs");
const path = require("path");

describe("cli", () => {
  it("works", () => {
    shelljs.cd(__dirname);
    shelljs.cd("cli-fixtures/works");
    const out = shelljs.exec(
      "node ../../../packages/wrap-legacy-decorators/src/index.js index.js --decorators-before-export --external-helpers"
    );

    expect(out.toString()).toMatchSnapshot();
  });

  it("requires --write for multiple files", () => {
    shelljs.cd(__dirname);
    shelljs.cd("cli-fixtures/multiple-files");
    const out = shelljs.exec(
      "node ../../../packages/wrap-legacy-decorators/src/index.js *.js --decorators-before-export --external-helpers"
    );

    const err = out.stderr
      .replace(path.join(__dirname, ".."), "[ROOT]")
      .replace(/\(node:\d+\)/g, "");
    expect(err).toMatchSnapshot();
  });
});
