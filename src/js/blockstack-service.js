import * as blockstack from 'blockstack';
import { ipcRenderer } from 'electron';

document.getElementById('signin-button').addEventListener('click', function () {
  const transitPrivateKey = blockstack.generateAndStoreTransitKey()
  const redirectURI = 'http://localhost:9876/callback'
  const manifestURI = 'http://localhost:9876/manifest.json'
  const scopes = blockstack.DEFAULT_SCOPE
  const appDomain = 'http://localhost:9876'
  var authRequest = blockstack.makeAuthRequest(transitPrivateKey, redirectURI, manifestURI, scopes, appDomain)
  blockstack.redirectToSignInWithAuthRequest(authRequest)
})

ipcRenderer.on('displayUsername', function(event, profile) {
  document.getElementById('welcome').innerHTML = "Welcome " + profile.name
  document.getElementById('signin-button').style.display = "none"
});