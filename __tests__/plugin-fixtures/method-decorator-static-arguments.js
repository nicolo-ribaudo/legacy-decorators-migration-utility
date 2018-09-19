let args;

class Foo {
  @function(..._args) { args = _args }
  static method() {}
}

expect(args).toEqual([
  Foo,
  "method",
  {
    enumerable: false,
    writable: true,
    configurable: true,
    value: Foo.method,
  }
]);
