'use strict'

const chai   = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')

const Picasa = require('./picasa')

const expect = chai.expect

chai.use(sinonChai)

describe('Picasa', () => {
  describe('getAuthURL', () => {
    it('returns valid URI', () => {
      const clientSecret = 'client_secretABC'
      const redirectURL = 'http://localhost'
      const clientId = 'apps.google.com'

      const picasa = new Picasa(clientId, redirectURL)

      expect(picasa.getAuthURL())
        .to.be.equals('https://accounts.google.com/o/oauth2/auth?access_type=offline&scope=https%3A%2F%2Fpicasaweb.google.com%2Fdata%2F&response_type=code&client_id=apps.google.com&redirect_uri=http%3A%2F%2Flocalhost')
    })
  })

  describe('getAccessToken', () => {
    let stub, picasa

    beforeEach(() => {
      const clientSecret = 'client_secretABC'
      const redirectURL = 'http://localhost'
      const clientId = 'apps.google.com'

      picasa = new Picasa(clientId, redirectURL, clientSecret)

      const body = {
        access_token : 'ya29.KwLDeXsw1jNAavZ8jEMFgikhDg_CnUX1oMr5RQUyeqTBf229YV4HzhhXvRgBBvFGqTqxdw',
        token_type   : 'Bearer',
        expires_in   : 3580
      }

      stub = sinon.stub(picasa.request, 'post')
      stub.callsArgWithAsync(1, null, {}, body)
    })

    afterEach(() => stub.restore())

    it('returns access token response', (done) => {
      picasa.getAccessToken('4/DxoCTw8Rf3tQAAW94h6lK7ioEjnu6K8kEqVZ0d-cRA8', (error, accessToken) => {
        expect(error).to.be.equal(null)
        expect(stub).to.have.been.calledWith('https://www.googleapis.com/oauth2/v3/token?grant_type=authorization_code&code=4%2FDxoCTw8Rf3tQAAW94h6lK7ioEjnu6K8kEqVZ0d-cRA8&redirect_uri=http%3A%2F%2Flocalhost&client_id=apps.google.com&client_secret=client_secretABC')
        expect(accessToken).to.be.equals('ya29.KwLDeXsw1jNAavZ8jEMFgikhDg_CnUX1oMr5RQUyeqTBf229YV4HzhhXvRgBBvFGqTqxdw')

        done()
      })
    })
  })
})
