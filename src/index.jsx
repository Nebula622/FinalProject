import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import Page1 from './components/Page1';
import Page2 from './components/Page2';
import Page3 from './components/Page3';
import Page4 from './components/Page4';
import Page5 from './components/Page5';
import Page6 from './components/Page6';
import Page7 from './components/Page7';
import Page8 from './components/Page8';
import SnowWhite_Home from './components/SnowWhite/SnowWhite_Home';
import SnowWhite_1 from './components/SnowWhite/SnowWhite_1';
import SnowWhite_2 from './components/SnowWhite/SnowWhite_2';
import SnowWhite_3 from './components/SnowWhite/SnowWhite_3';
import SnowWhite_4 from './components/SnowWhite/SnowWhite_4';
// import SnowWhite_5 from './components/SnowWhite/SnowWhite_5';
// import SnowWhite_6 from './components/SnowWhite/SnowWhite_6';
// import SnowWhite_7 from './components/SnowWhite/SnowWhite_7';
// import SnowWhite_8 from './components/SnowWhite/SnowWhite_8';
// import SnowWhite_9 from './components/SnowWhite/SnowWhite_9';
// import SnowWhite_10 from './components/SnowWhite/SnowWhite_10';
// import SnowWhite_11 from './components/SnowWhite/SnowWhite_11';
// import SnowWhite_12 from './components/SnowWhite/SnowWhite_12';
// import SnowWhite_13 from './components/SnowWhite/SnowWhite_13';
// import SnowWhite_14 from './components/SnowWhite/SnowWhite_14';
// import SnowWhite_15 from './components/SnowWhite/SnowWhite_15';
// import SnowWhite_16 from './components/SnowWhite/SnowWhite_16';
// import SnowWhite_17 from './components/SnowWhite/SnowWhite_17';


const App = () => {
  return (
    <BrowserRouter>
      <div>
        {/* 메인 페이지에서만 네비게이션을 표시 */}
        <Routes>
          <Route
            path="/"
            element={
              <nav>
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/Page1">이미지 버튼</Link>
                  </li>
                  <li>
                    <Link to="/Page2">문장 완성하기</Link>
                  </li>
                  <li>
                    <Link to="/Page3">빈칸 한개 채우기</Link>
                  </li>
                  <li>
                    <Link to="/Page4">빈칸 여러개 채우기</Link>
                  </li>
                  <li>
                    <Link to="/Page5">백설공주 난쟁이 대화</Link>
                  </li>
                  <li>
                    <Link to="/Page6">백설공주 난쟁이 마녀 대화</Link>
                  </li>
                  <li>
                    <Link to="/Page7">대화를 한줄씩 보여주기(사진없음)</Link>
                  </li>
                  <li>
                    <Link to="/Page8">대화를 한줄씩 보여주기(사진있음)</Link>
                  </li>
                  <li>
                    <Link to="/SnowWhite_Home">백설공주 이야기</Link>
                  </li>
                  {/* 다른 페이지에 필요한 링크 추가 */}
                </ul>
              </nav>
            }
          />

          {/* 페이지마다 뒤로 가기 링크만 표시 */}
          <Route path="/" element={<Home />} />
          <Route path="/Page1" element={<Page1 />} />
          <Route path="/Page2" element={<Page2 />} />
          <Route path="/Page3" element={<Page3 />} />
          <Route path="/Page4" element={<Page4 />} />
          <Route path="/Page5" element={<Page5 />} />
          <Route path="/Page6" element={<Page6 />} />
          <Route path="/Page7" element={<Page7 />} />
          <Route path="/Page8" element={<Page8 />} />
          <Route path="/SnowWhite_Home" element={<SnowWhite_Home />} />
          <Route path="/SnowWhite_1" element={<SnowWhite_1 />} />
          <Route path="/SnowWhite_2" element={<SnowWhite_2 />} />
          <Route path="/SnowWhite_3" element={<SnowWhite_3 />} />
          <Route path="/SnowWhite_4" element={<SnowWhite_4 />} />
          {/*
          <Route path="/SnowWhite_5" element={<SnowWhite_5 />} />
          <Route path="/SnowWhite_6" element={<SnowWhite_6 />} />
          <Route path="/SnowWhite_7" element={<SnowWhite_7 />} />
          <Route path="/SnowWhite_8" element={<SnowWhite_8 />} />
          <Route path="/SnowWhite_9" element={<SnowWhite_9 />} />
          <Route path="/SnowWhite_10" element={<SnowWhite_10 />} />
          <Route path="/SnowWhite_11" element={<SnowWhite_11 />} />
          <Route path="/SnowWhite_12" element={<SnowWhite_12 />} />
          <Route path="/SnowWhite_13" element={<SnowWhite_13 />} />
          <Route path="/SnowWhite_14" element={<SnowWhite_14 />} />
          <Route path="/SnowWhite_15" element={<SnowWhite_15 />} />
          <Route path="/SnowWhite_16" element={<SnowWhite_16 />} />
          <Route path="/SnowWhite_17" element={<SnowWhite_17 />} />*/}
          {/* 다른 페이지에 대한 라우트 추가 */}
        </Routes>
      </div>
    </BrowserRouter>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));