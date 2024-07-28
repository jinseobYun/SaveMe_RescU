import React from "react";
import BasicLayout from "../layouts/BasicLayout";
import DatePicker from "react-datepicker";
import { useState } from "react";

import "./MainPage.css";
import "react-datepicker/dist/react-datepicker.css";


const MainPage = () => {
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-01-01');

  return (
    <BasicLayout>
      <div className="mainpage">
        <div className="left">
          <div className="filter">
            <div className="condition">
              <div>
                <label>시작일자</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                />
              </div>
              <div>
                <label>종료일자</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                />
              </div>
              <div>
                <label>담당자</label>
                <input></input>
              </div>
              <button
                className="query-btn"
                onClick={() => console.log("눌렀당!!")}
              >
                조회하기
              </button>
            </div>
          </div>
          <div>
            <div className="list">
              <div className="num">긴급구조번호</div>
              <div className="time">신고접수시간</div>
              <div className="charge">담당자</div>
            </div>
            <div>listItems</div>
          </div>
        </div>
        <div className="divide"></div>
        <div className="right">
          <form>
            <div className="left-column">
              <label>관할부서</label>
              <input type="text" defaultValue="대전 중구청 소방" />

              <label>신고위치 - 지번</label>
              <input type="text" defaultValue="대명동 593 씨씨빌리지" />

              <label>신고위치 - 도로명</label>
              <input type="text" defaultValue="한밭대로 1234 씨씨빌리지" />

              <label>환자유형</label>
              <select>
                <option>다리 골절 환자</option>
              </select>

              <label>메모사항</label>
              <textarea defaultValue="다리 골절 환자"></textarea>

              <label>신고자명</label>
              <input type="text" defaultValue="김샘피" />

              <label>신고자번호</label>
              <input type="text" defaultValue="010-1234-5678" />

              <label>신고시간</label>
              <input type="text" placeholder="yyyy.mm.dd hh:mm:ss" />

              <label>출동지령시간</label>
              <input type="text" placeholder="yyyy.mm.dd hh:mm:ss" />
            </div>
            <div className="right-column">
              <label>응급실</label>
              <input type="text" defaultValue="배정 응급실정보" />

              <label>환자명</label>
              <input type="text" defaultValue="김싸피" />

              <label>성별</label>
              <input type="text" defaultValue="남" />

              <label>생년월일</label>
              <input type="text" defaultValue="2000.01.01" />

              <label>혈액형</label>
              <input type="text" defaultValue="A, Rh+" />

              <label>지병정보</label>
              <textarea defaultValue="1. 당뇨\n2. 천식"></textarea>

              <label>투약정보</label>
              <textarea defaultValue="1. 아세타아미노펜 20mg\n2. 아세타아미노펜 40mg"></textarea>

              <label>기타특이사항</label>
              <textarea defaultValue="1. 특이사항1"></textarea>
            </div>
          </form>
        </div>
      </div>
    </BasicLayout>
  );
};

export default MainPage;
