var crypto = require('crypto');
var http = require('http');

/**
 * Gets a block by id from block explorer and then calls callback on that block
 **/
function getBlock(blockId, callback)
{
	var location = 'http://blockexplorer.com/rawblock/' + blockId;
	http.get(location, function(res)
	{
		var body = '';

		res.on('data', function(chunk) {
			body += chunk;
		});

		res.on('end', function() {
			var blockResponse = JSON.parse(body)
			callback(blockResponse);
		});
	});	
}

/**
 * Performs in place byte reversal to swap endian
 **/
function swapBufferEndian(buffer)
{
	var len = buffer.length;
	var byteArray = [];
	for(var i = 1; i <= len; i++)
	{
		byteArray.push(buffer[len - i]);
	}
	return new Buffer(byteArray);
}

/**
 * Display LE buffer as big endian Hex
 **/
function getBufferHexBE(buffer)
{
	return swapBufferEndian(buffer).toString('hex');
}


/**
 * Creates a Little endian buffer from a hexadecimal string
 **/
function hex2LEbuf(hex)
{
	var buffer = new Buffer(hex, 'hex'); 	
	return swapBufferEndian(buffer);
}

/**
 * Creates a Little endian buffer from a decimal
 **/
function dec2LEbuf(dec)
{
	var buffer = new Buffer(4); 
	buffer.writeUInt32LE(dec,0);		
	return buffer;
}

/**
 * Performs a double hash on input buffer.
 * Returns buffer. 
 **/
function doubleHash(buffer)
{	
	var hasher1 = crypto.createHash('sha256');
	var hasher2 = crypto.createHash('sha256');
	
	hasher1.update(buffer);	
	var hash1 = hasher1.digest();	
	hasher2.update(hash1);	
	var hash2 = hasher2.digest();
	return hash2;	
}

exports.swapBufferEndian = swapBufferEndian;
exports.hex2LEbuf = hex2LEbuf;
exports.dec2LEbuf = dec2LEbuf;
exports.doubleHash = doubleHash;
exports.getBlock = getBlock;
exports.getBufferHexBE = getBufferHexBE;
