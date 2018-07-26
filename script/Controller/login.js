!function(methods){
	var service = hmd.service,
	    methods = hmd.methods;
    var $root = $('#root');
    var $contentBox = $("#contentBox");
    var $idCard= $("#idCard");
    var $telNum = $("#tel_num");
    var $checkNum = $("#check_num");
    var $info = $("#info");
    var $loginSubmit = $("#login_submit");
    var $sentCheckBtn = $("#send_check_num");


    attrDisabled($sentCheckBtn,true);

    /*点击登录事件*/
    function submit() {
        $('#login_submit').click(function(){
            // attrDisabled($loginSubmit,false);
            if($("#check_num").val()==="" || $("#check_num").val()===null){
                console.log(111);
                $info.show().html("验证码不能为空！");
                // attrDisabled($loginSubmit,true);
            }else{
                // attrDisabled($loginSubmit,false);
                console.log(222);
                service.login(function (data) {
                    if(data.code==="2000"){
                        $.cookie("data_token",data.token);
                        $.cookie("data_customerName",data.customerName);
                        hmd.component({
                            temp : 'content',
                            id : 'root'
                        })
                    }else{
                        $info.show().html("验证码填写错误，请重新输入！");
                    }
                });
            }
        });
    }


    /*---------点击发送验证码事件-----------*/
    var regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    var regTelNum = /^1[1-9]\d{9}$/;
    var obj = {
        regIdCard:regIdCard,
        regTelNum:regTelNum
    };
    /*判断身份证号格式是否正确的idCard方法*/
    function idCard() {
        var id = $idCard.val();
        if(id === ""){
            $info.show().html("请输入您的身份证号码！");
            return false;
        }
        if(id && !(obj.regIdCard.test(id))){
            $info.show().html("请输入正确的身份证号码！");
            return false;
        }
        if(id && obj.regIdCard.test(id)){
            $info.hide();
            return true;
        }
        return true;
    }
    /*判断手机号格式是否正确的telNum方法*/
    function telNum() {
        var tel = $telNum.val();
        if(tel === ""){
            // $telNum.focus();
            $info.show().html("请输入您手机号！");
            return false;
        }
        if(tel && !(obj.regTelNum.test(tel))){
            // $telNum.focus();
            $info.show().html("请输入正确的手机号！");
            return false;
        }
        if(tel && obj.regTelNum.test(tel)){
            $info.hide();
            return true;
        }
        return true;
    }
    /*一个表单实时判断所有表单的值是否为true*/
    var objKeyUp = {
        0:$idCard,
        1:$telNum
    };
    function initInputEvent(){
        for(key in objKeyUp){
            objKeyUp[key].keyup(function () {
                checkForm();
            })
        }
    }

    /*disabled*/
    function attrDisabled(id,boolean) {
        id.attr("disabled",boolean);
    }
    /*所有表单的判断*/
    function checkForm() {
        if(idCard() && telNum()){
            attrDisabled($sentCheckBtn,false);
            $sentCheckBtn.addClass("code_button_cur");
            /*attrDisabled($idCard,true);
            attrDisabled($telNum,true);*/
        }else{
            attrDisabled($sentCheckBtn,true);
            $sentCheckBtn.removeClass("code_button_cur");
        }
    }
    /*验证码定时器*/
    var InterValObj; /*timer变量，控制时间*/
    var curCount = 60;
    function SetRemainTime() {
        if(curCount == 0){
            window.clearInterval(InterValObj);/*停止计时器*/
            $sentCheckBtn.addClass("code_button_cur");
            $sentCheckBtn.removeClass("code_button_cur_disabled");
            $sentCheckBtn.attr("disabled",false);
            $sentCheckBtn.text("发送验证码");
            curCount = 60;
        }else{
            curCount --;
            /*console.log(curCount);*/
            $sentCheckBtn.removeClass("code_button_cur");
            $sentCheckBtn.addClass("code_button_cur_disabled");
            $sentCheckBtn.attr("disabled",true);
            $sentCheckBtn.text('('+curCount+')s');
        }
    }

    /*发送验证码事件*/
    function submitCheckForm() {
        $sentCheckBtn.click(function(){
            /*发送验证码的接口*/
            service.checkForm(function (data) {
                if(data.code === "2000"){
                    /*启动计时器timer处理函数，1秒执行一次*/
                    InterValObj = window.setInterval(SetRemainTime, 1000);
                    /*验证码60s重新发送*/
                    /*methods.setTime("#send_check_num",60);*/
                    $info.show().html("验证码发送成功！");
                }else{

                    /*$info.show().html("身份证号不存在或手机号不匹配，请重新输入！");*/
                    $info.show().html(data.desc);
                    /*attrDisabled($idCard,false);
                    attrDisabled($telNum,false);*/
                    attrDisabled($sentCheckBtn,true);
                    $sentCheckBtn.removeClass("code_button_cur");
                }
            });
        })
    }

    /*判断在文本框输入时，键盘松开时其他符号输入为空*/
    function keyUpEvent() {
        $idCard.keyup(function () {
            this.value = this.value.replace(/[^\dxX]/g,'');
        });
        function keyUp(id) {
            id.keyup(function () {
                this.value = this.value.replace(/[^\d]/g,'');
            });
        }
        keyUp($telNum);
        keyUp($checkNum);
    }
    /*鼠标输入时value消失，鼠标离开时value显示*/
    var objFocusBlur = {
        0:$idCard,
        1:$telNum,
        2:$checkNum
    };
    function focusBlur() {
        for(key in objFocusBlur){
            objFocusBlur[key].focus(function () {
                var labelIdCard = $(this).siblings('label');
                labelIdCard.hide();
            });
            objFocusBlur[key].blur(function () {
                var labelIdCard = $(this).siblings('label');
                if(this.value === ""){
                    labelIdCard.show();
                }
            })
        }
    }

    function templateTransform(){
        $.ajax({
            url : './views/footer.html',
            //async : false,
            success : function(data){
                console.log(data);

                /*$(document.body).append(methods.manageTemplate({
                    data : data,
                    config : {
                        p : 9
                    }
                }))*/

                $(document.body).append(data)
                
            }
        })
    }

    /*初始化*/
    function init(){
        /*focusBlur();
        keyUpEvent();
        initInputEvent();
        submit();
        submitCheckForm();*/
       var aaa =  methods.handleTemplate({
            config : {
                p : 8
            }
        });
       //console.log(aaa)
        /*hmd.component({
            temp: 'content',
            id: 'root'
        })*/
        //console.log(hmd.component.property)
        templateTransform();
    }
    init();
}(hmd.methods);