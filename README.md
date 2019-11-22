![alt text](https://i.imgur.com/fRpDEDh.png)             

# Bonfire

Writen by [Tzach bonfil](https://tzachbonfilportfolio.web.app/). [github](https://github.com/tzachbon)

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

Bonfire is a set of utilities decorators in Angular designed in order to make code more intuitive and efficient when it comes to tracking changes in the data. It helps implementing the OnPush strategy in an efficient and easy way in order to maintain high performance in those cases.

You can make your code cleaner and simpler with adding just 2 decorators to your code.
We know that angular change detection is not simple if you want it to be officiant. So I made Bonfire.
Simple solution to hard problem.

_Now there is no use to call the change detection!_

[Meduim post with examples and gifs](https://medium.com/@tzachbonfil/bonfire-its-easy-to-make-your-app-better-84350b6e24e7)

## Installation

Bonfire requires [Node.js](https://nodejs.org/) v4+ to run.

```sh
$ npm i @intelligo.ai/bonfire
```


## The Tools
See Examples Below:

| Tools | What it does?  | How to use?  |
| :-----: | :-: | :-: |
| (1) ReRenderOnChange | The decorator on the component is actually what causes the other decorators to use change detection | Put it on the top of the component and make sure the component have change detection injected |
| (2) SetChecker | Put it on a property we want to trigger re-render ***only*** if it changed | Just put it on the property |
| (3) WithObservable | Generate a behavior subject (Observable), Which emit values that stored in the original property (You don't need to maintain it at all! Just use it) | Put in on the original property and next to it write the same property name with '$', it will store automatically |


## Where to use

_Before you use it, make sure you inject the change detection to your component!_

```typescript
import { ReRenderOnChange, SetChecker, WithObservable } from '@intelligo.ai/bonfire';

@ReRenderOnChange() // <== (1)
@Component({
  selector: 'my-component',
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // <== IMPORTANT
})

export class MyComponent {

  @SetChecker() group: ISomeInterface = {
   test: [
     {
       name: 'Hello',
       age: 30
     }
    ]
  }; // <== (2)

  @WithObservable() showLoader = false; showLoader$: BehaviorSubject<boolean>; // <== (3)

  constructor(
    private cd: ChangeDetectorRef // <== MOST IMPORTANT
  ) {

    setTimeout(() => {
      // This won't trigger change detection unless you are using SetChecker :-)
      this.groups.test[0].name = 'World'
    },5000)

  }
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
