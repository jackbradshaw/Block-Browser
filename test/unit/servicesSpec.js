'use strict';

/* jasmine specs for services go here */

describe('Service', function() {
  
  beforeEach(module('blockBrowser'));
  //beforeEach(module('blockBrowser.services'));  
  
  describe('Block Service', function() {
  
	var blockService,
        $httpBackend;
	  
	 beforeEach(inject(function(_$httpBackend_, Blocks) {
		 console.log('inject');
		 blockService = Blocks;      
		 $httpBackend = _$httpBackend_;	
		 
		$httpBackend.when('GET', '/rawblock/0').respond({prev_block: '0'});
		$httpBackend.when('GET', '/rawblock/1').respond(404, '');
		
		//Unsuccessful heights 4, 3, 2
		$httpBackend.when('GET', '/q/getblockhash/4').respond('1');
		$httpBackend.when('GET', '/q/getblockhash/3').respond('1');
		$httpBackend.when('GET', '/q/getblockhash/2').respond('1');
		//Successful heights 1		
		$httpBackend.when('GET', '/q/getblockhash/1').respond('0'); 

		//Default latest hash will return a hash for a block that *can* be found
		$httpBackend.when('/q/latesthash').respond('0');
	}));
	
	afterEach(function() {
         $httpBackend.verifyNoOutstandingExpectation();
         $httpBackend.verifyNoOutstandingRequest();
       });
	  
	  it('should get the next n blocks', function(){
		var numberToGet = 3;
		var resultArray = blockService.blockChain(numberToGet, 0);
		
		
		$httpBackend.flush();
		
		resultArray.then(function(result) {
			return expect(result.length).toBe(numberToGet); 
		});		
	  });    
	  
	  it('should get latest hash if no hash supplied', function() { 
		$httpBackend.expectGET('/q/latesthash').respond('0'); 
		var resultArray = blockService.blockChain(2);
		$httpBackend.flush();		
	  });
	  
	  it('should use chain length if latest block not availible and decrease height until block found', function() {

	  	//Latest hash is for a block which cannot be found
		$httpBackend.expectGET('/q/latesthash').respond('1');
		$httpBackend.expectGET('/rawblock/1');

		//Get chain length
		$httpBackend.expectGET('/q/getblockcount').respond('4');
		//Get hashes at decresing height:
		$httpBackend.expectGET('/q/getblockhash/3'); //Block Fail
		$httpBackend.expectGET('/q/getblockhash/2'); //Block Fail
		$httpBackend.expectGET('/q/getblockhash/1'); //Block Success
		
		var resultArray = blockService.blockChain(2);

		$httpBackend.flush();
	  });

	  it('should not decrease the height more than three times', function() {
		//Latest hash is for a block which cannot be found
	  	$httpBackend.expectGET('/q/latesthash').respond('1');
	    //Get chain length
		$httpBackend.expectGET('/q/getblockcount').respond('5');
		//Get hashes at decresing height:
		$httpBackend.expectGET('/q/getblockhash/4'); //Block Fail
		$httpBackend.expectGET('/q/getblockhash/3'); //Block Fail
		$httpBackend.expectGET('/q/getblockhash/2'); //Block Fail		

		//expect(blockService.blockChain).toThrow(new Error('Head of block chain not found after 3 attempts'));

		blockService.blockChain(2);

		$httpBackend.flush();
	  });
  });
});
