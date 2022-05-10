// pages/cart/index.js
// 引入用来发送请求的方法
import {request} from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
    data:{
        address:{},
        cart:[],
        totalPrice:0,
        totalNum:0,
    },
    onShow(){
        // 1、获取缓存中的收货地址信息
        const address=wx.getStorageSync('address');
        // 获取缓存中的购物车数据
        let cart =wx.getStorageSync("cart")||[];
        // 过滤后的购物车数组
        cart=cart.filter(v=>v.checked);
        let totalPrice=0;
        let totalNum=0;
           cart.forEach(v=>{
                totalPrice+=v.num*v.goods_price;
                totalNum+=v.num;
        }) 
        this.setData({
          cart,
          totalPrice,
          totalNum,
          address
      })
    },
    // 点击支付
    async handleOrderPay(){
      try {
            // 判断缓存中有没有token
        const token=wx.getStorageSync("token");
        // 判断
        if(!token){
            wx.navigateTo({
                url: '/pages/auth/index',
                success: (result) => {
                    
                }
            });
            return;
        }
        // 创建订单
        // 1、准备请求头参数
        // const header={Authorization:token};
        // 2、准备请求体
        const order_price=this.data.totalPrice;
        const consignee_addr=this.data.address.all;
        let goods=[];
        const cart=this.data.cart;
        cart.forEach(v=>goods.push({
            goods_id:v.goods_id,
            goods_number:v.num,
            goods_price:v.goods_price
        }))
        const orderParams={order_price,consignee_addr,goods}
        // 准备发送请求 创建订单 获取订单编号
        const {order_number}=await request({url:'/my/orders/create',method:"POST",data:orderParams})
        // 发起预支付接口
        const {pay}=await request({url:"/my/orders/req_unifiedorder",method:"POST",data:{order_number}})
        // 发起微信支付
        wx.requestPayment({
            ...pay,
            success: (result) => {
                console.log(result);
            },
            fail:(err)=>{
                console.log(err);
                // 无权限
            }
        });
        // 查询后台订单状态
        const res=await request({url:"/my/orders/chkOrder",method:"POST",data:{order_number}})
        console.log(res);
         await wx.showToast({ title: '支付成功',}) 
        //  手动删除缓存中 已经支付了的商品
        let newCart=wx.getStorageSync("cart");
        newCart=newCart.filter(v=>!v.checked)
        wx.setStorageSync("cart", newCart);
          
        //  支付成功 跳转到订单页面
        wx.navigateTo({
            url: '/pages/order/index'
        });
          
          
      } catch (error) {
          await wx.showToast({title:'支付失败'});
          console.log(error);
      }
    }
})