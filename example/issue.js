/**
 * 替换三目表达式(bad)
 */
function isAndroid() {
    const userAgent = navigator.userAgent;
    // return userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1;
    return /(Android|Adr)/i.test(userAgent);
}