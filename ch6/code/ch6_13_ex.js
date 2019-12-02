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
            child.prototype._init.apply(this.arguments);
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