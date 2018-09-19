let args;

@function (..._args) {
  args = _args;
}
class A {}

expect(args).toEqual([A]);
