!function () {
    var service = hmd.service,
        methods = hmd.methods,
        $sentCheckBtn = $("#send_check_num"),
        nameText = $.cookie("data_customerName");
    /*用户人名*/
    $("#customerName").text(nameText);
    /*判断location.hash是否存在*/
    function active() {
        $("#myTab li").removeClass("active");
        if(location.hash==="#contract"){
            $("#myTab li:eq(0)").addClass("active");
        }else if(location.hash==="#pay_detail"){
            $("#myTab li:eq(1)").addClass("active");
        }else{
            $("#myTab li:eq(0)").addClass("active");
        }
    }
    /*注销接口*/
    function logout(obj) {
        obj.click(function () {
            service.logout(function(data){
                if(data.code === "2000"){
                    $.cookie("data_token",'');
                    hmd.component({
                        temp : '_login_temp',
                        id : 'root'
                    });
                    /*退出后发送验证码样式以及不可点击*/
                    $("#send_check_num").removeClass("code_button_cur");
                    $("#send_check_num").removeClass("code_button_cur_disabled");
                    $("#send_check_num").attr("disabled",true);
                }
            })
        });
    }
    function init(){
        active();
        logout($("#_exit"));
    }
    init();

}();