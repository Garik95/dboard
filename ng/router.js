	// create the module and name it dboardApp
	var dboardApp = angular.module('dboard-app', ['ngRoute']);

	// configure our routes
	dboardApp.config(['$routeProvider','$locationProvider',function($routeProvider,$locationProvider) {
		console.log($routeProvider);
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : '../pages/home.html',
				controller  : 'mainController'
			})

			// route for the about page
			.when('/about', {
				templateUrl : '../pages/about.html',
				controller  : 'aboutController'
			})

			// route for the contact page
			.when('/contact', {
				templateUrl : '../pages/contact.html',
				controller  : 'contactController'
			})
			.otherwise({redirectTo:"/"});
			$locationProvider.html5Mode(true);
	}]);

	dboardApp.controller('mainController', function($scope,$http) {
		var ld = pWait();
		$scope.title = "Dashboard";
		$scope.message = 'Everyone come and see how good I look!';
		$http.get('/list').then(function(res) {
			$scope.users_cnt = res.data.cnt;      
		  });
		ld.finish();
	});

	dboardApp.controller('aboutController', function($scope,$http) {
		var ld = pWait();
		$scope.title = "Notes list";		
		$scope.message = 'Look! I am an about page.';
		$scope.cars = "123123";
		$http.get('/api/todos').then(function(res) {
			$scope.todos = res.data;       
		  });
		ld.finish();
	});

	dboardApp.controller('contactController', function($scope) {
		$scope.message = 'Contact us! JK. This is just a demo.';
	});

	dboardApp.controller('MyController', ['$scope', '$http', function ($scope, $http) { 
		$http.get('/api/todos').success(function(data) {
			console.log(res.data);
			$scope.notes = data;       
	  	});
	  }]);

	  dboardApp.directive('isActiveNav', [ '$location', function($location) {
		return {
		 restrict: 'A',
		 link: function(scope, element) {
		   scope.location = $location;
		   scope.$watch('location.path()', function(currentPath) {
				if(angular.equals(currentPath,element[0].attributes['href'].nodeValue)){
			   element.addClass('active');
			 } else {				 
			   element.removeClass('active');
			 }
		   });
		 }
		 };
		}]);