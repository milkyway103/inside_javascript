function A(arg) {
    if (!(this instanceof A))
        return new A(arg);
    this.value = arg ? arg : 0;
}

var a = new A(100);
var b = A(10);

console.log(a.value);       // (출력값) 100
console.log(b.value);       // (출력값) 10
console.log(global.value);  // (출력값) undefined