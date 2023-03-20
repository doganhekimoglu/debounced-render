[![Minified size][npm-size]][npm-url]&nbsp;&nbsp;
[![Version][npm-version]][npm-url]&nbsp;&nbsp;
[![Typescript][npm-typescript]][npm-url]&nbsp;&nbsp;
[![License][github-license]][github-license-url]&nbsp;&nbsp;

**Easy to use wrapper react component to debounce the render of its children**

**Can be used in situtations like instant flickering of a loader if the loading process finishes very quickly**

Examples:

```jsx
import { DebouncedRender } from "debounced-render";

function MyComponent({ loading }) {
  return (
    // If the loading flag switches back to false before 200ms the <Loader /> component won't be rendered at all
    <DebouncedRender delay={200} renderCondition={loading}>
      <Loader />
    </DebouncedRender>
  );
}
```

```jsx
import { DebouncedRender } from "debounced-render";

function MyComponent({ loading }) {
  return (
    // <Loader /> component will be rendered for at least 500ms after it is mounted.
    // Even if the loading flag switches to false immediately after child component is mounted
    <DebouncedRender 
        renderCondition={loading} 
        minDuration={500}>
      <Loader />
    </DebouncedRender>
  );
}
```

**For smoother experience delay and minDuration should be used together**

```jsx
import { DebouncedRender } from "debounced-render";

function MyComponent({ loading }) {
  return (
    <DebouncedRender 
        renderCondition={loading} 
        // delay and minDuration can be used at the same time
        delay={500}
        minDuration={200}>
      <Loader />
    </DebouncedRender>
  );
}
```

# Props


|       Prop Name        |                                                Description                                                |
|:----------------------:|:---------------------------------------------------------------------------------------------------------:|
|    renderCondition     |                         The flag that decides if the children should be rendered                          |
|    delay (Optional)    | Debouncing delay before mounting the children after the renderCondition flag is set to true(milliseconds) |
| minDuration (Optional) |                    Minimum amount of time the children will stay mounted(milliseconds)                    |
|  onRender (Optional)   |                   A callback function that will be called when the children is mounted                    |
|   onHide (Optional)    |                  A callback function that will be called when the children is unmounted                   |


[npm-url]: https://www.npmjs.com/package/debounced-render
[npm-version]: https://img.shields.io/npm/v/debounced-render
[github-license]: https://img.shields.io/npm/l/debounced-render
[github-license-url]: https://github.com/doganhekimoglu/debounced-render/blob/master/LICENSE
[npm-typescript]: https://img.shields.io/npm/types/debounced-render
[npm-size]: https://img.shields.io/bundlephobia/min/debounced-render
