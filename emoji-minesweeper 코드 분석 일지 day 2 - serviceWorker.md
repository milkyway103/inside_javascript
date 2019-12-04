# emoji-minesweeper 코드 분석 일지 day 2 - serviceWorker
처음부터 마주친 난관, serviceWorker
```javascript
if (navigator.serviceWorker) navigator.serviceWorker.register('/emoji-minesweeper/sw.js')
```
navigator가 뭐지? 하고 log로 찍어 보았다.
navigator는 현재 사용 중인 브라우저에 관한 정보를 저장하는 객체

위의 코드가 의미하는 바를 한 줄로 얘기하자면 다음과 같음.
서비스 워커 API가 사용 가능한지 확인하고, 사용 가능한 경우 페이지가 로드되면 `emoji-minesweeper/sw.js`에 있는 서비스 워커를 로드

**서비스워커는 브라우저 측에서 동작하는 이벤트 기반의 시스템 Worker**
 
초기부터 웹은 다양한 서버에 저장되어 있는 문서를 연결하기 위해 요청(request) 및 응답(response)의 매커니즘을 기반으로 동작하도록 설계되었다. 다시 말해 서버와 클라이언트가 **네트워크**를 통해 리소스를 송수신하도록 처리하고 있으며, 이 때문에 웹 페이지 자체의 성능 외에도 근본적으로 오프라인을 기반으로 하는 실행 환경은 아니다.

서비스워커는 1차적으로는 이러한 오프라인의 문제를 해결하기 위한 시작점이다. 물론 서비스워커가 해결하고자 하는 문제의 범위는 이보다 더 넓다. 오프라인은 시작일 뿐이지만 비유하자면 네이티브 어플리케이션의 동작 흐름을 웹으로 가져오기 위한 가장 중요한 기능이라고 할 수 있다.

### 서비스워커?
브라우저에 의해 백그라운드에서 실행되는 스크립트 기반의 워커(worker)
웹페이지와는 별개로 작동한다.
웹페이지 또는 사용자 상호작용이 필요하지 않은 기능에 대해 자유로운 접근을 제공한다.

현재로서는 응답 캐시 관리, 네트워크 요청을 가로채고 처리하는 핵심 기능이 있다.

서비스워커는 오프라인 환경을 완벽히 통제할 수 있는 권한을 개발자에게 부여하여 오프라인 환경을 지원할 수 있도록 해 준다.
서비스 워커 이전에는 비슷한 역할을 하는 AppCache 라는 API가 존재하였으나 다양한 문제가 있으며 서비스 워커는 이를 방지하도록 설계되었다.

### 서비스워커를 사용할 때 유의할 점
- 자바스크립트 worker이므로 DOM에 직접 액세스할 수 없다.
- 대신 postMessage 인터페이스를 통해 전달된 메시지에 응답하는 방식으로 제어 대상 페이지와 통신할 수 있고, 해당 페이지는 필요한 경우 DOM을 조작할 수 있다.
- 프로그래밍 가능한 **네트워크 프록시**
- 표준이 아니다.
- https가 적용되어 있어야 한다. (누군가가 서비스워커를 통해 저장된 캐시들을 엿보는 것으로부터 보호)
- promise의 사용법을 알아야 한다.
- 모든 브라우저가 서비스 워커를 지원하지는 않는다. ([여기](https://jakearchibald.github.io/isserviceworkerready/)서 지원 여부를 확인할 수 있다.)

### 서비스 워커 수명 주기
서비스 워커의 수명 주기는 웹페이지와 완전히 별개이다.

서비스 워커를 사이트에 설치하려면 페이지에서 자바스크립트를 이용하여 등록해야 한다. 서비스 워커를 등록하면 브라우저가 백그라운드에서 서비스 워커 설치 단계를 시작한다.

일반적으로 설치 단계 동안 static 자산을 캐시하고자 한다. 모든 파일이 성공적으로 캐시되면 서비스 워커가 설치된다. 파일 다운로드 및 캐시에 실패하면 설치 단계가 실패하고 서비스 워커가 활성화되지 않는다. 이런 상황이 발생하면 다음에 다시 시도한다! 한편으로 이는 설치가 이루어지면 static 자산이 캐시된다는 뜻이다.

활성화 단계 후에 서비스 워커는 해당 범위 안의 모든 페이지를 제어하지만, 서비스 워커를 처음으로 등록한 페이지는 다시 로드해야 제어할 수 있다. 서비스 워커에 제어 권한이 부여된 경우 서비스 워커는 메모리를 절약하기 위해 종료되거나, 페이지에서 네트워크 요청이나 메시지가 생성될 때 fetch 및 message 이벤트를 처리한다.

### 서비스 워커 등록
`se.js`라는 파일을 서비스 워커를 적용시키고자 하는 폴더 아래에 생성한다.

```javascript
// navigator (브라우저) 에 serviceWorker 기능이 있는지 확인
if ('serviceWorker' in navigator) {
	// 서비스워커 설치 시 DOM 블로킹 (렌더링 차단)을 막아준다.
  window.addEventListener('load', function() {
		// 서비스워커를 register하면 promise를 반환한다.
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
```

크롬 사용자라면 개발자 도구 Application > ServiceWorkers 탭에서 설치된 것을 확인할 수 있다.

단, register() 메서드는 사용할 때 서비스 워커 파일의 위치를 주의해야 한다.
위의 예에서는 서비스 워커 파일이 도메인의 루트에 있다. 즉, 서비스 워커의 범위는 전체 원천(origin)이다. 다시 말하면, 서비스 워커는 이 도메인의 모든 항목에 대한 `fetch` 이벤트를 수신한다.
`/example/sw.js`에 있는 서비스 워커 파일을 등록하면 서비스 워커는 `/example/`로 시작하는 URL 페이지 (예: `/example/page1/`, `/example/page2/`)에 대해서만 `fetch` 이벤트를 처리한다.

### 서비스워커 - Basic
서비스워커에서는 `self` 키워드로 자기 자신을 접근할 수 있다. (그래서 `se.js` 파일에 `self.addEventListener…`와 같은 식으로 이벤트 리스너를 등록한다.




#### 참고
[코딩의 시작, TCP School](http://tcpschool.com/javascript/js_bom_navigator)
[Navigator 객체 - 웹브라우저 Javascript](https://opentutorials.org/course/1363/6650)
[서비스워커 소개: 서비스워커는 어떻게 사용하는가?](http://html5rocksko.blogspot.com/2015/01/introduction-to-service-worker-how-to-use-serviceworker.html)
[PWA - 서비스 워커 웹 캐싱 (Web Caching) | Gracefullight Blog](https://gracefullight.dev/2017/12/22/PWA-ServiceWorker-Web-Caching/)
[Using Service Workers - Web API | MDN](https://developer.mozilla.org/ko/docs/Web/API/Service_Worker_API/Using_Service_Workers)

#코드분석/emoji-minesweeper