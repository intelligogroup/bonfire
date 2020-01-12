import { target } from 'on-change'


export function toJS(source) {
    return target(source);
}