"use strict";

const { template } = require("@babel/core");

module.exports = template.statement`
  function ID(decorators) {
    function applyFieldDecorators(decorators, target, key, desc, isStatic) {
      desc = decorators.reduceRight(
        (desc, dec) => dec(target, key, desc) || desc,
        desc
      );

      if (isStatic) {
        if (desc.initializer !== void 0) {
          desc.value = desc.initializer.call(target);
          desc.initializer = void 0;
        }

        Object.defineProperty(target, key, desc);
      }

      return desc;
    }

    function applyMethodDecorators(decorators, target, key) {
      const desc = decorators.reduceRight(
        (desc, dec) => dec(target, key, desc) || desc,
        Object.getOwnPropertyDescriptor(target, key)
      );
      Object.defineProperty(target, key, desc);
    }

    ID = decorators => descriptor => {
      if (descriptor.kind === "class") {
        descriptor.finisher = Class => decorators.reduceRight(
          (Class, dec) => dec(Class) || Class,
          Class
        );
      } else if (descriptor.kind === "method" && descriptor.placement === "static") {
        descriptor.finisher = (Class) => {
          applyMethodDecorators(decorators, Class, descriptor.key);
        };
      } else if (descriptor.kind === "method" && descriptor.placement === "prototype") {
        descriptor.finisher = (Class) => {
          applyMethodDecorators(decorators, Class.prototype, descriptor.key);
        };
      } else if (descriptor.kind === "field" && descriptor.placement === "static") {
        descriptor.finisher = Class => {
          const { key } = descriptor;
          const desc = Object.getOwnPropertyDescriptor(Class, key);
          applyFieldDecorators(
            decorators,
            Class,
            key,
            {
              enumerable: true,
              writable: true,
              configurable: true,
              value: desc && desc.value,
              initializer: void 0,
            },
            true
          );
        };
      } else if (descriptor.kind === "field" && descriptor.placement === "own") {
        let decorator;
        const { key, initializer } = descriptor;
        descriptor.initializer = undefined;
        const desc = applyFieldDecorators(
          decorators,
          {},
          key,
          { enumerable: true, writable: true, configurable: true, initializer },
        );
        descriptor.descriptor = desc;
        descriptor.initializer = function () {
          return desc.initializer ? desc.initializer.call(this) : desc.value;
        };
      } else {
        throw new Error("Unsupported decorated element.");
      }
    };

    return ID(decorators);
  }
`;

module.exports._compact = true;
