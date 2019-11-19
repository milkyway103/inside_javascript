var a = 100;
var b = 100;

var objA = { value: 100 };
var objB = { value: 100 };
var objC = objB;

console.log(a == b);        // (출력값) true
console.log(objA == objB);  // (출력값) false
console.log(objB == objC);  // (출력값) true