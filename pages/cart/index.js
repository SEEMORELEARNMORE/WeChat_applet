// pages/cart/index.js
Page({
    data:{
        address:{},
        cart:[],
        allChecked:false,
        totalPrice:0,
        totalNum:0
    },
    onShow(){
        // 1、获取缓存中的收货地址信息
        const address=wx.getStorageSync('address');
        // 获取缓存中的购物车数据
        const cart =wx.getStorageSync("cart")||[];
        // 计算全选
        this.setCart(cart);
        this.setData({
            address
        })
    },
// 点击收货地址
handleChooseAddress(){
    // 获取收获地址
   wx.chooseAddress({
       success: (result) => {
           const address=result
           address.all=address.provinceName+address.cityName+address.countyName+address.detailInfo;
         wx.setStorageSync('address', address) 
       }
   });
     
},
// 商品选中
handleItemChange(e){
// 获取被修改的商品的id
const goods_id=e.currentTarget.dataset.id;
// 获取购物车数组
let {cart}=this.data;
// 找到被修改的商品对象
let index=cart.findIndex(v=>v.goods_id===goods_id);
// 选中状态取反
cart[index].checked=!cart[index].checked;
// 计算全选
this.setCart(cart); 
},
// 设置购物车状态同时，重新计算底部工具栏的数据
setCart(cart){
  // 计算全选
  let totalPrice=0;
  let totalNum=0;
  let allChecked=true;
     cart.forEach(v=>{
      if(v.checked){
          totalPrice+=v.num*v.goods_price;
          totalNum+=v.num;
      }else{
          allChecked=false;
      }
  }) 
  // 如果cart数组为空，则allChecked为true 需要设置为false
  allChecked=cart.length!=0?allChecked:false;
  this.setData({
    cart,
    allChecked,
    totalPrice,
    totalNum
})
wx.setStorageSync("cart", cart);
},
// 商品的全选功能
handleItemAllCheck(){
    //1、获取data中的数据
    let{cart,allChecked}=this.data;
    // 2、修改值
    allChecked=!allChecked;
    // 3、循环修改cart数组中的商品选中状态
    cart.forEach(v=>v.checked=allChecked);
    // 将修改后的值填充回data和缓存中
    this.setCart(cart);
},
// 商品数量的编辑功能
handleItemNumEdit(e){
    const {operation,id}=e.currentTarget.dataset;
    let {cart}=this.data;
    const index=cart.findIndex(v=>v.goods_id===id);
    // 判断是否要执行删除
    if(cart[index].num===1&&operation===-1){
        // 弹窗提示
        wx.showModal({
            title: '提示',
            content: '您是否要删除',
            success: (result) => {
                if (result.confirm) {
                    cart.splice(index,1);
                    this.setCart(cart);
                }else if(result.cancel){
                    console.log('用户点击取消');
                }
            },
           
        });
          
    }else{
      cart[index].num+=operation;
      this.setCart(cart);  
    }
    
},
// 跳转支付页面
handlePay(){
// 判断收货地址
const {address,totalNum}=this.data;
if(!address.userName){
    wx.showToast({
        title: '您还没有选择收货地址',
        icon: 'none',
        mask: false,
        success: (result) => {
            
        }
    });
    return;
      
}
// 判断用户有没有选购商品
if(totalNum===0){
    wx.showToast({
        title: '您还没有选购商品',
        icon: 'none',
        mask: false,
        success: (result) => {
            
        }
    });
    return;
}
wx.navigateTo({
    url: '/pages/pay/index'
});
  
}
})