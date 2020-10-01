# React와 SpringBoot 연동하기

❗ 개발환경에서 연동하는 법 중심으로 작성함. 운영환경에서는 따로 지정할 것들 있음(사이트 참고)

## 0. 원리

> 접속한 기기의 IP주소를 확인할 수 있는 웹 페이지를 만든다고 가정하면 프론트엔드는 클라이언트의 IP주소를 알아내는 백엔드의 함수를 호출하고 그 함수에서 반환한 IP주소 값을 받아 화면에 표시한다.

## 1. 기본 설정

🌻 리액트

1. 프로젝트 생성 `npm create react-app hello`
2. 실행 `cd hello` -> `npm start`

🌻 스프링부트

1. 프로젝트 생성 (이름 hello-backend로 생성함)
   `Spring Starter Project` -> Frequently Used에서 `Spring Web` 추가해줄 것

<br/>

## 2. 프론트엔드

1. axios 설치 (백엔드와의 통신) `npm i axios`
2. App.js 수정

```js
import React, { useState, useEffect } from "react";
import "./App.css";
import customAxios from "./customAxios";

function App() {
  // IP주소 변수 선언
  const [ip, setIp] = useState("");

  // IP주소 값을 설정합니다.
  function callback(data) {
    setIp(data);
  }

  // 첫번째 렌더링을 다 마친 후 실행합니다.
  useEffect(() => {
    // 클라이언트의 IP주소를 알아내는 백엔드의 함수를 호출합니다.
    customAxios("/ip", callback);
  }, []);

  return (
    <div className="App">
      <header className="App-header">이 기기의 IP주소는 {ip}입니다.</header>
    </div>
  );
}

export default App;
```

3. customAxios.js 생성

```js
import axios from "axios"; // 액시오스

export default function customAxios(url, callback) {
  axios({
    url: "/api" + url,
    method: "post",

    /**
     * 개발 환경에서의 크로스 도메인 이슈를 해결하기 위한 코드로
     * 운영 환경에 배포할 경우에는 15~16행을 주석 처리합니다.
     *
     * ※크로스 도메인 이슈: 브라우저에서 다른 도메인으로 URL 요청을 하는 경우 나타나는 보안문제
     */
    baseURL: "http://localhost:8080",
    withCredentials: true,
  }).then(function (response) {
    callback(response.data);
  });
}
```

<br/>
## 3. 백엔드

> 백엔드는 클라이언트가 IP주소를 알아내는 함수를 호출하면 그 함수를 실행하고 IP주소 값을 반환하는 역할

1. TestController.java 생성
   (위치: src/main/java/com/gpwltl/hello)

```java
package com.gpwltl.hello;

import javax.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TestController {

	@PostMapping("/ip")
	public ResponseEntity<String> ip (HttpServletRequest request) {
		// 요청을 보낸 클라이언트의 IP주소를 반환합니다.
		return ResponseEntity.ok(request.getRemoteAddr());
	}
}
```

2. WebConfig.java 생성

```java
package com.gpwltl.hello;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
	/**
	 * 개발 환경에서의 크로스 도메인 이슈를 해결하기 위한 코드로
	 * 운영 환경에 배포할 경우에는 15~18행을 주석 처리합니다.
	 *
	 * ※크로스 도메인 이슈: 브라우저에서 다른 도메인으로 URL 요청을 하는 경우 나타나는 보안문제
	 */
	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/api/**").allowCredentials(true);
	}
}
```

<br/>
## 4. 개발하기

🌷 백엔드 연동하면서 프론트엔드 개발

1. 프로젝트(boot) 우클릭 -> `Run As` -> `Maven Clean` -> `Maven install`
2. target에 .jar 파일이 생성됨
3. cmd(terminal)창에서 springboot 프로젝트의 target의 위치로 이동하여 생성된 jar파일을 열어주면 된다.
   `(hello-backend target 경로)>java -jar ./target/hello-backend-1.0.0.jar`
   <br/>

🌷 프론트엔드 연동하면서 백엔드 개발

1. cmd(terminal)창에서 react 프로젝트(hello)의 위치로가서 start 해준다.
   `(hello 경로)>npm start`

<br/>
## 5. 라우터 적용
🌹 프론트엔드(리액트)
1. 라우터 설치 `npm i react-router-dom`
2. App.js 수정

```js
import React, { useState, useEffect } from "react";
import "./App.css";
import customAxios from "./customAxios";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">홈</Link>
            </li>
            <li>
              <Link to="/about">소개</Link>
            </li>
            <li>
              <Link to="/users">사용자</Link>
            </li>
          </ul>
        </nav>

        {/* <Switch>는 하위 <Route>들을 살펴보고 현재 URL과 일치하는 첫 번째 경로를 렌더링합니다. */}
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  // IP주소 변수 선언
  const [ip, setIp] = useState("");

  // IP주소 값을 설정합니다.
  function callback(data) {
    setIp(data);
  }

  // 첫번째 렌더링을 다 마친 후 실행합니다.
  useEffect(() => {
    // 클라이언트의 IP주소를 알아내는 백엔드의 함수를 호출합니다.
    customAxios("/ip", callback);
  }, []);

  return <header className="App-header">이 기기의 IP주소는 {ip}입니다.</header>;
}

function About() {
  return (
    <div>
      <hr />
      <h2>소개 페이지</h2>
    </div>
  );
}

function Users() {
  return (
    <div>
      <hr />
      <h2>사용자 페이지</h2>
    </div>
  );
}

export default App;
```

<br/><br/>

\* [참고사이트](https://joshua-dev-story.blogspot.com/2020/01/react-spring-2.html)
