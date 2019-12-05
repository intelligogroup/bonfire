
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


export function WithObservable<T = any>(observableKey?: string) {
    return (target: any, key: string) => {
        const pKey = observableKey || `${key}$`;
        const proxyKey = `proxy__key__${key}`;

        const init = function (isGet: boolean) {
            return function (newVal?) {
                const handleChange = (path, value, perValue) => {
                    if (value !== perValue) {
                        this[pKey].next(this[proxyKey].value);
                    }
                };

                Object.defineProperty(this, key, {
                    get: () => {
                        return this[proxyKey]?.value;
                    },
                    set: (val: T) => {
                        let value = val;


                        if (!this[pKey]) {
                            this[pKey] = new BehaviorSubject<T>(val);
                        }


                        if (this[proxyKey]) {
                            this[proxyKey].value = val;
                        } else {
                            value = val;
                            this[proxyKey] = onChange({ value }, handleChange);
                        }

                    },
                    enumerable: true,
                    configurable: true
                });

                if (isGet) {
                    return this[key]; // get
                } else {
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