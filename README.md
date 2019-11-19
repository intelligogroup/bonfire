# Bonfire

Writen by [Tzach bonfil](https://tzachbonfilportfolio.web.app/). [github](https://github.com/tzachbon)

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

Bonfire is open source decorators utils for angular.

- Make change detection easy
- Makes Observable for you

You can your code cleaner and simpler with adding just 2 decorators to your code.
We know that angular change detection is not simple if you want it to be officent, so I made Bonfire.
Simple solution to hard problem.

_Now there is no use to call the change detection!_

### Installation

Bonfire requires [Node.js](https://nodejs.org/) v4+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ npm i @intelligo/bonfire
```

### Where to use

_Before you use it, make sure you inject the change detection to your component!_

```typescript
import { ReRenderOnChange, SetChecker, Observable } from '@intelligo/bonfire';

@ReRenderOnChange()
@Component({
  selector: 'my-component',
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // <== IMPORTANT
})
export class SupportComponent {
  @SetChecker() group: ISomeInterface;
  @Observable() showLoader = false;
  showLoader$: BehaviorSubject<boolean>;

  constructor(
    private cd: ChangeDetectorRef // <== MOST IMPORTANT
  ) {}
}
```

### Dependencies

Bonfire uses a number of open source projects to work properly:

- [Angular](https://angular.io/) - Platform for building mobile and desktop web applications.
- [Rxjs](https://rxjs-dev.firebaseapp.com/) - Reactive extensions library for javascript.
- [uuid](https://www.npmjs.com/package/uuid) - Simple, fast generation of RFC4122 UUIDS.

### Todos

- Write MORE Tests

## License

MIT

[//]: # "These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax"
