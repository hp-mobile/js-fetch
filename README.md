# js-fetch

This is a small library to make using JavaScript's `fetch` a bit easier. It 
provides some utility functions to handle common request types.

The library assumes that responses will be in JSON format. If a response is not
going to be in that format, then you can still use the library, but most of its
usefulness will be gone.

Also included are some HighPoint-specific requirements like CSRF support and
`postMessage`s to `parent` informing it that the user is actively using `child`.

## Installation

`yarn add @highpoint/js-fetch`

## Usage

### GET request

```javascript
import { json } from '@highpoint/js-fetch';

(async () => {
  try {
    const jsonResponse = await json('https://api.example.com');
    console.log(jsonResponse);
  } catch (e) {
    // Handle the exception
  }
})();
```

### POST Form

```javascript
import { postForm } from '@highpoint/js-fetch';

(async () => {
  try {
    const jsonResponse = await postForm('https://api.example.com', {
      body: 'value1=1&value2=2'
    });
    console.log(jsonResponse);
  } catch (e) {
    // Handle the exception
  }
})();

```

### POST JSON

```javascript
import { postJSON } from '@highpoint/js-fetch';

(async () => {
  try {
    const jsonResponse = await postJSON('https://api.example.com', {
      body: {
        value1: 1,
        value2: 2
      }
    });
    console.log(jsonResponse);
  } catch (e) {
    // Handle the exception
  }
})();

```

### Using `<base>` HREF

```html
...
<base href="https://ps.example.com/psc/csdev/EMPLOYEE/SA/s/WEBLIB.ISCRIPT1.FieldFormula.IScript_Main">
...
```

```javascript
import { json } from '@highpoint/js-fetch';

(async () => {
  try {
    const jsonResponse = await json('TermOptions');
    console.log(jsonResponse);
  } catch (e) {
    // Handle the exception
  }
})();
```

GET request would be made to `https://ps.example.com/psc/csdev/EMPLOYEE/SA/s/WEBLIB.ISCRIPT1.FieldFormula.IScript_TermOptions`.

### Overriding the `<base>` HREF

The baseURI of the page can be overridden for requests made using js-fetch. If the value `window.highpoint.dataURI` is added to the global javascript namespace of the window, that url will be used instead of the `<base>` of the page.