import helper from '@/utils/helper'

export const authCheck = {
    isAuthenticated: helper.getCookie('token') || false,
    authenticate(cb) {
        this.isAuthenticated = true;
        setTimeout(cb, 100); // fake async
    },
    signout(cb) {
        helper.delCookie('token');
        this.isAuthenticated = false;
        setTimeout(cb, 100);
    }
};