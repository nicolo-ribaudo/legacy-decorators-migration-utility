@function (Class) {
  Class.foo = 2;
}
class A {}

expect(A.foo).toBe(2);
