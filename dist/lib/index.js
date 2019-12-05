import onChange from 'on-change';
import { BehaviorSubject } from 'rxjs';
import * as uuid from 'uuid';
var changeDetectionKey = uuid();
export function ReRenderOnChange() {
    return function (target) {
        return new Proxy(target, {
            construct: function (clz, args) {
                var isFound = false;
                args.forEach(function (element) {
                    if (element.__proto__.hasOwnProperty('detectChanges')) {
                        isFound = true;
                        target.prototype[changeDetectionKey] = element;
                    }
                });
                if (!isFound) {
                    throw new Error("\n                    Change detection ref is not set on this component constructor: == " + target.name + " ==\n                    Example: \n                    ...\n\n                    constructor(\n                        private cd: ChangeDetectorRef\n                    ) { }\n                    ...\n\n          ");
                }
                return Reflect.construct(clz, args);
            }
        });
    };
}
export function SetChecker() {
    return function (target, key) {
        var changeDetection = function () {
            var cd = target[changeDetectionKey];
            if (cd && cd.markForCheck) {
                cd.markForCheck();
            }
        };
        var handleChange = function (path, value, perValue) {
            if (value !== perValue) {
                target["__" + key + "$$"] = onChange({ value: target["__" + key + "$$"].value }, handleChange);
                changeDetection();
            }
        };
        var set = function (value) {
            target["__" + key + "$$"] = onChange({ value: value }, handleChange);
            changeDetection();
        };
        var get = function () {
            var vl = target["__" + key + "$$"];
            return vl ? vl.value : null;
        };
        Object.defineProperty(target, key, {
            configurable: true,
            enumerable: true,
            get: get,
            set: set
        });
    };
}
export function WithObservable(observableKey) {
    return function (target, key) {
        var pKey = observableKey || key + "$";
        var proxyKey = "proxy__key__" + key;
        var init = function (isGet) {
            return function (newVal) {
                var _this = this;
                var handleChange = function (path, value, perValue) {
                    if (value !== perValue) {
                        _this[pKey].next(_this[proxyKey].value);
                    }
                };
                Object.defineProperty(this, key, {
                    get: function () {
                        var _a;
                        return (_a = _this[proxyKey]) === null || _a === void 0 ? void 0 : _a.value;
                    },
                    set: function (val) {
                        var value = val;
                        if (!_this[pKey]) {
                            _this[pKey] = new BehaviorSubject(val);
                        }
                        if (_this[proxyKey]) {
                            _this[proxyKey].value = val;
                        }
                        else {
                            value = val;
                            _this[proxyKey] = onChange({ value: value }, handleChange);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                if (isGet) {
                    return this[key]; // get
                }
                else {
                    this[key] = newVal; // set
                }
            };
        };
        // Override property to let init occur on first get/set
        return Object.defineProperty(target, key, {
            get: init(true),
            set: init(false),
            enumerable: true,
            configurable: true
        });
    };
}
//# sourceMappingURL=index.js.map