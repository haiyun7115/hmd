!function(){
	var init = (function(){
		var methods = hmd.methods,
	 		service = hmd.service,
	 		router = hmd.router,
			key = 'contract',
	 		_obj = {
	 			contract : router.contract,
	 			recharge : router.recharge
	 		},
			p_obj = {
				"cont":"contract",
				"rec":"recharge"
			};
		if(location.hash==="#contract"){
			key = p_obj.cont
		}
        if(location.hash==="#pay_detail"){
            key = p_obj.rec
        }
		return function(){
			methods.getUrl({
				id : 'main-body',
				key : key,
				source : _obj
			})
		}
	}());
	init();
}()