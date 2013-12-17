exports.load = function(req, res) {
	req.collection.find({}, {sort: [['_id',-1]]}).toArray(function(e, results) {
		console.log("LOADED MARKERS",results);
		res.send(results);
	});
};

exports.create = function(req, res) {
  req.collection.insert(req.body, {}, function(e, results) {
    if (e) return next(e);
    res.send(results[0]);
  });
};

exports.update = function(req, res) {

 console.log("UPDATE",req.body.title,req.body.id,req.body.description);
 req.collection.update(
 	{id: req.body.id}, 
 	{
 		$set:req.body
 		//$set:{title: req.body.title},
 		//$set:{description: req.body.description},
 		//$set:{pos: req.body.position},
 	}, {}, function(e, result) {
 		console.log("INSERTED?",result);
 		console.log("e: ",e);
 		res.send((result === 1) ? {msg:'success'} : {msg:'error'});
 	});
 	
};

exports.delete = function(req, res) {
	console.log("DELETE");
	req.collection.remove(
		{id: req.body.id},
		{},
		function(e, result) {
			console.log("DELETED?", result);
			 res.send((result === 1) ? {msg:'success'} : {msg:'error'});

		}
	);
};
