function subClass(obj) {
    // Node.js의 경우에는 window 대신 global을 사용한다.
    var parent = this === window ? Function : this;
    var F = function() {};

    var child = function() {
        var _parent = child.parent_constructor;

        // 현재 클래스의 부모 생성자가 있으면 그 함수를 호출한다.
        // 다만 부모가 Function인 경우는 최상위 클래스에 도달했으므로 실행하지 않는다.
        if (_parent && _parent !== Function) {
            // 부모 함수의 재귀적 호출
            _parent.apply(this, arguments);
        }
        if (child.prototype.hasOwnProperty("_init")) {
            child.prototype._init.apply(this, arguments);
        }
    };

    /* 프로토타입 체이닝 */
    F.prototype = parent.prototype;
    child.prototype = new F();
    child.prototype.constructor = child;
    child.parent = parent.prototype;
    child.parent_constructor = parent;
    child.subClass = arguments.callee;

    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            child.prototype[i] = obj[i];
        }
    }

    return child;
}

var person_obj = {
    _init : function() {
        console.log("person init");
    },
    getName : function() {
        return this._name;
    },
    setName : function(name) {
        this._name = name;
    }
};

var student_obj = {
    _init : function() {
        console.log("student init");
    },
    getName : function() {
        return "Student Name: " + this._name;
    }
};

// child는 이런 function이다 하고 선언만 하고 리턴해서 Person에 저장함.
// 여기서 일어나는 일 1. child와 parent를 link (여기서는 this가 window이므로 Function을 parent로 링크)
// 2. person_obj의 모든 프로퍼티들을 child.prototype (new F())의 프로퍼티로 얕은 복사
// 3. 그런 child를 return (만 하고 실행은 하지 않기 때문에 log 출력은 안 되는 것!)
var Person = subClass(person_obj);  // Person 클래스 정의
console.log(Person.toString());
console.log(Person.parent.toString());
// 여기서 person이라는 인스턴스를 만들고, 실제로 Person을 실행시킴!
var person = new Person();  // person init 출력
person.setName("zzoon");
console.log(person.getName());  // (출력값) zzoon

var Student = Person.subClass(student_obj); // Student 클래스 정의
var student = new Student();    // person init, student init 출력
student.setName("iamhjoo");
console.log(student.getName()); // (출력값) Student Name : iamhjoo

console.log(Person.toString()); // Person이 Function을 상속받는지 확인