#!/usr/bin/env node

"use strict";

const util = require("util");
const readFile = util.promisify(require("fs").readFile);
const writeFile = util.promisify(require("fs").writeFile);
const path = require("path");
const program = require("commander");
const babel = require("@babel/core");
const recast = require("recast");
const babelPluginWrapLegacyDecorators = require("babel-plugin-wrap-legacy-decorators");

program
  .version("1.0.0", "-v, --version")
  .arguments("<file>")
  .option("--write", "Overwrite the input file")
  .option(
    "--external-helpers",
    "Load the needed helpers from the 'decorators-compat' package (you first need to install it)."
  )
  .option("--decorators-before-export", "Outputs '@dec export class'.")
  .option(
    "--decorators-after-export",
    "Outputs 'export @dec class'. NOTE: Either '--decorators-before-export' or '--decorators-after-export' is required."
  )
  .action(run)
  .parse(process.argv);

async function run(filename) {
  const externalHelpers = program.externalHelpers || false;

  let decoratorsBeforeExport;
  if (program.decoratorsBeforeExport) {
    if (program.decoratorsAfterExport) {
      console.error(
        "The '--decorators-before-export' and '--decorators-after-export' options are not compatible."
      );
      process.exit(1);
    } else {
      decoratorsBeforeExport = true;
    }
  } else {
    if (program.decoratorsAfterExport) {
      decoratorsBeforeExport = false;
    } else {
      console.error(
        "Either '--decorators-before-export' or '--decorators-after-export' is required."
      );
      process.exit(1);
    }
  }

  filename = path.resolve(filename);

  const code = await readFile(filename, "utf-8");

  const output = await babelRecast(
    code,
    { filename },
    {
      configFile: false,
      plugins: [
        [
          babelPluginWrapLegacyDecorators,
          { decoratorsBeforeExport, externalHelpers }
        ]
      ]
    }
  );

  if (program.write) {
    await writeFile(filename, output);
  } else {
    console.log(output);
  }
}

async function babelRecast(code, parserOpts, transformerOpts) {
  const ast = recast.parse(code, {
    parser: {
      parse: source => babel.parse(source, parserOpts)
    }
  });

  const opts = Object.assign(
    {
      ast: true,
      code: false
    },
    transformerOpts,
    {
      plugins: [
        // For some reason, recast doesn't work with transformFromAst.
        // Use this hack instead.
        [setAst, { ast }]
      ].concat(transformerOpts.plugins || [])
    }
  );

  const output = await babel.transformAsync("", opts);

  return recast.print(output.ast).code;
}

function setAst(babel, { ast }) {
  return {
    visitor: {
      Program(path) {
        path.replaceWith(ast.program);
      }
    }
  };
}
