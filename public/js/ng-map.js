var app = angular.module("Mapp", []);

app.controller("markerCtrl", ["$scope", "$http", function($scope, $http) {

	$scope.id = 0;

	$scope.currentMarker = null;
	var giveMeDatePlease = function() {
		var today = new Date();
	    var dd = today.getDate();
	    var mm = today.getMonth()+1; //January is 0!

	    var yyyy = today.getFullYear();
	    if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} var today = dd+'/'+mm+'/'+yyyy;
	    return today;
	}
	$scope.markerEvent = {
		title: "",
		description: "",
		latLng: 0,
		startDate: giveMeDatePlease(),
		endDate: giveMeDatePlease(),
		tags: []
	};

	$scope.markers = {};

	$scope.map = null;
/*
		$http.defaults.headers.common.Authentication = 'Basic REVWNzpQYXNzd29yZDEh';



	$http({method: 'GET', url: 'http://54.84.210.109:8000/dragonites/JohnAndCiaran/dontdeleteme/tests.xsodata/stops?$format=json'}).
		success(function(data,status,headers,config){
			console.log("SUCESS");

		}).
		error(function(data, status, headers, config){
			console.log("error");
		});
*/
var marker1 = null;
setTimeout(function(){
$.ajax({
	
  url: 'http://54.84.210.109:8000/dragonites/JohnAndCiaran/dontdeleteme/tests.xsodata/stops?$format=json',
/*  beforeSend: function (xhr) {
    xhr.setRequestHeader ("Authorization", "Basic REVWNzpQYXNzd29yZDEh");
	},*/
  type:"GET",
	dataType:"json",
	headers:{"Access-Control-Allow-Origin":"*",
	"Authorization":"Basic REVWNzpQYXNzd29yZDEh"
},
	crossDomain:true,
	xhrFields:{withCredentials:true},
	async:false
 }).done(function(){
 	console.log("finished req");
 }).success(function(data){
 	console.log("success req");
 	console.log("data: ",data);

 	console.log("lat:",data.d.results[0].STOPLATITUDE);
console.log("long:",data.d.results[0].STOPLONGITUDE);
console.log("name:",data.d.results[0].STOPNAME);
marker1  = data.d.results[0];


 	for(var i=0; i<data.d.results.length;i++) {

        	var marker = new google.maps.Marker({
				map:$scope.map,
				position:new google.maps.LatLng(data.d.results[i].STOPLATITUDE,data.d.results[i].STOPLONGITUDE),
				title:data.d.results[i].STOPNAME,
				description:data.d.results[i].STOPID,
				//id: $scope.id++,
				edit: false
        	});


 	}
 }).fail(function(){
 	console.log("fail req");
 });
console.log("map from scope: ",$scope.map);
new google.maps.Marker({
				map:$scope.map,
				position:new google.maps.LatLng(marker1.STOPLATITUDE,marker1.STOPLONGITUDE),
				title:marker1.STOPNAME,
				description:marker1.STOPID,
				//id: $scope.id++,
				edit: false
        	});

},1000);
	$scope.save = function(marker){
		$http.post('/collections/markers', 
			{
				id: marker.id, 
				title:marker.title, 
				description:marker.description, 
				pos:marker.position,
				startDate: marker.startDate,
		        endDate: marker.endDate,
		        tags: marker.tags,
			})
        	.success(function(data, status, headers, config) {
            	console.log("posted successfully",data);

            	// keep track of markers locally in an array
            	var id = marker.id;
            	// add the mongo id field for later updates
            	marker._id = data._id;
            	console.log("marker _id: ", marker._id);
            	// save full marker not just our stored details
            	// this is important to use Google Maps functions eg. setIcon()
		        $scope.markers[id] = marker;
            	
        });
	};

	$scope.update = function(markerID) {
		console.log("markerID", markerID);
		console.log("marker from objects: ", $scope.markers[markerID]);

		// look up markers from id
		var marker = $scope.markers[markerID];

		// need to add _id so mongo will update instead of save
		console.log("marker to be sent: ", {id: marker.id, title:marker.title, description:marker.description, pos:marker.position});
		$http.post('/collections/markers/update', {id: marker.id, title:marker.title, description:marker.description, pos:marker.position})
			.success(function(data, status, headers, config){
				console.log("posted successfully");
				$scope.markers[markerID].edit = false;
				$scope.markers[markerID].setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');

		})
		.error(function(data, status, headers, config) {
    		console.log(status);
  		});
	};

	$scope.delete = function() {
		// delete current marker
		$http.post('/collections/markers/delete', {id: $scope.currentMarker})
			.success(function(data, status, headers, config) {
				console.log("delete success");

				// now remove 
				// from map
				$scope.markers[$scope.currentMarker].setMap(null);
				// from object
				delete $scope.markers[$scope.currentMarker];
				// reset vars
				$scope.currentMarker = null;
				$scope.markerEvent.title = "";
				$scope.markerEvent.description = "";
			});

	};

	$scope.shout = function() {
		alert("HI!");
		console.log("controller",$scope);
	};

	// Do the initial load of markers on user button click, also used to poll for changes
	$scope.poll = function(){
	$http.get('/collections/markers')
      .success(function(data, status, headers, config) {
      	// load markers into our local object and map
      	console.log("Status: ",status);
      	console.log("Headers: ",headers);
      	console.log("Headers: ",headers);
        console.log("Loaded data",data);


        // wipe map then load with updated vals
        for (var m in $scope.markers) {
        	// from map
			$scope.markers[m].setMap(null);
			// from object
			delete $scope.markers[m];
			// reset vars
			$scope.currentMarker = null;
			$scope.markerEvent.title = "";
			$scope.markerEvent.description = "";
			$scope.id = 0;
        }

        // add all markers again
        // !! Loads of duplicated logic !!
        console.log("markeers: ",$scope.markers);
        console.log("data length: ",data.length);

        for(i = 0 ; i < data.length; i++) {
        	console.log("in for looop");
        	// object

        	console.log("data rec: ",data[i]);

        	var pos = data[i]['pos'];
        	console.log("data position: ",pos);

        	var posMem = Object.keys(pos);
        	console.log("data position first mem: ",posMem[0]);
        	console.log("data position second mem: ",posMem[1]);

        	var marker = new google.maps.Marker({
				map:$scope.map,
				position:new google.maps.LatLng(posMem[0].toString(),posMem[1].toString()),
				title:data[i].title,
				description:data[i].description,
				//id: $scope.id++,
				edit: false
        	});


        	/*google.maps.event.addListener(marker, "click", function() {
			
				// if first click, it doesn't need to be saved, just highlighted as edited
				if(!marker.edit) {
					// update marker visually
					marker.edit = true;
					marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
					// set markerid so delete works
					$scope.currentMarker = marker.id;
					
					// when marker is click, we need to update form to reflect its info
					// using $apply because we need to notify angular of change
					$scope.$apply(function() {
						$scope.markerEvent.title = marker.title;
						$scope.markerEvent.description = marker.description;
					});
				}else{
					// if second click, update marker with form details
					marker.title = $scope.markerEvent.title;
					marker.description = $scope.markerEvent.description;
					//and it has to be saved to DB
					$scope.update(marker.id);
				}
			});*/
        	

        	// WTF is this?????/
        	console.log("marker being added: ",marker);
        	var id = marker.id;
        	$scope.markers[id] = marker;
        }// end for loop

      })
      .error(function(data, status, headers, config) {
    		console.log(status);
  	  });
	};


}]);

app.directive('map', function() {
	return {
		restrict: 'E',
		replace:true,
		template:"<div></div>",
		link: function(scope, element, attrs) {
			console.log("directive",scope);
			var mapOptions = {    
	          zoom: 17,
	          center: new google.maps.LatLng(53.344428,-6.260877),
	          mapTypeId: google.maps.MapTypeId.ROADMAP
	        };
    
    		var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
			scope.map = map;
/*
			google.maps.event.addListener(map, "click", function(event) {

				// create a marker and chuck our form event details into it
		        var marker = new google.maps.Marker({
		          position: event.latLng,
		          map: map,
		          // custom
		          id: scope.id++,
		          // form elements
		          title: scope.markerEvent.title,
		          description: scope.markerEvent.description,
		          startDate: scope.markerEvent.startDate,
		          endDate: scope.markerEvent.endDate,
		          tags: scope.markerEvent.tags,
		          // token to show it doesn't need to be saved
		          edit: false
		        });
		        scope.currentMarker = marker.id;
		       
		        // update form to reflect current event on click of marker
		    	google.maps.event.addListener(marker, "click", function() {
					//console.log("marker click id:",marker.id);
					//console.log("marker click title:",marker.title);

					// if first click, it doesn't need to be saved, just highlighted as edited
					if(!marker.edit) {
						// update marker visually
						marker.edit = true;
						marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
						
						// set markerid so delete works
						scope.currentMarker = marker.id;

						// when marker is click, we need to update form to reflect its info
						// using $apply because we need to notify angular of change
						scope.$apply(function() {
							scope.markerEvent.title = marker.title;
							scope.markerEvent.description = marker.description;
						});
					}else{
						// if second click, update marker with form details
						marker.title = scope.markerEvent.title;
						marker.description = scope.markerEvent.description;
						//and it has to be saved to DB
						scope.update(marker.id);
					}

				});
				
				// save marker to db
				//scope.save(marker);

		    });*/
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