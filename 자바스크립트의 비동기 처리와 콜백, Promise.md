# 자바스크립트의 비동기 처리와 콜백, Promise
## 서론
emoji-minesweeper의 코드 분석을 하던 중, serviceworker를 이해하기 위해 배경지식의 일환으로써 자바스크립트의 비동기 처리 방식, 콜백 함수, 프로미스 전반에 대해 공부하고 정리하였다.

각 페이지들에서 작성된 코드들은 실제로 작동하지 않은 가상의 도메인을 두고 get 요청을 보내거나, 관례적으로 settimeout 등의 코드만을 실행하는 경우가 많았기 때문에, 최대한 실제 존재하는 도메인으로 실제 동작하는 예제 코드를 새로 작성하였다.

# 비동기 처리
Promise를 본격적으로 이해하기 이전, 우선 자바스크립트의 비동기 처리에 대해 이해할 필요가 있다.

비동기 처리는 요청에 대한 응답을 기다리지 않고 다음 코드를 실행하는 처리 방식이다.
비동기 처리의 가장 흔한 사례는 ajax 방식이다.

ajax는 언어나 프레임워크가 아니라, 구현하는 방식이다. (Asynchronous Javascript And XML) 즉, 데이터를 이동하고 화면을 구성하는 데 있어 웹 화면을 갱신하지 않고 필요한 데이터를 서버로 보내고 가져오는 방식이다. jQuery, Vue, React 등의 라이브러리가 ajax 방식을 실제로 구현하고 있다.

## 비동기 처리의 구현과 문제
```javascript
function getData() {
    var data;
    $.get("https://opendb.gitools.net/demo.json", function(response) {
        data = response;
        console.log(data); // 정상적으로 데이터를 받아오긴 함!
    });
    return data;
}

console.log(getData()); // undefined
```

`$.get()`이 ajax 통신을 하는 부분이다. `https://opendb.gitools.net/demo.json`에 HTTP GET 요청을 날려 어떤 response를 받아오는 코드이다. (실제로 로그로 출력해보면 다음과 같은 응답이 전송된 것을 볼 수 있다)

![](%E1%84%8C%E1%85%A1%E1%84%87%E1%85%A1%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%B8%E1%84%90%E1%85%B3%E1%84%8B%E1%85%B4%20%E1%84%87%E1%85%B5%E1%84%83%E1%85%A9%E1%86%BC%E1%84%80%E1%85%B5%20%E1%84%8E%E1%85%A5%E1%84%85%E1%85%B5%E1%84%8B%E1%85%AA%20%E1%84%8F%E1%85%A9%E1%86%AF%E1%84%87%E1%85%A2%E1%86%A8,%20Promise/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202019-12-14%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%206.04.46.png)

이 `getData()`를 호출했을 때 우리는 위의 로그에 찍힌 것과 같은 data가 로그로 찍히기를 바라지만, 실제로 크롬 콘솔에서 작동시켜보면 결과는 `undefined`이다.

그 이유는 `$.get()`로 데이터를 요청하고 받아올 때까지 기다려주지 않고 다음 코드인 `return data;`를 실행했기 때문이다. 따라서, `getData()`의 결과 값은 초기 값을 설정하지 않은 `data`의 값 `undefined`를 출력한다.

현대적인 웹 사이트는 한 화면 안에 이미지나 동영상과 같은 다양한 하이퍼미디어들을 가지고 있는데, 일반적으로 이러한 하이퍼미디어는 웹 서버에 요청된다. 그리고 심지어, 웹 서버는 하나가 아닌 다양한 클라이언트로부터 들이닥치는 요청을 한꺼번에 처리해야 한다. 즉, 요청으로부터 응답까지 시간이 걸린다. 이들을 모두 받아올 때까지 기다린 후에 사용자에게 웹 사이트를 보여주고자 한다면, 사용자는 아마 기다림에 지쳐 close 버튼을 누를 것이다. 이것이 비동기 처리가 필요한 이유이다.

하지만 비동기 처리를 사용하고자 할 때, 위에서 봤던 것과 같이 예상한 결과값이나 예상한 코드 진행 순서와 다르게 실제 결과값이 산출되는 문제점이 있다. 우리가 getData() 함수를 통해 사용자의 화면에 실제 data를 보여주고자 한다면 어떻게 해야 할까?

# 콜백 함수로 비동기 처리 방식의 문제점 해결하기
callback 함수 방식이란, 옵저버(observer) 디자인패턴을 이용한 것이다. 콜백 함수는 객체의 상태변화 (이벤트) 가 발생했을 때 함수를 통해 이러한 변경사항을 리턴한다.

앞의 ajax 통신 코드를 콜백 함수로 개선하면 다음과 같다.

```javascript
function getData(callbackfunc) {
    var data;
    $.get("https://opendb.gitools.net/demo.json", function(response) { // 2. response가 오면
        // 3. 실행된다.
        callbackfunc(response);
    });
}

// 1. getData의 인자로 넘겨준 함수가 callbackfunc로 넘어가서
getData(function(data) {
    console.log(data);
});
```

자바스크립트에서 함수는 1급 객체이기 때문에 함수의 인자로 넘겨줄 수 있으므로, 실제로 실행하고자 하는 함수(여기서는 `callbackfunc`)를 비동기 함수를 내포하고 있는 함수의 인자로 넘겨준 뒤, 해당 비동기 함수가 실행되고 응답을 받아 오면 콜백 함수가 실행되도록 한다. 
주석으로 달아둔 순서를 따라서 읽으면 코드를 이해하는 데에 도움이 된다.

이렇게 콜백 함수를 사용하면 특정 로직이 끝났을 때 원하는 동작을 실행시킬 수 있다.

## 콜백 지옥 (Callback hell)

콜백 지옥은 비동기 처리 로직을 위해 콜백 함수를 연속해서 사용할 때 발생하는 문제이다.

```javascript
function getData(callbackfunc) {
    var data;
    $.get("https://opendb.gitools.net/demo.json", function(response) {
        callbackfunc(response, function(results) {
            callbackfunc2(result, function() {
                // 아마도 더 많은 콜백 함수!
            })
        });
    });
}
```

서버에서 데이터를 받아와 인코딩, 사용자 인증 등을 처리해야 하는 경우가 이에 해당한다. 만약 이 모든 과정을 콜백 함수로만 표현해야 한다면 위와 같이 콜백 안에서 콜백을 계속 부르는 형식으로 코딩을 해야 한다. 이러한 코드 구조는 **중첩으로 인한 복잡도가 증가**함으로 인해 가독성도 떨어지고 유지보수도 힘들 뿐더러, **에러, 예외처리도 쉽지 않다**.

### 예외 처리 실패
```javascript
try {
    setTimeout(() => { throw 'Error!'; }, 1000);
} catch (e) {
    console.log('에러를 캐치하지 못한다..');
    console.log(e);
}
```

setTimeout() 구문이 실행을 완료하는 시점은 이미 try-catch문이 실행되고 난 후이기 때문에, throw된 에러는 캐치되지 못한다.

## 콜백 지옥의 해결
일반적으로 콜백 지옥을 해결하는 방법으로는 Promise나 Async를 사용하는 방법이 있다. 콜백 함수를 분리해줌으로써 콜백 지옥을 해결할 수도 있지만, Promise나 Async를 이용하면 더 편하게 구현할 수 있다.

```javascript
function callbackfuncDone(ressponse) {
	callbackfunc2(results, callbackfunc2Done);
}
function callbackfunc2Done(results) {
	console.log(results);
}
$.get("https://opendb.gitools.net/demo.json", function(response) {
	callbackfunc(response, callbackfuncDone);
});
```

# 프로미스
## 비동기 처리와 프로미스
프로미스를 이야기하기 전, 비동기 작업을 요청하는 쪽과 처리하는 쪽으로 나누어 생각하는 것이 프로미스를 이해하는 데에 주요한 단서가 된다. 

클라이언트(주로 요청하는 쪽)가 서버에게 어떤 데이터를 요청할 때, 서버는 어떤 이유에서든지 그 요청을 처리하지 못할 수도 있다. 서버가 갑자기 다운될 수도 있고, 잘못된 방식으로 데이터를 요청했을 수도 있다. 즉, 비동기 작업은 프로미스의 관점에서 이행되거나 (성공하거나) 거부될 수 있다.(실패힐 수 있다) 이는 앞에서 콜백 중첩이 예외 처리를 하는 데에 어려움을 가지는 약점을 가지고 있다는 점과 연결지어 생각해볼 수 있다.

다중 중첩된 콜백 함수를 만들었다고 했을 때, 중간에 에러가 발생한다면 이 에러를 우리는 어떻게 처리하여 사용자에게 보다 나은 사용자 경험을 제공해줄 수 있을까? 적절히 에러를 처리하지 못한다면 최악의 경우에는 사용자에게 웹 페이지가 아예 보여지지 않을 수도 있다.

## 프로미스?
`Promise`는 비동기 연산이 종료된 이후의 결과값이나 실패 이유를 처리하기 위한 핸들러를 연결해주는 객체이다. 프로미스를 사용하면 비동기 메서드에서 마치 동기 메서드처럼 값을 핸들링할 수 있다. 다만 최종 결과를 반환하지는 않고, 프로미스를 반환한다. 비동기 처리의 성공과 실패에 따라 다른 상태의 프로미스가 반환된다.

## 프로미스의 상태
`Promise`는 다음 중 하나의 상태를 가진다.
- 대기(pending) : 이행하거나 거부되지 않은 초기 상태
- 이행(fulfilled) 연산이 성공적으로 완료됨
- 거부(rejected) 연산이 실패

이행이나 거부될 때, 프로미스에 연결한 처리기는 그 프로미스의 `then` 메서드에 의해 대기열에 등록된다. 이미 이행했거나 거부된 프로미스에 연결한 처리기도 호출하므로, 비동기 메서드에서 마치 동기 메서드처럼 값을 핸들링할 수 있다는 것이다.

![](%E1%84%8C%E1%85%A1%E1%84%87%E1%85%A1%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%B8%E1%84%90%E1%85%B3%E1%84%8B%E1%85%B4%20%E1%84%87%E1%85%B5%E1%84%83%E1%85%A9%E1%86%BC%E1%84%80%E1%85%B5%20%E1%84%8E%E1%85%A5%E1%84%85%E1%85%B5%E1%84%8B%E1%85%AA%20%E1%84%8F%E1%85%A9%E1%86%AF%E1%84%87%E1%85%A2%E1%86%A8,%20Promise/promises.png)
(출처 : MDN)

참고로 프로미스는 대기 중이지 않으면서 이행 또는 거부됐을 때 처리(settled)됐다고 말할 수 있고, 프로미스와 함께 쓰이는 단어 resolved는 프로미스가 다른 프로미스의 상태에 맞추어 처리됨, 또는 상태가 “잠김”되었다는 의미이다.


## 프로미스의 생성
`Promise` 객체는 일반적으로 `new` 키워드와 생성자를 사용하여 만든다. 생성자는 매개변수로 **실행 함수**를 받는다. 이 함수는 매개 변수로 두 가지 함수를 가져야 하는데, `resolve`와 `reject`가 그것이다.

```javascript
const myFirstPromise = new Promise((resolve, reject) => {
  // 비동기 처리 로직
  //   resolve(someValue); // fulfilled
  // or
  //   reject("실패 이유"); // rejected
});
```

앞에서 비동기 작업은 이행되거나 거부될 수 있다. 프로미스 내부의 비동기 작업이 성공적으로 처리될 경우 `resolve`가 호출되고, 그렇지 않을 경우 `reject`가 호출된다. 이들 두 함수는 약속과도 같은 것으로써, 프로미스에서 성공과 실패를 구분하는 방법이다.

두 메서드 모두 프로미스를 반환하는데, 여기에서 주의할 점은 `reject`는 `throw`와 달리 호출된 시점에서 나머지 로직의 실행을 멈추지 않는다는 점이다. 그러므로 어떤 조건을 두고 오류를 던진 뒤 그 이후 로직은 실행시키고 싶지 않다면 `throw`가 더 나은 선택이 될 수도 있다. (자세한 설명은 [JavaScript Promises - reject vs. throw - Stack Overflow](https://stackoverflow.com/questions/33445415/javascript-promises-reject-vs-throw) 참조)

fulfilled 상태의 프로미스가 반환되면 `then()` 메서드로 연결되고, rejected 상태의 프로미스가 반환되면 `catch()` 메서드로 연결된다.

```javascript
function getData() {
    return new Promise(function (resolve, reject) {
        $.get("https://opendb.gitools.net/demo.json", function(response) {
            if (response) {
                resolve(response);
            }
            reject(new Error("Request is failed"));
        });
    });
}

// Fulfilled 또는 Rejected의 결과값 출력
getData().then(function (data) {
    console.log(data);  // response 값 출력
}).catch(function (err) {
    console.error(err); // Error 출력
});
```

## 프로미스 체이닝 (Promise Chaining)

`then()` 메서드를 호출하고 나면 새로운 프로미스 객체가 반환되므로, 여러 개의 프로미스를 연결하는 것 (Promise Chaining) 역시 가능하다.

```javascript
function getData() {
  return new Promise({
    // ...
  });
}

// then() 으로 여러 개의 프로미스를 연결한 형식
getData()
  .then(function (data) {
    // ...
  })
  .then(function () {
    // ...
  })
  .then(function () {
    // ...
  });
```

## all()
`all()` 메서드를 통해 여러 개의 프로미스가 모두 완료되면 핸들러를 실행시키는 것 역시 가능하다.

```javascript
const param = true;
const promise1 = new Promise(function(resolve,reject){
    if(param){
        resolve("프로미스 1 실행");
    }
    else{
        reject(new Error("promise1 is rejected."));
    }
});
const promise2 = new Promise(function(resolve,reject){
    if(param){
        resolve("프로미스 2 실행");
    }
    else{
        reject(new Error("promise1 is rejected."));
    }
});
Promise.all([promise1,promise2]).then(function(values){
    console.log("promise 1,2 모두완료",values);
});
```

## 프로미스를 사용하는 두 가지 패턴
프로미스를 생성하는 데에는 다음과 같은 두 가지 방법이 존재한다.
1. `new Promise(function(resolve, reject)` 방식으로 새로운 프로미스 객체 생성
2. `Promise.resolve(function())` 객체 생성

두 방식은 비슷한 실행 결과를 도출해주지만, 2번 방식의 경우 파라미터로 넘겨주는 함수 내에 또다른 비동기 로직이 존재한다면 예상한 대로 작동하지 않을 수 있다. (자세한 설명은 [Promise 를 사용하는 두 가지 방법, new Promise, Promise.resolve()](https://han41858.tistory.com/11) 참조)


## 프로미스의 에러 처리 패턴
프로미스의 에러 처리 패턴으로는 다음과 같은 두 가지가 있다.
1. then()의 두 번째 인자로 에러 처리
```javascript
getData().then(
	handleSuccess,
	handleError
);
```
3. catch() 이용
```javascript
getData().then().catch();
```

위 두 가지 방법 모두 rejected 프로미스가 반환된 경우에 실행된다.
가급적 `catch()`로 에러를 처리하는 것이 더 효율적이다.
handleSuccess() 함수에서 에러를 던질 경우, 이 에러를 처리할 함수가 없게 되기 때문이다. 반면 `catch()`로 에러를 처리하게 되면 이 점을 방지할 수 있다.

### 참고
[자바스크립트 비동기 처리와 콜백 함수 • Captain Pangyo](https://joshua1988.github.io/web-development/javascript/javascript-asynchronous-operation/)
[자바스크립트 Promise 쉽게 이해하기 • Captain Pangyo](https://joshua1988.github.io/web-development/javascript/promise-for-beginners/)
[Promise - JavaScript | MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise)
[봐도 봐도 헷갈리는 resolve, reject](https://velog.io/@rejoelve/%EB%B4%90%EB%8F%84-%EB%B4%90%EB%8F%84-%ED%97%B7%EA%B0%88%EB%A6%AC%EB%8A%94-resolve-reject)
[번역 async/await 를 사용하기 전에 promise를 이해하기 - Kiwan Jung - Medium](https://medium.com/@kiwanjung/%EB%B2%88%EC%97%AD-async-await-%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0-%EC%A0%84%EC%97%90-promise%EB%A5%BC-%EC%9D%B4%ED%95%B4%ED%95%98%EA%B8%B0-955dbac2c4a4)
[ES6 프로미스(Promise), 진짜 쉽게 이해하기 (Promise의 목적만 생각한다.)](https://jeong-pro.tistory.com/128)
[JavaScript, jQuery, 그리고 Ajax](http://www.nextree.co.kr/p9521/)
[Promise 를 사용하는 두 가지 방법, new Promise, Promise.resolve()](https://han41858.tistory.com/11)


#공부/웹