# check-options

Check for required fields in an options object, and optionally apply defaults.

### FAQ

- Is it strict? Yes, it will throw an exception if the options contain invalid fields (fields which are neither required nor present in the defaults).
- Does it modify the input options object? No, it returns a copy.

### Usage: checking required options

```js
function myFunction(options) {
  options = checkOptions(options, ['size', 'color']);

  // ...
}

// Will throw: Missing field (color)
myFunction({size: 10});

// Will throw: Missing field (color); Invalid field (colr)
myFunction({size: 10, colr: 'red'});
```

### Usage: applying default values

```js
function myFunction(options) {
  options = checkOptions(options, ['size'], {color: red});

  // ...
}

// Will throw: Invalid field (colr);
myFunction({colr: 'blue'});
```

### Usage: context name for better error messages

```js
function myFunction(options) {
  // Pass an optional context string as the last argument:
  options = checkOptions(options, ['size', 'color'], 'myFunction');

  // ...
}

// The context string will appear in the error message.
// Will throw: "myFunction: Missing field (size)""
myFunction({color: 'blue'});
```

### Taking advantage of destructuring syntax

```js
function myFunction(options) {
  const {width, height, color} = checkOptions(options, ['width', 'height', 'color']);


  // ...
}
```
