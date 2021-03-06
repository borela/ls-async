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

import Path from 'path'
import { promisify } from 'bluebird'
import { readdir, stat } from 'graceful-fs'

let readdirAsync = promisify(readdir)
let statAsync = promisify(stat)

function list(fullPath:string) {
  return readdirAsync(fullPath)
    .map(node => ({
      name: node,
      parent: fullPath,
      path: Path.join(fullPath, node)
    }))
    .map(node =>
      statAsync(node.path)
        .then(stats => ({ ...node, stats }))
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

export default (fullPath:string, { recursive, ignore, ignoreFiles, ignoreDirs }:Options={}) => {
  let result = !recursive
    ? list(fullPath)
    : listRecursively(fullPath)
  if (ignoreDirs)
    result = result.filter(node => !node.isDirectory())
  if (ignoreFiles)
    result = result.filter(node => !node.isFile())
  if (ignore)
    result = result.filter(node => !ignore.test(node.path))
  return result
}
