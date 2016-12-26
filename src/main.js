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

import fs from 'graceful-fs'
import Promise from 'bluebird'

Promise.promisifyAll(fs)

function listDir(fullTargetPath) {
  return fs.readdirAsync(fullTargetPath)
    .map(node => ({
      parent: fullTargetPath,
      path: path.join(fullTargetPath, node),
      name: node
    }))
    .map(node =>
      fs.statAsync(node.path)
        .then(stats => ({...node, stats}))
    )
}

function listDirRecursively(fullTargetPath) {
  let result = []
  return Promise.all(
      listDir(fullTargetPath)
        .each(node => result.push(node))
        .filter(node => node.stats.isDirectory())
        .map(node => listDirRecursively(node.path))
    )
    .each(subDirContents => {
      result = result.concat(subDirContents)
    })
    .then(() => result)
}

export function ls(fullTargetPath, recursive) {
  return !recursive
    ? listDir(fullTargetPath)
    : listDirRecursively(fullTargetPath)
}

export default ls
