import Server from '@/Server'
import assert from 'assert'

describe('Server', () => {
  const name = 'B.js Tests'

  describe('#getName', () => {
    it(`should equal '${name}'`, () => {
      const s = new Server({ name }, false)

      assert.equal(s.getName(), name)
    })
  })
  describe('#getMaxPlayers', () => {
    const maxPlayers = 5
    it(`should equal '${maxPlayers}'`, () => {
      const s = new Server({ name, maxPlayers }, false)

      assert.equal(s.getMaxPlayers(), maxPlayers)
    })
  })
  describe('#getTime', () => {
    it('should be a number', () => {
      const s = new Server({ name }, false)

      assert.equal(typeof s.getTime(), 'number')
    })
  })
})
