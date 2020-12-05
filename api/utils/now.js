const ymd = (separator = "") => {
    const x = new Date();
    const y = x.getFullYear().toString();
    const m = (x.getMonth() + 1).toString();
    const d = x.getDate().toString();
    const h = x.getHours().toString();
    const mn = x.getMinutes().toString();
    const s = x.getSeconds().toString();
    (d.length == 1) && (d = '0' + d);
    (m.length == 1) && (m = '0' + m);
    return y + separator + m + separator + d;
}

const ymdhmns = (separator = "") => {
    const x = new Date();
    const y = x.getFullYear().toString();
    const m = (x.getMonth() + 1).toString();
    const d = x.getDate().toString();
    const h = x.getHours().toString();
    const mn = x.getMinutes().toString();
    const s = x.getSeconds().toString();
    (d.length == 1) && (d = '0' + d);
    (m.length == 1) && (m = '0' + m);
    (h.length == 1) && (h = '0' + h);
    (mn.length == 1) && (mn = '0' + mn);
    (s.length == 1) && (s = '0' + s);
    return y + separator + m + separator + d + "-" + h + separator + mn + separator + s;
}

module.exports = { ymdhmns, ymd };