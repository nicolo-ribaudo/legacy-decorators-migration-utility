class A {}

@() => A
class B {}

expect(B).toBe(A);
