import { BehaviorSubject } from "rxjs";
import onChange from "on-change";

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