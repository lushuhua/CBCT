const helper = {
        getDateStr: function (AddDayCount) {
            var dd = new Date();
            dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
            var y = dd.getYear();
            var m = (dd.getMonth() + 1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0
            var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
            return (1900 + y) + '-' + m + '-' + d;
        },
        setCookie: function (name, value, time=60) {
            var strsec = this.getsec(time);
            var exp = new Date();
            exp.setTime(exp.getTime() + strsec * 1);
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
        },
        getsec: function (str) {
            var str1 = str.substring(1, str.length) * 1;
            var str2 = str.substring(0, 1);
            if (str2 == "s") {
                return str1 * 1000;
            } else if (str2 == "h") {
                return str1 * 60 * 60 * 1000;
            } else if (str2 == "d") {
                return str1 * 24 * 60 * 60 * 1000;
            }
        },
        getCookie: function (name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg)) return (arr[2]);
            else return null;
        },
        delCookie: function (name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval=this.getCookie(name);
            if(cval!=null)
                document.cookie= name + "="+cval+";expires="+exp.toGMTString();
        },
        //5.四舍五入保留2位小数（不够位数，则用0替补）
        decimal2(num) {
            var result = parseFloat(num);
            if (isNaN(result)) {
                return "";
            }
            result = Math.round(num * 100) / 100;
            var s_x = result.toString(); //将数字转换为字符串

            var pos_decimal = s_x.indexOf('.'); //小数点的索引值

            // 当整数时，pos_decimal=-1 自动补0
            if (pos_decimal < 0) {
                pos_decimal = s_x.length;
                s_x += '.';
            }

            // 当数字的长度< 小数点索引+2时，补0
            while (s_x.length <= pos_decimal + 2) {
                s_x += '0';
            }
            return s_x ;
        },
      formatMili(num){
        num = this.decimal2(num);
        let DIGIT_PATTERN = /(^|\s)\d+(?=\.?\d*($|\s))/g
        let MILI_PATTERN = /(?=(?!\b)(\d{2})+\.?\b)/g
        return  num.toString()
            .replace(DIGIT_PATTERN, (m) => m.replace(MILI_PATTERN, ','))
    },
    // 将数字转换为千分位格式，如果是非有效数字，则直接返回
     formatThousand(num){
            num = decimal2(num);
            let DIGIT_PATTERN = /(^|\s)\d+(?=\.?\d*($|\s))/g
            let MILI_PATTERN = /(?=(?!\b)(\d{3})+\.?\b)/g
            return  num.toString()
                .replace(DIGIT_PATTERN, (m) => m.replace(MILI_PATTERN, ','))
     },
    rfspace(val) {
        return val.replace(/\s/g,"");
    }
};
export default helper;