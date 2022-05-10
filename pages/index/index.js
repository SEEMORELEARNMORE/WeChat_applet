// 引入用来发送请求的方法
import {request} from "../../request/index.js"
Page({
  data: {
    swiperList:[],
    catasList:[],
    floorList:[]
  },
  //options(Object)
  onLoad: function(options) {
    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     this.setData({
    //       swiperList:result
    //     })
    //   }
    // });
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },
  // 获取轮播图数据
  getSwiperList(){
  request({url:"/home/swiperdata"})
    .then(result=>{
      this.setData({
        swiperList:result
      })
    })
  },
   // 获取 分类导航数据
   getCateList(){
    request({url:"/home/catitems"})
      .then(result=>{
        this.setData({
          catasList:result
        })
      })
    },
     // 获取 楼层数据
   getFloorList(){
    request({url:"/home/floordata"})
      .then(result=>{
        console.log(result);
        result=result.forEach((v1,i1)=>{
          v1.product_list.map((v2,i2)=>{
            v2.navigator_url=v2.navigator_url.slice(0,17)+'/index?'+v2.navigator_url.slice(18)
          })
        this.setData({
          floorList:result
          })
        })  
        console.log(this.data.floorList);
      }
    )}
});
  