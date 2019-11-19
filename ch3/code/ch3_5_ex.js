// Object()를 이용해서 foo 빈 객체 생성
var foo = new Object();

// foo 객체 프로퍼티 생성
foo.name = 'foo';
foo.age = 30;
foo.gender = 'male';

console.log(typeof foo); // (출력값) object
console.log(foo);        // (출력값) { name: 'foo', age:30, gender:'male' }