var Loot = require('./../models/loot');

exports.create = function(req, res) {
  var loot = new Loot();

  loot.playerName = req.body.playerName;
  loot.allocatedBy = req.body.allocatedBy;
  loot.itemName = req.body.itemName;
  loot.bossName = req.body.bossName;
  loot.type = req.body.type;
  loot.itemID = req.body.itemID;
  loot.turn = req.body.turn;

  loot.save(function(err) {
    if (err) { return res.send(err.message) }
    return res.json({message:'Loot item created'});
  });
};

exports.all = function(req, res) {
  Loot.find(function(err, loots) {
    if (err) { return res.send(err.message) }
    return res.json(loots);
  });
};

exports.find = function(req, res) {
  Loot.findById(req.params.id, function(err, loot) {
    if (err) { return res.send(err.message) }
    return res.json(loot);
  })
};

exports.update = function(req, res) {
  Loot.findById(req.params.id, function(err, loot) {
    if (err) { return res.send('Item doesn\'t exist') }

    loot.playerName = req.body.playerName || loot.playerName;
    loot.allocatedBy = req.body.allocatedBy || loot.allocatedBy;
    loot.itemName = req.body.itemName || loot.itemName;
    loot.bossName = req.body.bossName || loot.bossName;
    loot.type = req.body.type || loot.type;
    loot.itemID = req.body.itemID || loot.itemID;
    loot.turn = req.body.turn || loot.turn;

    loot.save(function(err) {
      if (err) { return res.send(err.message); }
      return res.json({message:'Item updated'});
    });
  });
};

exports.delete = function(req, res) {
  Loot.remove({
    _id: req.params.id
  }, function(err, loot) {
    if (err) { return res.send(err.message) }
    return res.json({message:'Item deleted'})
  });
};
