let args;

class Foo {
  @function(..._args) { args = _args }
  method() {}
}

expect(args).toEqual([
  Foo.prototype,
  "method",
  {
    enumerable: false,
    writable: true,
    configurable: true,
    value: new Foo().method,
  }
]);
