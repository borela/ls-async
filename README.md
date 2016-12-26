# LS Async

List directory's contents asynchronously using Bluebird promises.

## Installation

```shell
npm install ls-async
```

## Usage

```Javascript
import ls from 'ls-async'

ls('path', recursive)
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
