import { BehaviorSubject } from "rxjs";
import onChange from "on-change";

export function DetectChange<T = any>(observableKey?: string) {
    return (target: any, key: string) => {
        const pKey = `______${key}$`;
        const proxyKey = `proxy__key__${key}`;
        const bonfireKey = `__bonfireKey__`;

        const init = function (isGet: boolean) {
            return function (newVal?) {
                const runChangeDetection = () => {
                    let isFound = false;

                    Object.values(this).forEach((instance: any) => {
                        if (typeof instance === 'object' && instance.detectChanges) {
                            instance.detectChanges()
                            isFound = true;
                        }
                    })


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
                }

                const handleChange = (path, value, perValue) => {
                    if (value !== perValue) {
                        this[pKey].next(this[proxyKey].value);
                        runChangeDetection()
                    }
                };

                Object.defineProperty(this, key, {
                    get: () => {
                        return this[proxyKey] && this[proxyKey].value;
                    },
                    set: (val: T) => {
                        let value = val;


                        if (!this[pKey]) {
                            this[pKey] = new BehaviorSubject<T>(val);
                        }

                        if (typeof this[bonfireKey] !== 'boolean') {
                            this[bonfireKey] = true;
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