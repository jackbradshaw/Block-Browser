var helpers = require('./helpers');
var crypto = require('crypto');

var testId = '000000000000000063be697bdeaa662587226ca7648aeed64a324d7cef936ccd';

helpers.getBlock(testId, showTree);

exports.tree = showTree;

function showTree(block)
{
	var tree = new MerkleTree(block);
	
	//Print merkle tree:
	console.log('Merkle Tree:');
	console.log('[');
	
	tree.merkleTree.forEach(function(buffer)
	{
		console.log(helpers.getBufferHexBE(buffer));
	});
	
	console.log(']');	

	if(helpers.getBufferHexBE(tree.merkleRoot) == block.mrkl_root) console.log('Merkle Root correct.');	

	return { tree: tree.merkleTree, n_tx: block.n_tx } ;
}

/**
 * Object to calculate the merkle tree of a block.
 **/
function MerkleTree(block)
{
	//Flat array of buffers containing the merkle tree
	var self = this;
	self.merkleTree = generateMerkleTree(block);
	
	generateMerkleTree(block);	
	
	console.log(JSON.stringify(self.merkleTree, null, 2));

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

		return row;
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
			row.push(new Node(hashBuffer));
		}
		//If there are an odd number of buffers, duplicate the last buffer:
		if(transactions.length % 2 == 1) {	
			row.push(new Node(hashBuffer, null, null, true));			
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
				concat = Buffer.concat([left.hash, right.hash]);	
				dHash =  helpers.doubleHash(concat);
			newRow.push(new Node(dHash, left, right));			
		}
		
		//If there are an odd number of buffers, duplicate the last buffer:
		if(newRow.length > 1 && newRow.length % 2 == 1) {	
			newRow.push(new Node(dHash,null, null, true)); //As this node is a duplicate we do not show it as having children 			
		}
		
		return newRow;
	}

	function Node(hash, leftChild, rightChild, duplicated)
	{
		var self = this;
		self.hash = hash;
		self.childrenHashes = [];
		if(leftChild != null)
			this.childrenHashes.push(leftChild);
		if(rightChild != null)
			this.childrenHashes.push(rightChild);
		var dupe = false;
		if(duplicated != null)
			dupe = duplicated;

		self.toJSON = function() 
		{ 
			var obj = 
			{
				hash : helpers.getBufferHexBE(self.hash),
				children : self.childrenHashes,
				duplicated : dupe
			};

			return obj;
		}
	}
}