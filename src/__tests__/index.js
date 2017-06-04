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

import ls from '..'
import { resolve } from 'path'

const ASSETS = resolve(__dirname, './assets')

describe('ls()', () => {
  it('lists a directory’s contents', () => {
    expect.assertions(1)
    return ls(ASSETS)
      .then(list => {
        expect(list.length).toBe(6)
      })
  })

  it('can ignore nodes using regexes', () => {
    expect.assertions(1)
    return ls(ASSETS, { ignore: /[\\/]a$/ })
      .then(list => {
        expect(list.length).toBe(5)
      })
  })

  it('lists a directory’s contents recursively', () => {
    expect.assertions(1)
    return ls(ASSETS, { recursive: true })
      .then(list => {
        expect(list.length).toBe(15)
      })
  })

  it('lists an ignored directory’s contents', () => {
    expect.assertions(1)
    return ls(ASSETS, {
      ignore: /[\\/]a$/,
      recursive: true
    })
      .then(list => {
        expect(list.length).toBe(14)
      })
  })
})
