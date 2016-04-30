# koa2-ng-bs-starter

This is a sample project template using:

* [AngularJS](https://angularjs.org/)

* [angular-ui-bootstrap](https://angular-ui.github.io/bootstrap/)

* [Koa@2.0](https://github.com/koajs/koa/tree/v2.x)

## includes
* gulp tasks

  * lint - javascript linter [eslint](http://eslint.org/) module
  * test - nodejs testing  [mocha](https://mochajs.org/)
  * coveralls - code coverage reports  [istanbul](https://github.com/gotwarlost/istanbul) + [Coveralls](https://coveralls.io/)
  * pack - front end build system  [webpack](https://webpack.github.io/)
  * run - development run app [nodemon](http://nodemon.io/)

* Koa routing using [koa-load-routes](https://github.com/gbahamondez/koa-load-routes)



## run

```bash
$ npm install

# start development server,
# nodemon will watch changes in your backend files to restart the server
# webpack will watch changes in frontend files to re compile
$ gulp serve
```