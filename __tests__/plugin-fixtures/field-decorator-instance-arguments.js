let args;

class Foo {
  @function(..._args) { args = _args }
  field = 2;
}

expect(args).toEqual([
  expect.any(Object),
  "field",
  {
    enumerable: true,
    writable: true,
    configurable: true,
    initializer: expect.any(Function),
  }
]);
