// Licensed under the Apache License, Version 2.0 (the “License”); you may not
// use this file except in compliance with the License. You may obtain a copy of
// the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an “AS IS” BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations under
// the License.
// @flow

import fs from 'graceful-fs'
import path from 'path'
import Promise from 'bluebird'

Promise.promisifyAll(fs)

function list(fullPath:string) {
  return fs.readdirAsync(fullPath)
    .map(node => ({
      parent: fullPath,
      path: path.join(fullPath, node),
      name: node
    }))
    .map(node =>
      fs.statAsync(node.path)
        .then(stats => ({...node, stats}))
    )
}

function listRecursively(fullPath:string) {
  let result = []
  return list(fullPath)
    .each(node => result.push(node))
    .filter(node => node.stats.isDirectory())
    .map(node => listRecursively(node.path))
    .each(subDirContents => {
      result = result.concat(subDirContents)
    })
    .then(() => result)
}

export type Options = {
  recursive?:boolean,
  ignore?:RegExp,
  ignoreDirs?:boolean,
  ignoreFiles?:boolean
}
export default (fullPath:string, {recursive, ignore, ignoreFiles, ignoreDirs}:Options={}) => (
    !recursive
    ? list(fullPath)
    : listRecursively(fullPath)
  )
  .filter(node => !ignoreDirs ? true : !node.isDirectory())
  .filter(node => !ignoreFiles ? true : !node.isFile())
  .filter(node => !ignore ? true : !ignore.test(node.path))
