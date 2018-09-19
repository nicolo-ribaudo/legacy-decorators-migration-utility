export default decoratorsCompat;

function decoratorsCompat(decorators) {
  function applyFieldDecorators(decorators, target, key, desc, isStatic) {
    desc = decorators.reduceRight(function (desc, dec) {
      return dec(target, key, desc) || desc;
    }, desc);

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
    var desc = decorators.reduceRight(function (desc, dec) {
      return dec(target, key, desc) || desc;
    }, Object.getOwnPropertyDescriptor(target, key));
    Object.defineProperty(target, key, desc);
  }

  decoratorsCompat = function decoratorsCompat(decorators) {
    return function (descriptor) {
      if (descriptor.kind === "class") {
        descriptor.finisher = function (Class) {
          return decorators.reduceRight(function (Class, dec) {
            return dec(Class) || Class;
          }, Class);
        };
      } else if (descriptor.kind === "method" && descriptor.placement === "static") {
        descriptor.finisher = function (Class) {
          applyMethodDecorators(decorators, Class, descriptor.key);
        };
      } else if (descriptor.kind === "method" && descriptor.placement === "prototype") {
        descriptor.finisher = function (Class) {
          applyMethodDecorators(decorators, Class.prototype, descriptor.key);
        };
      } else if (descriptor.kind === "field" && descriptor.placement === "static") {
        descriptor.finisher = function (Class) {
          var key = descriptor.key;
          var desc = Object.getOwnPropertyDescriptor(Class, key);
          applyFieldDecorators(decorators, Class, key, {
            enumerable: true,
            writable: true,
            configurable: true,
            value: desc && desc.value,
            initializer: void 0
          }, true);
        };
      } else if (descriptor.kind === "field" && descriptor.placement === "own") {
        var decorator;
        var key = descriptor.key,
            initializer = descriptor.initializer;
        descriptor.initializer = undefined;
        var desc = applyFieldDecorators(decorators, {}, key, {
          enumerable: true,
          writable: true,
          configurable: true,
          initializer: initializer
        });
        descriptor.descriptor = desc;

        descriptor.initializer = function () {
          return desc.initializer ? desc.initializer.call(this) : desc.value;
        };
      } else {
        throw new Error("Unsupported decorated element.");
      }
    };
  };

  return decoratorsCompat(decorators);
}
