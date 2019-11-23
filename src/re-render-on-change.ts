import { changeDetectionKey } from './change-detection-key';

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
