function sum() {
    var result = 0;

    for(var i=0; i<arguments.length; i++) {
        result += arguments[i];
    }
    return result;
}

console.log(sum(1,2,3));        // (출력값) 6
console.log(sum(1,2,3,4,5,6,7,8,9));    // (출력값) 45