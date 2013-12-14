
exports.create = function(req, res) {
  req.collection.insert(req.body, {}, function(e, results){
    if (e) return next(e);
    res.send(results[0]);
  });
};
