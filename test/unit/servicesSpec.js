'use strict';

/* jasmine specs for services go here */

describe('Service', function() {
 
  
  beforeEach(module('blockBrowser'));
  beforeEach(module('blockBrowser.services'));  
  
  describe('Block Service', function() {
	var blockService,
        $httpBackend;
	  
	 beforeEach(inject(function(_$httpBackend_, Blocks) {
		 console.log('inject');
		 blockService = 'jack';//Blocks;      
		 $httpBackend = 'jack';//_$httpBackend_;	
			
	}));
	  
	  it('should get the latest 10 blocks', function(){
		//var resultArray = blockService.blockChain(10, null);
		
		$httpBackend.when('GET').respond({prev_block: '0'});
		for(var i = 0; i < 10; i++)
		{
			//$httpBackend.flush();
		}
		//expect(resultArray.length).toBe(10);
	  });  
  });
});
