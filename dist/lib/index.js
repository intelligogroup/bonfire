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
export function WithObservable() {
    return function (target, key) {
        var newKey = key + "$";
        var newKeyProxy = "___" + key + "$$$";
        var handleChange = function (path, value, perValue) {
            if (value !== perValue) {
                target[newKeyProxy] = onChange({ value: target[newKeyProxy].value }, handleChange);
                target[newKey].next(target[newKeyProxy].value);
            }
        };
        target[newKeyProxy] = onChange({ value: target[key] }, handleChange);
        target[newKey] = new BehaviorSubject(target[key]);
        var get = function () {
            return target[newKey].value;
        };
        var set = function (value) {
            target[newKeyProxy] = onChange({ value: value }, handleChange);
            target[newKey].next(target[newKeyProxy].value);
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