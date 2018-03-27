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
			});
			$locationProvider.html5Mode(true);
	}]);

	// create the controller and inject Angular's $scope
	dboardApp.controller('mainController', function($scope) {
		console.log("main");
		// create a message to display in our view
		$scope.title = "Home page";
		$scope.message = 'Everyone come and see how good I look!';
	});

	dboardApp.controller('aboutController', function($scope) {
		$scope.title = "About page";		
		$scope.message = 'Look! I am an about page.';
	});

	dboardApp.controller('contactController', function($scope) {
		$scope.message = 'Contact us! JK. This is just a demo.';
	});