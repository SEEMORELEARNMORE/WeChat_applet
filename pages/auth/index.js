// pages/auth/index.js
// 引入用来发送请求的方法
import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
    code:'',
    async handleGetUserInfo(e){
const {encryptedData,iv,rawData,signature}=e.detail;
// 获取小程序登录成功后的code
wx.login({
    timeout:10000,
    success: (result) => {
        const{code}=result;
        this.code=code;
          }
});
// const loginParams={encryptedData,iv,rawData,signature,this.code};
// // 发送请求 获取用户的token
// const res=await request({url:"/my/orders/req_unifiedorder",data:loginParams,method:"POST"})
// 把token存入缓存中，同时跳转回上一个页面
const token='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo';
wx.setStorageSync("token", token);
wx.navigateBack({
    delta: 1
});
  
  
    }
})