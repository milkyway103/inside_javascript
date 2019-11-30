function create_object(o) { // o를 부모로 하는 object 생성
    function F() {}
    F.prototype = o;
    return new F();
}