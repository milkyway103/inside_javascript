var add = function sum(x, y) {
    return x + y;
};

console.log(add(3,4));  // (출력값) 7
console.log(sum(3, 4));
        // (출력값) Uncaught ReferenceError: sum is not defined 에러 발생