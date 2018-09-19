class Foo {
  @function (target, key, descriptor) {
    descriptor.value = () => 3;
  }
  method() {
    return 2;
  }
}

expect(new Foo().method()).toBe(3);
