var arr = ['bar'];
var obj = { name : 'foo', length : 1};

arr.push('bax');
console.log(arr);   // (출력값) ['bar', 'baz`]

Array.prototype.push.apply(obj, ['baz']);
console.log(obj);   // (출력값) { '1': 'baz', name: 'foo', length: 2 }