var app = angular.module("Mapp", []);


app.controller("markerCtrl", ["$scope", "$http", function($scope, $http) {
	$scope.event = {
		
	},

	$scope.save = function() {
		alert("SAVE");
		console.log($scope.event);

		/*$http.post('/collections/markers', {text: $scope.inputText})
        	.success(function(data, status, headers, config) {
            	console.log("posted successfully");
            	//$scope.messages.unshift(data);
            	//$scope.inputText = "";
        });*/
	}, 
	$scope.shout = function() {
		alert("HI!");
	}

}]);

app.directive('map', function($compile) {
	return {
		restrict: 'E',
		replace: true,
        template: '<div></div>',
  

		link: function(scope, element, attrs) {
	    	var mapOptions = {    
	          zoom: 12,
	          center: new google.maps.LatLng(53.349578,-6.260258),
	          mapTypeId: google.maps.MapTypeId.ROADMAP
	        };
    
    		var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

    		var html = 
    		"<form id=\"markerInput\" ng-controller=\"markerCtrl\" ng-submit=\"save()\">"+
    		"<div class=\"form-group\"><label for=\"title\">Title</label><input ng-model=\"event.title\" class=\"form-control\" placeholder=\"Title\"></div>"+ 
    		"<div class=\"form-group\"><label for=\"desc\">Desc</label><input ng-model=\"event.desc\" class=\"form-control\" placeholder=\"Description\"></div>"+ 
    		"<div class=\"form-group\"><label for=\"start\">Start</label><input ng-model=\"event.start\" class=\"form-control\" placeholder=\"Start\"></div>"+ 
    		"<div class=\"form-group\"><label for=\"end\">End</label><input ng-model=\"event.end\" class=\"form-control\" placeholder=\"End\"></div>"+ 
    		"<div class=\"form-group\"><label for=\"tags\">Tags</label><input ng-model=\"event.tags\" class=\"form-control\" placeholder=\"Tags\"></div>"+
    		"<div class=\"form-group\"><button type=\"submit\" class=\"btn btn-default\">Submit</button>"+
    		"</form>";
    		
    		compiled = $compile(html)(scope);

		    infowindow = new google.maps.InfoWindow();

		    google.maps.event.addListener(map, "click", function(event) {
		        marker = new google.maps.Marker({
		          position: event.latLng,
		          map: map
		        });
		    	google.maps.event.addListener(marker, "click", function() {
		    		infowindow.setContent(compiled[0]);
		    		infowindow.open(map, marker);
		    	});
		    });
			    
    
    
		}
	}
});