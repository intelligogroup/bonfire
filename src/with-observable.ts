import onChange from 'on-change';
import { BehaviorSubject } from 'rxjs';

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
