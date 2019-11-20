var factorialVar = function factorial(n) {
    if(n <= 1) {
        return 1;
    }
    return n * factorial(n-1);
};

console.log(factorialVar(3));   // (출력값) 6
console.log(factorial(3));  // (출력값) Uncaught ReferenceError: factorial is not defined