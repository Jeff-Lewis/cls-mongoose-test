var cls = require('cls-hooked');
var getNamespace = cls.getNamespace;
var nameSpaceName = 'sample';
var sampleKey = 'sampleKey';
var createNamespace = cls.createNamespace;
createNamespace(nameSpaceName);

var namespace = getNamespace(nameSpaceName);

const mongoose = require('mongoose');
const config = {
  dbIp: '127.0.0.1',
  dbPort: 27017,
  dbUser: 'test',
  dbPass: 'test',
  db: 'cls-mongoose-test'
};

let uri;
if (config.dbUser == '') {
  uri = 'mongodb://' + config.dbIp + ':' + config.dbPort + '/' + config.db;
} else {
  uri = 'mongodb://' + config.dbUser + ':' + config.dbPass + '@' + config.dbIp + ':' + config.dbPort + '/' + config.db;
}

mongoose.connect(uri);

mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.on('error', function (err) {
  console.log(err);
  setTimeout(() => {
    mongoose.connect(uri);
  }, 1000 * 3)
}).once('open', function () {
  console.log('mongodb connected!');
});

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ActivitySchema = new Schema({
  author: ObjectId,
  title: String,
  body: String,
  create_date: Date
});

var activityS = mongoose.model('activity', ActivitySchema, 'activity');


var _find = activityS.find;
activityS.find = function () {
  console.log('sampleKey:', namespace.get(sampleKey));
  return _find.apply(this, arguments);
}

async function find(ctx, next) {
  namespace.set(sampleKey, 'sample');
  let activity = await activityS.find({}).then(function () {
    console.log('sampleKey_find_then:', namespace.get(sampleKey));
  });
  console.log('sampleKey_find:', namespace.get(sampleKey));
  return activity;
}

namespace.run(function () {
  find();
});