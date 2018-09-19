let args;

class Foo {
  @function(..._args) { args = _args }
  static field = 2;
}

expect(args).toEqual([
  Foo,
  "field",
  {
    enumerable: true,
    writable: true,
    configurable: true,
    value: 2,
    initializer: void 0
  }
]);
