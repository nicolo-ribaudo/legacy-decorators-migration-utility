"use strict";

const { declare } = require("@babel/helper-plugin-utils");
const { types: t } = require("@babel/core");
const { addDefault } = require("@babel/helper-module-imports");

const buildHelper = require("./helper");

module.exports = declare((api, options) => {
  api.assertVersion(7);

  const { externalHelpers = false, decoratorsBeforeExport } = options;
  if (decoratorsBeforeExport === undefined) {
    throw new Error(
      "'babel-plugin-wrap-decorators-legacy' plugin requires a " +
      "'decoratorsBeforeExport' option, whose value must be a boolean."
    );
  }

  let helperIds = new WeakMap();

  function hasDecorators(node) {
    return node.decorators && node.decorators.length > 0;
  }

  return {
    manipulateOptions({ parserOpts, generatorOpts }) {
      parserOpts.plugins.push("decorators-legacy");
      generatorOpts.decoratorsBeforeExport = decoratorsBeforeExport
    },

    visitor: {
      "Class|ClassMethod|ClassProperty"(path) {
        if (!hasDecorators(path.node)) return;

        const programPath = path.scope.getProgramParent().path;
        let id = helperIds.get(programPath.node);
        if (!id) {
          if (externalHelpers) {
            id = addDefault(programPath, "decorators-compat", {
              importedInterop: "uncompiled",
              nameHint: "_"
            });
          } else {
            id = path.scope.generateUidIdentifier("decoratorsCompat");
            const helper = buildHelper({ ID: id });
            helper._compact = true;
            programPath.unshiftContainer("body", helper);
          }

          helperIds.set(programPath.node, id);
        }

        path.node.decorators = [
          t.decorator(
            t.callExpression(t.cloneNode(id), [
              t.arrayExpression(path.node.decorators.map(dec => dec.expression))
            ])
          )
        ];
      },
      "ObjectMethod|ObjectProperty"(path) {
        if (hasDecorators(path.node)) {
          throw path.buildCodeFrameError(
            "The new decorators proposal doesn't support object decrators. "
            + "You must manually remove them before upgrading your file."
          )
        }
      }
    }
  };
});
