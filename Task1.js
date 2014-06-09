var crypto = require('crypto');
var helpers = require('./helpers');

var genesisBlockId = '000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f';
var exampleBlockId = '00000000000000001e8d6829a8a21adc5d38d0a473b144b6765798e61f98bd1d';
var testId = '000000000000000063be697bdeaa662587226ca7648aeed64a324d7cef936ccd';

helpers.getBlock(testId, display);

/**
 * Callback for getBlock. Prints information about block to screen.
 **/
function display(block)
{
	var tree = new MerkleTree(block);
	
	//Print merkle tree:
	console.log('Merkle Tree:');
	console.log('[');
	
	tree.merkleTree.forEach(function(buffer)
	{
		console.log(getBufferHexBE(buffer));;
	});
	
	console.log(']');	
	
	if(getBufferHexBE(tree.merkleRoot) == block.mrkl_root) console.log('Merkle Root correct.');
	
	var blockHash = computeBlockHash(block);
	var blockHashHex = getBufferHexBE(blockHash);
	console.log('Hash: ' + blockHashHex);
	if(blockHashHex == block.hash) console.log('Hash correct.');	
	
	function getBufferHexBE(buffer){
		return helpers.swapBufferEndian(buffer).toString('hex');
	}
}

/**
 * Computes the Hash for the block
 **/
function computeBlockHash(block)
{			
	var version =  helpers.dec2LEbuf(block.ver),
    prevBlockHash =  helpers.hex2LEbuf(block.prev_block),
    rootHash = helpers.hex2LEbuf(block.mrkl_root),
    time = helpers.dec2LEbuf(block.time),
    bits = helpers.dec2LEbuf(block.bits),
    nonce = helpers.dec2LEbuf(block.nonce);	
	
	var headerBuffer = Buffer.concat([version, prevBlockHash, rootHash, time, bits, nonce]);	
	
	var hashBuffer = helpers.doubleHash(headerBuffer);	
	
	return hashBuffer;	
}

/**
 * Object to calculate the merkle tree of a block.
 **/
function MerkleTree(block)
{
	//Flat array of buffers containing the merkle tree
	var self = this;
	self.merkleTree = [];
	
	generateMerkleTree(block);
	
	//Buffer containing the merkle root
	this.merkleRoot = self.merkleTree.length > 0 ? self.merkleTree.slice(-1)[0] :'undefined'; 

	function generateMerkleTree(block)
	{
		var transactions = block.tx;			
		
		var row = formBottomRow(transactions);	
		
		do
		{	
			row = formNextRow(row);
		}
		while(row.length > 1);
			//self.merkleTree.push(row[0]);
	}

	/**
	 * Forms the bottom row of the merkle tree: 
	 * An array of Little Endian buffers, ensuring there are an even number of buffers.
	 **/
	function formBottomRow(transactions)
	{
		var row = [];
		for(var i = 0; i < transactions.length; i++)
		{
			var hashBuffer = helpers.swapBufferEndian((new Buffer(transactions[i].hash, 'hex')));				
			row.push(hashBuffer);
			self.merkleTree.push(hashBuffer);
		}
		//If there are an odd number of buffers, duplicate the last buffer:
		if(transactions.length % 2 == 1) {	
			row.push(hashBuffer);
			self.merkleTree.push(hashBuffer);
		}
		
		return row;
	}

	/**
	 * Takes the buffers from the previous row and computes 
	 * the buffers for the next row up
	 **/
	function formNextRow(previousRow)
	{
		var newRow = [];	
		for(var i = 0; i < previousRow.length; i+=2)
		{
			var left = previousRow[i],		
				right = previousRow[i + 1],
				concat = Buffer.concat([left, right]);	
				dHash =  helpers.doubleHash(concat);
			newRow.push(dHash);
			self.merkleTree.push(dHash);
		}
		
		//If there are an odd number of buffers, duplicate the last buffer:
		if(newRow.length > 1 && newRow.length % 2 == 1) {	
			newRow.push(dHash);
			self.merkleTree.push(dHash);
		}
		
		return newRow;
	}
}
