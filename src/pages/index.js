//按需加载组件
import asyncComponent from "@/utils/asyncComponent";

const Admin = asyncComponent(()=>import('./admin/index'));
const Kelper = asyncComponent(()=>import('./kelper/index'));
const Test = asyncComponent(()=>import('./test'));
/*属性管理*/
/*const AttributeSet = asyncComponent(()=>import('./attributeSet/index'));
const Attribute = asyncComponent(()=>import('./attribute/index'));
const NewAttribute = asyncComponent(()=>import('./attribute/add'));
const EditAttribute = asyncComponent(()=>import('./attribute/edit'));

/!*产品中心*!/
const ProductCategory = asyncComponent(()=>import('./productCategory/index'));
const NewProductCategory = asyncComponent(()=>import('./productCategory/detail'));
const EditProductCategory = asyncComponent(()=>import('./productCategory/detail'));

const Product = asyncComponent(()=>import('./product/index'));
const NewProduct = asyncComponent(()=>import('./product/detail'));
const EditProduct = asyncComponent(()=>import('./product/detail'));

/!*订单管理*!/
const OrderList = asyncComponent(()=>import('./orderList/index'));
const OrderDetail = asyncComponent(()=>import('./orderList/orderDetail'));*/

export default {
    Admin,Kelper,Test/*AttributeSet,Attribute,NewAttribute,EditAttribute,ProductCategory,NewProductCategory,EditProductCategory, Product,
    NewProduct,EditProduct,OrderList,OrderDetail*/
}