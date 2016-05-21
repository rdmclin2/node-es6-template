import foo from '../'
import assert from 'assert'

describe('node-es6-template', () => {
  it('should return foo', done => {
    const output = foo()
    assert(output, 'foo')
    done()
  })
})