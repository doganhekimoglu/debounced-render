[![NPM version][npm-image]][npm-url]

![npm-typescript]

[![License][github-license]][github-license-url]

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
    // <Loader /> component will be rendered for at least 500ms after(if mounted at all) it is mounted.
    // Even if the loading flag switches to false immediately after child component is mounted
    <DebouncedRender delay={100} renderCondition={loading} minDuration={500}>
      <Loader />
    </DebouncedRender>
  );
}
```

# Props


| Prop Name | Description  |
| :---------: | :--------: |
| renderCondition  | The flag that decides if the children should be rendered |
| delay  | Debouncing delay before mounting the children after the renderCondition flag is set to true(milliseconds) |
| minDuration  | Minimum amount of time the children will stay mounted  |
| onRender  | A callback function that will be called when the children mounted |


[npm-url]: https://www.npmjs.com/package/debounced-render
[npm-image]: https://img.shields.io/github/package-json/v/doganhekimoglu/debounced-render
[github-license]: https://img.shields.io/npm/l/debounced-render
[github-license-url]: https://github.com/doganhekimoglu/debounced-render/blob/master/LICENSE
[npm-typescript]: https://img.shields.io/npm/types/debounced-render
