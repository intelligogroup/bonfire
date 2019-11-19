
import onChange from 'on-change';
import { BehaviorSubject } from 'rxjs';
import * as uuid from 'uuid';


const changeDetectionKey = uuid();


export function ReRenderOnChange() {
    return function (target: any) {
        return new Proxy(target, {
            construct(clz, args) {
                let isFound = false;
                args.forEach((element: any) => {
                    if (element.__proto__.hasOwnProperty('detectChanges')) {
                        isFound = true;
                        target.prototype[changeDetectionKey] = element;
                    }
                });

                if (!isFound) {
                    throw new Error(`Change detection ref is not set on this component constructor: == ${target.name} ==`);
                }
                return Reflect.construct(clz, args);
            }
        });
    }
}



export function SetChecker<J = any>() {

    return function (target: Object, key: string) {
        const handleChange = (path, value, perValue) => {
            if (value !== perValue) {
                target[`__${key}$$`] = onChange({ value: target[`__${key}$$`].value }, handleChange) as any;
                const cd = target[changeDetectionKey];
                if (cd && cd.markForCheck) {
                    cd.markForCheck();
                }
            }
        };

        const set = (value: J) => {
            target[`__${key}$$`] = onChange({ value }, handleChange);
        };

        const get = () => {
            const vl = target[`__${key}$$`];
            return vl ? vl.value : null;
        };


        Object.defineProperty(target, key, {
            configurable: true,
            enumerable: true,
            get,
            set
        });
    };

}


export function Observable<T = any>() {
    return function (target: Object, key: string) {
        const newKey = `${key}$`;
        target[newKey] = new BehaviorSubject<T>(target[key]);

        const get = () => {
            return target[newKey].value;
        };

        const set = (value: T) => {
            target[newKey].next(value);
        };

        Object.defineProperty(target, key, {
            configurable: true,
            enumerable: true,
            get,
            set
        });
    };
}
