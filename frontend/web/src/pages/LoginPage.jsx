import React from 'react';
import "./LoginPage.css"
import BasicLayout from '../layouts/BasicLayout';

export default function LoginPage() {
  return (
    <BasicLayout>
      <div className="logincontainer">
        <div className='login-info'>
          <div className='info-text'>로그인 페이지</div>
        </div>
        <div className='login-input'>
          <div className='id'>
            <div className='input-tag'>아이디 입력</div>
            <input className='input'></input>
          </div>
          <div className='password'>
            <div className='input-tag'>비밀번호 입력</div>
            <input className='input'></input>
          </div>
        </div>
        <button onClick={()=> console.log("로그인")} className='login-button'>
          <div className='login-text'>로그인</div>
        </button>
      </div>
    </BasicLayout>
    
  );
}
