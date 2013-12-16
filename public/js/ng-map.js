var app = angular.module("Mapp", []);

app.controller("markerCtrl", ["$scope", "$http", function($scope, $http) {

	$scope.id = 0;
	$scope.markerEvent = {
		latLng: 0,
		title: ""
	}
	$scope.markers = [],

	$scope.save = function(){
		console.log("markerEvent", $scope.markerEvent);
		$http.post('/collections/markers', {markerEvent: $scope.markerEvent})
        	.success(function(data, status, headers, config) {
            	console.log("posted successfully");
            	//$scope.messages.unshift(data);
            	//$scope.inputText = "";
        });
	},

	$scope.shout = function() {
		alert("HI!");
		console.log("controller",$scope);
	}
}]);

app.directive('map', function() {
	return {
		restrict: 'E',
		replace:true,
		template:"<div></div>",
		link: function(scope, element, attrs) {
			console.log("directive",scope);
			var mapOptions = {    
	          zoom: 12,
	          center: new google.maps.LatLng(53.349578,-6.260258),
	          mapTypeId: google.maps.MapTypeId.ROADMAP
	        };
    
    		var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
			
			google.maps.event.addListener(map, "click", function(event) {
				//scope.shout();
		        var marker = new google.maps.Marker({
		          position: event.latLng,
		          map: map,
		        });


		        scope.markerEvent.latLng = event.latLng;

		        scope.markers.push({
		        	id: scope.id++,
		        	pos: event.latLng
		        });

		        console.log(scope.markers);



		    });

    		
		}
	}
			
});

/*
app.directive('markers', function() {
	return {
		restrict: 'E',
		template: '<ul><li ng-repeat=\"marker in markers\">{{marker.id}}: {{marker.position}}</li></ul>',
		link: function(scope, element, attrs) {

		}
	}

});*/