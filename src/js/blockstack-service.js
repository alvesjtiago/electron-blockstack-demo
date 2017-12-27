import * as blockstack from 'blockstack';
import { ipcRenderer } from 'electron';

document.getElementById('signin-button').addEventListener('click', function () {
  var authRequest = blockstack.makeAuthRequest(blockstack.generateAndStoreTransitKey(), 'electronblockstackdemo://auth', 'http://localhost:9876/manifest.json', blockstack.DEFAULT_SCOPE, 'electronblockstackdemo://auth')
  blockstack.redirectToSignInWithAuthRequest(authRequest)
})

ipcRenderer.on('displayUsername', function(event, profile) {
  document.getElementById('welcome').innerHTML = "Welcome " + profile.name
  document.getElementById('signin-button').style.display = "none"
});