var ProtoBuf = require("protobufjs");
var TextFormat = require("protobuf-textformat");

var builder = ProtoBuf.loadProtoFile('./proto/caffe.proto')

var input = require('fs').readFileSync('./proto/lenet.prototxt', 'utf-8');

/* Parse the schema into a ProtoBuf.js messsage object. */
var result = TextFormat.parse(builder, 'caffe.NetParameter', input);

var canvas = $("canvas");

console.log("test");


