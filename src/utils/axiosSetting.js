import axios from 'axios'
import store from '../store'
import history from '@/utils/history'
import Toast from '@/components/toast'
import helper from "./helper";

axios.defaults.withCredentials = true
axios.defaults.timeout = 10000

window.ajaxNum = 0

const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
}
const { dispatch } = store
// request拦截器
axios.interceptors.request.use(
    config => {
        window.ajaxNum ++;
        if(config.url.indexOf('rawFile')==-1){
            window.ToastLoding = Toast.loading()
        }

        dispatch({type:'FETCH_DATA'})
        return config
    },
    error => {
        // Do something with request error
        console.log(error) // for debug
        Promise.reject(error)
    }
)
// respone拦截器
axios.interceptors.response.use(
    response => {
        window.ajaxNum--;
        if(window.ajaxNum < 1) {
            setTimeout(window.ToastLoding)
        }
        dispatch({type:'FETCH_DATA_FULFILLED'})
        /**
         * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
         * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
         */
        const res = response.data;
        if (response.status === 401 || res.status === 40101) {
            helper.delCookie('token')
            sessionStorage.clear();
            // history.push('/login');
             return Promise.reject('error')
        }
        if (response.status !== 200 && res.status !== 200) {
            //message.error(response.data.message,2000)
        } else {
            return response.data
        }
    },
    error => {
        window.ajaxNum--;
        setTimeout(window.ToastLoding)

        if (error === undefined || error.code === 'ECONNABORTED') {
            message.warning('服务请求超时')
            return Promise.reject(error)
        }
        const { response: { status, statusText, data: { msg = '服务器发生错误' } }} = error
        const { response } = error
        const { dispatch } = store
        dispatch({type:'FETCH_DATA_REJECTED',payload:error.message})
        const text = codeMessage[status] || statusText || msg

        const info = response.data;
        if (status === 401 || info.status === 40101) {
            helper.delCookie('token')
            sessionStorage.clear();
            return location.reload()
        }
        if(text){
            //message.error(`${status}:${text}`)
        }
        return Promise.reject(error)
    }
)
export default axios