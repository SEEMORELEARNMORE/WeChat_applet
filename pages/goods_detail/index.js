// pages/goods_detail/index.js
// 引入用来发送请求的方法
import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsObj:{},
        // 商品是否被收藏过
        isCollect:false
    },
    // 商品对象
    GoodsInfo:{},
    /**
     * 生命周期函数--监听页面加载
     */
    onShow() {
        let pages=getCurrentPages();
        let currentPage=pages[pages.length-1];
        let options=currentPage.options
        const {goods_id}=options
        this.getGoodsDetail(goods_id)

          
    },

    // 获取商品详情数据
    async getGoodsDetail(goods_id){
        const goodsObj=await request({url:"/goods/detail",data:{goods_id}})
        this.GoodsInfo=goodsObj;
                // 获取缓存中的商品收藏数组
                let collect=wx.getStorageSync("collect")||[];
                // 判断当前商品是否被收藏
                let isCollect=collect.some(v=>v.goods_id===this.GoodsInfo.goods_id);
        this.setData({
            goodsObj:{
                goods_name:goodsObj.goods_name,
                goods_price:goodsObj.goods_price,
                // iphone部分手机 不识别 webp图片格式
                goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
                pics:goodsObj.pics ,
            },
            isCollect
        })
    },

    // 点击轮播图 放大预览
    handlePreviewImage(e){
        // 1、先构造要预览的图片数组
        const urls=this.GoodsInfo.pics.map(v=>v.pics_mid)
        // 2、接收传递过来的图片url
        const {url:current}=e.currentTarget.dataset;
        wx.previewImage({
            urls,
            current // 当前显示图片的链接，不填则默认为 urls 的第一张
         })
    },

    // 点击加入购物车
    handleCartAdd(){
        // 1、获取缓存中的购物车数组
        let cart =wx.getStorageSync('cart')||[];
        // 2、判断商品对象是否存在于购物车数组中
        let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
        if(index===-1){
            // 不存在 第一次添加
            this.GoodsInfo.num=1;
            this.GoodsInfo.checked=true;
            cart.push(this.GoodsInfo);
        }else{
            // 已经存在购物车数据，执行num++
            cart[index].num++;
        }
        wx.setStorageSync('cart', cart);
        // 弹窗提示
        wx.showToast({
            title: '加入成功',
            // true 防止用户手抖，疯狂点击按钮，点击一次5秒之后才能点击
            mask:true
        })
    },
    // 点击商品收藏图标
    handleCollect(){
        let isCollect=false;
        // 获取缓存中的商品收藏数组
        let collect=wx.getStorageSync("collect")||[];
        // 判断该商品是否被收藏过
        let index=collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id)
        // 当index!=-1表示 已经收藏过
        if(index!==-1){
            collect.splice(index,1);
            isCollect=false;
            wx.showToast({
                title: '取消成功',
                icon: 'success',
                mask: true,
            });
              
        }else{
            collect.push(this.GoodsInfo);
            isCollect=true;
            wx.showToast({
                title: '收藏成功',
                icon: 'success',
                mask: true,
            });
        }
        // 把数组存入缓存中
        wx.setStorageSync("collect", collect);
        // 修改data中的数据
        this.setData({
            isCollect
        })
        
    }
})