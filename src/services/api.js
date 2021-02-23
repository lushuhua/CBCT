import axios from '../utils/axiosSetting';

export const accountLogin = (params) => axios.post(`${window.reqPrefix}/user/login`,params);
export const logout = () => axios.post(`${window.reqPrefix}/user/logout`);
export const fakeRegister = params => axios.post(`${window.reqPrefix}/user/signup`,params);
export const getFakeCaptcha = mobile => axios.get(`${window.reqPrefix}/captcha?mobile=${mobile}`);
export const getPatientList = () => axios.get(`${window.reqPrefix}/patient/list`);
export const getRawFile = (params) => axios.post(`${window.reqPrefix}/patient/rawFile`,params);
export const saveShifts = (id,params) => axios.post(`${window.reqPrefix}/patient/update/${id}` , params);
/*export const query = axios.get(`${window.reqPrefix}/users`);
export const queryCurrent = axios.get(`${window.reqPrefix}/currentUser`);*/
