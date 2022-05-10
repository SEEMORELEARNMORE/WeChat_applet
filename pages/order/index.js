// pages/order/index.js
// 引入用来发送请求的方法
import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orders:[],
        tabs:[
            {
                id:0,
                value:"全部",
                isActive:true
            },
            {
                id:1,
                value:"待付款",
                isActive:false
            },
            {
                id:2,
                value:"待收货",
                isActive:false
            },
            {
                id:3,
                value:"退款/退货",
                isActive:false
            }
        ],
    },
    onShow(){
        // 先判断有没有token，否则拿不到数据
        const token=wx.getStorageSync("token");
        if(!token){
            wx.navigateTo({
                url: '/pages/auth/index'
            });
            return;
        }
        let pages=getCurrentPages();
        let currentPage=pages[pages.length-1];
        // 获取type参数
        const {type}=currentPage.options
        // 激活选中的页面标题
        this.changeTitleByIndex(type-1)
        this.getOrders(type);
    },
    // 获取订单列表的方法
    async getOrders(type){
        const res=await request({url:"/my/orders/all",data:{type}});
        this.setData({
            orders:res.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
        })
    },
    // 根据标题索引来激活选中标题数组
    changeTitleByIndex(index){
        let {tabs}=this.data;
        tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
        this.setData({
            tabs
        })
    },
    // 标题点击事件 从子组件传递过来
    handleTabsItemChange(e){
            // 获取被点击的标题索引
            const {index}=e.detail;
            this.changeTitleByIndex(index);
            // 重新发送请求 type=1 index=0
            this.getOrders(index+1);

    }
})