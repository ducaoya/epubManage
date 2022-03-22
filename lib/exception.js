const __stat = new Map();
class Exception {
    constructor(stat, msg) {
        this.stat = stat;
        this.msg = msg;
    }

    static updates(stats) {
        for (let key in stats) {
            __stat.set(key, stats[key]);
        }
    }

    static get(stat) {
        return __stat.get(stat);
    }

    static set(key, stat) {
        __stat.set(key, stat);
    }
}

Exception.set("Internel_Server_Error", "服务端异常");

module.exports = Exception;