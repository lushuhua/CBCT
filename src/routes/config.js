import React from 'react'
export default {
    menus: [ // 菜单相关路由
        { key: '/admin', title: '后台', icon: 'appstore', component:'Admin' },
        { key: '/kp', title: 'kp', icon: 'appstore', component:'Kelper' },
        { key: '/test', title: 'test', icon: 'appstore', component:'Test' },
        /*{
            key: '/admin/attr', title: '属性管理', icon: 'scan',
            subs: [
                { key: '/admin/attributeSetManage',icon:"appstore", title: '属性集', component:'AttributeSet'},
                { key: '/admin/attributeManage', icon:"appstore", title: '属性', component:'Attribute'},
            ],
        },
        {
            key: '/cat', title: '产品中心', icon: 'rocket',
            subs: [
                { key: '/admin/productCategoryManage',icon:"appstore", title: '产品分类', component: 'ProductCategory'},
                { key: '/admin/productManage',icon:"appstore", title: '产品管理', component: 'Product'},
            ],
        },
      {
        key: '/salesManage', title: '销售管理', icon: 'rocket',
        subs: [
          { key: '/admin/orderList',icon:"appstore", title: '订单列表', component: 'OrderList'},
        ],
      },*/
    ],
    //这里存放其他路由 不放在侧边栏中
    others: [
        /*{ key: '/admin/attribute/add', title: '新增属性', icon: 'mobile', component:'NewAttribute' },
        { key: '/admin/attribute/detail/:id', title: '编辑属性', icon: 'mobile', component:'EditAttribute' },
        { key: '/admin/productCat/add', title: '新增分类', icon: 'mobile', component:'NewProductCategory' },
        { key: '/admin/productCat/detail/:id', title: '编辑分类', icon: 'mobile', component:'EditProductCategory' },
        { key: '/admin/product/add', title: '新增产品', icon: 'mobile', component:'NewProduct' },
        { key: '/admin/product/detail/:id', title: '编辑产品', icon: 'mobile', component:'EditProduct' },
        { key: '/admin/orderDetail/:id', title: '订单详情', icon: 'mobile', component:'OrderDetail' },*/

    ] // 非菜单相关路由
}