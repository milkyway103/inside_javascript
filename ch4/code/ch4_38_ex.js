var myObject =  {
    name: 'foo',
    sayName: function () {
        console.log('My name is ' + this.name);
    }
};

console.dir(myObject);
myObject.sayName(); // My name is foo
console.log(myObject.hasOwnProperty('name'));       // true
console.log(myObject.hasOwnProperty('nickName'));   // false
myObject.sayNickName(); // Uncaught TypeError: Object #<Object> has no method 'sayNickName'