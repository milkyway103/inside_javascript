// parent() 함수 정의
function parent() {
    var a = 100;
    var b = 200;

    // child() 내부 함수 정의
    function child() {
        var b = 300;

        console.log(a); // 100
        console.log(b); // 300
    }

    child();
}

parent();
child();    // Uncaught ReferenceError: child is not defined