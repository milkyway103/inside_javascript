Function.prototype.memoization = function(key) {
    var arg = Array.prototype.slice.call(arguments, 1);
    // arguments로 넘어온 것들을 array로 변환하여 arg에 저장
    this.data = this.data || {}; // this.data가 있다면 this.data or 없다면 {}
    return this.data[key] !== undefined ?
        this.data[key] : this.data[key] = this.apply(this, arg);
};

function myCalculate1(input) {
    return input * input;
}

function myCalculate2(input) {
    return input * input / 4;
}

myCalculate1.memoization(1, 5);
myCalculate1.memoization(2, 4);
myCalculate2.memoization(1, 6);
myCalculate2.memoization(2, 7);

console.log(myCalculate1.memoization(1));   // (출력값) equal to console.log(myCacluate1.data[1]);
console.log(myCalculate1.memoization(2));   // (출력값) equal to console.log(myCacluate2.data[2]);
console.log(myCalculate2.memoization(1));   // (출력값) equal to console.log(myCacluate1.data[1]);
console.log(myCalculate2.memoization(2));   // (출력값) equal to console.log(myCacluate2.data[2]);
