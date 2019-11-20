
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
                    throw new Error(`
                    Change detection ref is not set on this component constructor: == ${target.name} ==
                    Example: 
                    ...

                    constructor(
                        private cd: ChangeDetectorRef
                    ) { }
                    ...

          `
                    );
                }
                return Reflect.construct(clz, args);
            }
        });
    }
}



export function SetChecker<J = any>() {

    return function (target: Object, key: string) {
        const changeDetection = () => {
            const cd = target[changeDetectionKey];
            if (cd && cd.markForCheck) {
                cd.markForCheck();
            }
        };

        const handleChange = (path, value, perValue) => {
            if (value !== perValue) {
                target[`__${key}$$`] = onChange({ value: target[`__${key}$$`].value }, handleChange) as any;
                changeDetection();
            }
        };

        const set = (value: J) => {
            target[`__${key}$$`] = onChange({ value }, handleChange);
            changeDetection();
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


export function WithObservable<T = any>() {

    return function (target: Object, key: string) {

        const newKey = `${key}$`;
        const newKeyProxy = `___${key}$$$`;


        const handleChange = (path, value, perValue) => {
            if (value !== perValue) {
                target[newKeyProxy] = onChange({ value: target[newKeyProxy].value }, handleChange);
                target[newKey].next(target[newKeyProxy].value);
            }
        };

        target[newKeyProxy] = onChange({ value: target[key] }, handleChange) as any;
        target[newKey] = new BehaviorSubject<T>(target[key]);

        const get = () => {
            return target[newKey].value;
        };

        const set = (value: T) => {
            target[newKeyProxy] = onChange({ value }, handleChange);
            target[newKey].next(target[newKeyProxy].value);
        };

        Object.defineProperty(target, key, {
            configurable: true,
            enumerable: true,
            get,
            set
        });
    };
}
