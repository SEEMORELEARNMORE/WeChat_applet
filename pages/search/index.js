// pages/search/index.js
// 引入用来发送请求的方法
// 防抖一般再输入框中，防止重复输入重复发请求
// 节流一般用作页面上拉下拉
import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goods:[],
        // 取消按钮是否显示
        isFocus:false,
        // 输入框的值
        inpValue:''
    },
    // 设置全局定时器 防抖
    TimeId:-1,
    // 输入框值改变触发
    handleInput(e){
       const {value}=e.detail;
    //    合法性验证 
     if(!value.trim()){
        this.setData({
            isFocus:false,
            goods:[]
        })
        clearTimeout(this.TimeId);
        return;
     }
    //  发送请求获取数据
    this.setData({
        isFocus:true
    })
    clearTimeout(this.TimeId);
    this.TimeId=setTimeout(()=>{
            this.qsearch(value);
    },1000)

    },
    // 发送请求获取数据
    async qsearch(query){
        const res= await request({url:"/goods/search",data:{query}})
        this.setData({
            goods:res.goods
        })
        console.log(this.data.goods);
    },
    // 点击取消按钮
    handleCancel(){
        this.setData({
            inpValue:'',
            isFocus:false,
            goods:[]
        })
    }

})