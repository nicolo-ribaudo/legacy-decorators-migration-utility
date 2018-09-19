const wrapLegacyDecorators = require("./helpers/wrap-legacy-decorators");

function snapshot(
  name,
  code,
  options = { decoratorsBeforeExport: true, externalHelpers: true }
) {
  it(name, () => {
    expect(wrapLegacyDecorators(code, options)).toMatchSnapshot();
  });
}

function lazyWrapLegacyDecorators(
  code,
  options = { decoratorsBeforeExport: true, externalHelpers: true }
) {
  return () => wrapLegacyDecorators(code, options);
}

describe("babel-plugin-wrap-legacy-decorators", () => {
  snapshot(
    "undecorated class",
    `
      class Foo {}
    `
  );

  describe("wrap decorators", () => {
    snapshot(
      "class",
      `
        @dec1
        @dec2
        class Foo {}
      `
    );

    snapshot(
      "method",
      `
        class Foo {
          @dec1
          @dec2
          method() {}
        }
      `
    );

    snapshot(
      "field",
      `
        class Foo {
          @dec1
          @dec2
          foo = 2;
        }
      `
    );
  });

  describe("decoratorsBeforeExport", () => {
    snapshot("true", `@dec export class Foo {}`, {
      externalHelpers: true,
      decoratorsBeforeExport: true
    });

    snapshot("false", `@dec export class Foo {}`, {
      externalHelpers: true,
      decoratorsBeforeExport: false
    });
  });

  snapshot(
    "inline helper",
    `
       @dec
       class Foo {}
    `,
    { externalHelpers: false, decoratorsBeforeExport: true }
  );

  describe("object decorators throw", () => {
    it("property", () => {
      expect(lazyWrapLegacyDecorators("({ @dec foo: 2 })")).toThrow();
    });

    it("method", () => {
      expect(lazyWrapLegacyDecorators("({ @dec method() {} })")).toThrow();
    });
  });
});
