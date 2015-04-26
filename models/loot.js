var mongoose = require('mongoose');
var Schema	= mongoose.Schema;

var LootSchema	= new Schema({
  playerName:  {type: String, required: true},
  allocatedBy: {type: String, required: true},
  itemName:    {type: String, required: true},
  bossName:    {type: String, required: true},
  type:        {type: String, required: true},
  itemID:      {type: Number, required: true},
  turn:        {type: Number, required: true},
  date:        {type: Date, default: Date()}
});

module.exports = mongoose.model('Loot', LootSchema);
