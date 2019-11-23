import onChange from 'on-change';
import { changeDetectionKey } from './change-detection-key';

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