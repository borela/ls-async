# LS Async

List directory's contents asynchronously using Bluebird promises.

## Installation

```shell
npm install ls-async
```

## Usage

```Javascript
import ls from 'ls-async'

let options = {
  recursive: true,
  // Useful to prevent directories contents from being listed.
  ignore: /pattern/
}

ls('path', options)
.map(node => {
  // Node = {
  //   parent:string,
  //   path:string,
  //   name:string,
  //   stats:fs.Stats
  // }
  console.log(node.path)
})
```
