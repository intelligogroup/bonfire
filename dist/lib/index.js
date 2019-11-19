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
                    throw new Error("Change detection ref is not set on this component constructor: == " + target.name + " ==");
                }
                return Reflect.construct(clz, args);
            }
        });
    };
}
export function SetChecker() {
    return function (target, key) {
        var handleChange = function (path, value, perValue) {
            if (value !== perValue) {
                target["__" + key + "$$"] = onChange({ value: target["__" + key + "$$"].value }, handleChange);
                var cd = target[changeDetectionKey];
                if (cd && cd.markForCheck) {
                    cd.markForCheck();
                }
            }
        };
        var set = function (value) {
            target["__" + key + "$$"] = onChange({ value: value }, handleChange);
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
export function Observable() {
    return function (target, key) {
        var newKey = key + "$";
        target[newKey] = new BehaviorSubject(target[key]);
        var get = function () {
            return target[newKey].value;
        };
        var set = function (value) {
            target[newKey].next(value);
        };
        Object.defineProperty(target, key, {
            configurable: true,
            enumerable: true,
            get: get,
            set: set
        });
    };
}
//# sourceMappingURL=index.js.map