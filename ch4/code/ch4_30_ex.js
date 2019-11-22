function Person(name, age, gender, position) {
    this.name = name;
    this.age = age;
    this.gender = gender;
}

var qux = Person('qux', 20, 'man');
console.log(qux);   // (출력값) undefined

console.log(window.name);   // (출력값) qux
console.log(window.age);    // (출력값) 20
console.log(window.gender); // (출력값) man