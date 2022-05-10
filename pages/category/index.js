// pages/category/index.js
// 引入用来发送请求的方法
import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 左侧的菜单数据
        leftMenuList:[],
        // 右侧的商品数据
        rightContent:[],
        // 被点击的左侧菜单
        currentIndex:0,
        // 右侧内容的滚动条距离顶部的距离
        scrollTop:0
    },
    // 接口返回的数据
    Cates:[],
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 缓存技术
        // 1、判断本地存储中有没有旧数据
        // {time:Date.now(),data:[...]}
        // 2、没有旧数据 直接发送新请求
        // 3、有旧数据 且旧数据没有过期，则使用本地存储的旧数据

        // 1、获取本地存储中的数据（小程序中存在本地存储技术）
        const Cates=wx.getStorageSync('cates');
        // 2、判断
        if(!Cates){
            // 不存在 发送请求获取数据
           this.getCates(); 
        }else{
            // 有旧数据 判断是否过期
            if(Date.now()-Cates.time>1000*10){
                // 重新发送请求
                this.getCates();
            }else{
                // 可以使用旧数据
                this.Cates=Cates.data;
                let leftMenuList=this.Cates.map(v=>v.cat_name);
                let rightContent=this.Cates[0].children;
                this.setData({
                   leftMenuList,
                   rightContent    
                  })

            }
        }
        
    },
    // 获取分类数据
    async getCates(){
        // request({url:"/categories"})
        // .then(res=>{
        //     this.Cates=res.data.message;
            
        //     // 把接口的数据存入到本地存储中
        //     wx.setStorageSync('cates',{time:Date.now(),data:this.Cates})

        //     // 构造左侧的大菜单数据
        //     // map() 方法创建一个新数组，这个新数组由原数组中的每个元素都调用一次提供的函数后的返回值组成。
        //     let leftMenuList=this.Cates.map(v=>v.cat_name);
        //     let rightContent=this.Cates[0].children;
        //     this.setData({
        //     leftMenuList,
        //     rightContent    
        //         })
            
        // })

        const res = await request({url:"/categories"});
            this.Cates=res
            
            // 把接口的数据存入到本地存储中
            wx.setStorageSync('cates',{time:Date.now(),data:this.Cates})

            // 构造左侧的大菜单数据
            // map() 方法创建一个新数组，这个新数组由原数组中的每个元素都调用一次提供的函数后的返回值组成。
            let leftMenuList=this.Cates.map(v=>v.cat_name);
            let rightContent=this.Cates[0].children;
            this.setData({
            leftMenuList,
            rightContent    
                })

    },
    // 左侧菜单的点击事件
    handleItemTap(e){
        // 获取点击位置的索引
        const {index} = e.currentTarget.dataset;
        // 改变右侧商品数据
        let rightContent=this.Cates[index].children;
        this.setData({
            currentIndex:index,
            rightContent,
            // 重新设置右侧内容的scroll-view标签距离顶部的距离
            scrollTop:0
        })
        

    }
    
})