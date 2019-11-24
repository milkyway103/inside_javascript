// Person() 생성자 함수
function Person(name) {
    this.name = name;
}

Person.prototype.country = 'Korea';

var foo = new Person('foo');
var bar = new Person('bar');

console.log(foo.country);   // Korea
console.log(bar.country);   // Korea

foo.country = 'USA';

console.log(foo.country);   // USA
console.log(bar.country);   // Korea