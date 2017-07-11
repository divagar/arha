// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import arhaConfig from '../../arha.json';

export const environment = {
  production: false,
  firebase: {
    apiKey: arhaConfig.firebase.apiKey,
    authDomain: arhaConfig.firebase.authDomain,
    databaseURL: arhaConfig.firebase.databaseURL,
    projectId: arhaConfig.firebase.projectId,
    storageBucket: arhaConfig.firebase.storageBucket,
    messagingSenderId: arhaConfig.firebase.messagingSenderId
  },
  gapi: {
    client_id: arhaConfig.gapi.client_id,
    project_id: arhaConfig.gapi.project_id,
    auth_uri: arhaConfig.gapi.auth_uri,
    token_uri: arhaConfig.gapi.token_uri,
    auth_provider_x509_cert_url: arhaConfig.gapi.auth_provider_x509_cert_url
  }
};
