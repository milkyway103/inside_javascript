// 객체 리터럴을 통한 foo 객체 생성
var foo = {
    name: 'foo',
    nickname: 'babo'
};

console.log(foo.nickname);  // (출력값) babo
delete foo.nickname;        // (출력값) nickname 프로퍼티 삭제
console.log(foo.nickname);  // (출력값) undefined

delete foo;                 // (출력값) foo 객체 삭제 시도
console.log(foo.name);      // (출력값) foo