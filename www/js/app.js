// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

const host = 'http://192.168.199.201';

angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $compileProvider) {

  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|itms-services):/);

  $stateProvider.state('products', {
    url: '/products',
    controller: 'ProductsCtrl',
    templateUrl: 'templates/products.html'
  })
  .state('product', {
    url: '/products/:id',
    controller: 'ProductCtrl',
    templateUrl: 'templates/product.html'
  })

  $urlRouterProvider.otherwise('/products');
})

.controller('ProductsCtrl', function($scope, products, $ionicLoading, $timeout) {

  $scope.host = host;

  $scope.init = function() {
    $ionicLoading.show({
      template: '<i class="ion-loading-c"></i><br>Loading ...',
      duration: 10000
    });
    $scope.getAllProducts();
  }

  $scope.getAllProducts = function() {
    products.load().then(function(){
      $scope.products = products.list;
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide(); 
    }, function(err){
      console.log('error:' + err);
      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    });
  }

  $scope.init();
})

.controller('ProductCtrl', function($scope, productReleases, $stateParams, $ionicLoading){

  $scope.refreshReleases = function() {
    productReleases.load($stateParams.id).then(function(){
      $scope.releases = productReleases.list;
      $scope.$broadcast('scroll.refreshComplete');
    })
  }


  $ionicLoading.show({
    template: '<i class="ion-loading-c"></i><br>Loading ...',
    duration: 10000
  });


  productReleases.load($stateParams.id).then(function(){
    $scope.releases = productReleases.list;
    $ionicLoading.hide();
  })
})

.factory('products', function($http, $q) {
  var products = {};
  products.list = [];
  products.load = function() {
    var defer = $q.defer();
    $http.get(host + '/api/products')
    .success(function(res) {
      console.log(res);
      products.list = res;
      defer.resolve(res);
    })
    .error(function(err, status) {
      defer.reject(err);
    })
    return defer.promise;
  };
  return products;
})

.factory('productReleases', function($http) {
  var releases = {};
  releases.list = [];
  releases.load = function(product_id) {
    return $http.get(host + '/api/products/' + product_id + '/releases')
      .then(function(res) {
        releases.list = res.data;
      });
  };
  return releases;
})







