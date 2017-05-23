#production build
ng build --prod

#copy prebuilt sw to dist
cp node_modules/@angular/service-worker/bundles/worker-basic.js dist/