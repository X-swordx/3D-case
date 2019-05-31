$(document).ready(function () {

    var $picLi = $('.main-mould-example ul');
    var $btnDiv = $(' .main-mould-example .btn div');
    var $banner = $('.main-mould-example');
    var timer;

    $banner.hover(function () {
        clearInterval(timer);
    }, function () {
        auto();
    });

    $btnDiv.click(function () {
        //判断按了左右键的
        var i = $(this).index();
        if (i) //1表示真，进入right
        {
            if (parseInt($picLi.css('left')) <= -1365) {
                $picLi.css('left', '0px');
            } else {
                $picLi.css({
                    left: function (index, value) {
                        return parseFloat(value) - 455;
                    }
                });
            }

        } else //0表示假，进入left
        {
            if (parseInt($picLi.css('left')) >= 0) {
                $picLi.css('left', '-1365px');
            } else {
                $picLi.css({
                    left: function (index, value) {
                        return parseFloat(value) + 455;
                    }
                });
            }

        }
        return false;
    });

    auto();

    function auto() {
        timer = setInterval(function () {
            fn();
        }, 3000);
    }

    function fn() {
        if (parseInt($picLi.css('left')) <= -1365) {
            $picLi.css('left', '0px');
        } else {
            $picLi.css({
                left: function (index, value) {
                    return parseFloat(value) - 455;
                }
            });
        }
    }
    //滚动下来之后隐藏右边栏
    $(document).scroll(function () {
        if ($(document).scrollTop() >= 1000) {
            $('#rightsidebar').hide();
        } else {
            $('#rightsidebar').show();
        }
    })

});