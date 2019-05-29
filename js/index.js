window.onload = function () {
  (function () {
    var len = 5 * 5 * 5, //生成li的数目
      oUl = document.getElementById("list").children[0], // 获取li的父级ul元素
      aLi = oUl.children; //获取所有的li

    //初始化
    (function () {
      //循环创建len个li
      for (var i = 0; i < len; i++) {
        //创建li
        var oLi = document.createElement("li");
        //给每一个li添加相关的属性值
        oLi.index = i;
        oLi.x = i % 5;
        oLi.y = Math.floor(i % 25 / 5);
        oLi.z = 4 - Math.floor(i / 25);

        //获取案例数据
        var data = flyData[i] || flyData[0];

        //添加li的内容
        oLi.innerHTML = "<b class='liCover'></b>" +
          "<p class='liTitle'>" + data.type + "</p >" +
          "<p class='liAuthor'>" + data.author + "</p>" +
          "<p class='liTime'>" + data.time + "</p>";

        //定义li在3D空间的随机位置
        var randomX = Math.random() * 4000 - 2000,
          randomY = Math.random() * 4000 - 2000,
          randomZ = Math.random() * 4000 - 2000;

        //设置li的初始值
        oLi.style.transform = "translate3D(" + randomX + "px," + randomY + "px," + randomZ + "px)";

        oUl.appendChild(oLi);
      }
      setTimeout(Grid, 10);
    })();

    //弹出案例框
    (function () {
      // 获取案例框元素
      var oAlert = document.getElementById('alert'),
        aATitle = oAlert.getElementsByClassName('title')[0].getElementsByTagName('span')[0],
        oAImg = oAlert.getElementsByClassName('img')[0].getElementsByTagName('img')[0],
        oAAuthor = oAlert.getElementsByClassName('author')[0].getElementsByTagName('span')[0],
        oAInfo = oAlert.getElementsByClassName('info')[0].getElementsByTagName('span')[0];

      //获取点击弹出案例页面元素
      var oAll = document.getElementById("all");
      var oFrame = document.getElementById("frame");
      var oBack = document.getElementById("back");

      //通过事件委托给每一个li添加点击事件
      oUl.onclick = function (e) {
        //获取点击事件的事件源
        var target = e.target;
        if (target.nodeName == "B") {
          if (target.goudan) { //判断点击li但是不是要触发弹出框，而是要拖动
            target.goudan = false;
          } else {
            //判断alert的display状态来确定是显示还是隐藏
            if (oAlert.style.display == "block") {
              //隐藏
              hide();
            } else {
              //显示
              //获取被点击的li的index索引值
              var index = target.parentNode.index;
              //通过index获取对应的案例数据内容
              var data = flyData[index] || flyData[0];

              oAlert.index = index;
              //修改弹窗的内容
              aATitle.innerHTML = '标题: ' + data.title;
              oAImg.src = 'src/' + data.src + '/index.png';
              oAAuthor.innerHTML = '作者:' + data.author;
              oAInfo.innerHTML = '描述: ' + data.dec;
              show();

            }
          }
        }
        //取消点击事件向上冒泡
        e.cancelBubble = true;
      }

      //如果点击弹窗,跳转到案例页面
      oAlert.onclick = function () {
        //获取数据
        var data = flyData[this.index] || flyData[0];
        oFrame.src = 'src/' + data.src + '/index.html';
        oAll.className = "left";
        return false; //阻止默认事件
      }

      //点击返回按钮
      oBack.onclick = function () {
        oAll.className = "";
      }

      //点击除了弹窗以外的空白地方消失
      document.onclick = function () {
        hide();
      }

      //点击弹出显示函数
      function show() {
        if (!oAlert.timer) {
          oAlert.timer = true;
          oAlert.style.display = "block";

          //设置弹窗的初始位置
          oAlert.style.transform = 'rotateY(0deg) scale(2)';
          oAlert.style.opacity = '0';

          //定义弹窗运动的开始时间
          var time = 300,
            sTime = new Date();
          //运动函数（让OAlert从无到有显示出来）
          function move() {
            //值为0.1,0.2这样一直加到1
            var prop = (new Date() - sTime) / time;
            if (prop >= 1) {
              prop = 1;
              oAlert.timer = false;
            } else {
              //系统每16.6ms执行一次回调函数
              requestAnimationFrame(move);
            }
            oAlert.style.transform = 'rotateY(0deg) scale(' + prop + ')';
            oAlert.style.opacity = prop;
          }
          requestAnimationFrame(move);
        }
      }

      //弹窗隐藏函数
      function hide() {
        if (oAlert.style.display == "block" && !oAlert.timer) {
          oAlert.timer = true;
          // 初始弹出隐藏的样式
          oAlert.style.display = 'block';
          oAlert.style.transform = 'rotateY(0deg) scale(1)';
          oAlert.style.opacity = '1';
        }
        //定义运动开始前的时间
        var time = 300;
        var sTime = new Date();

        //运动函数,让OAlert有从显示到消失的过程
        function move() {
          var prop = (new Date() - sTime) / time;
          if (prop >= 1) {
            prop = 1;
            oAlert.timer = false;
            oAlert.style.display = 'none';
          } else {
            requestAnimationFrame(move);
          }
          oAlert.style.transform = 'rotateY(' + prop * 180 + 'deg) scale(' + (1 - prop) + ')';
          oAlert.style.opacity = 1 - prop;

        }
        requestAnimationFrame(move);
      }
    })();

    // 拖拽, 滚轮事件
    (function () {
      var roX = 0,
        roY = 0,
        trZ = -2000;

      //清除字体被选中的默认事件
      document.onselectstart = function () {
        return false;
      }

      //鼠标按下事件
      document.onmousedown = function (e) {
          // 定义参数变量
          var sX = e.clientX, // 鼠标点击时的x坐标
            sY = e.clientY, // 鼠标点击时的y坐标
            lastX = sX, // 鼠标移动move最后一次x值
            lastY = sY, // 鼠标移动move最后一次y值
            x_ = 0, // 鼠标抬起时最后两点的x差值
            y_ = 0, // 鼠标抬起时最后两点的y差值
            //moveTime = 0, // 最后一次move的时间
            ifTime = new Date; //鼠标点击同一个元素的时间

          //为了解决down和up在同一元素身上触发点击事件触发弹窗
          if (e.target.nodeName == "B") {
            var thisLi = e.target;
          }

          //鼠标移动
          this.onmousemove = function (e) {
            //计算鼠标移动的距离
            x_ = e.clientX - lastX;
            y_ = e.clientY - lastY;

            //通过鼠标移动的距离来计算要旋转的度数
            roX -= y_ * 0.15;
            roY += x_ * 0.15;

            // 旋转ul
            oUl.style.transform = "translateZ(" + trZ + "px) rotateX(" + roX + "deg) rotateY(" + roY + "deg)";

            //重新赋值,把当前鼠标的值存起来
            lastX = e.clientX;
            lastY = e.clientY;

            //获取每次鼠标移动后的时间
            //moveTime = new Date();
          }

          //鼠标抬起事件
          this.onmouseup = function (e) {
            // 判断up时的事件源和down时事件源是不是同一个和相差时间大于1秒
            if (e.target == thisLi && (new Date - ifTime) > 500) {
              thisLi.goudan = true; //表示是拖动事件，不触发弹窗
            }
            //清除鼠标移动事件
            this.onmousemove = null;

            //计算缓冲函数
            function buffer() {
              //通过系数慢慢减少移动距离
              x_ *= 0.9;
              y_ *= 0.9;
              //通过距离来计算旋转值
              roX -= y_ * 0.15;
              roY += x_ * 0.15;
              // 旋转ul
              oUl.style.transform = "translateZ(" + trZ + "px) rotateX(" + roX + "deg) rotateY(" + roY + "deg)";
              if (Math.abs(x_) < 0.1 && Math.abs(y_) < 0.1) return; //退出缓冲
              requestAnimationFrame(buffer);
            }
            //拖动间隔时间短才缓冲
            //if (new Date - moveTime < 100) {
            requestAnimationFrame(buffer)
            //}
          }
        }

        // 滚轮滚动改变Z轴移动
        ! function (fn) {
          // 滚轮兼容
          if (document.onmousewheel === undefined) {
            // 兼容火狐浏览器
            document.addEventListener('DOMMouseScroll', function (e) {
              var d = -e.detail / 3;
              fn(d)
            }, false)
          } else {
            // 主流浏览器
            document.onmousewheel = function (e) {
              var d = e.wheelDelta / 120;
              fn(d)
            }
          }
        }(function (d) {
          trZ += d * 100; //扩大它放大缩小的px
          oUl.style.transform = "translateZ(" + trZ + "px) rotateX(" + roX + "deg) rotateY(" + roY + "deg)";
        });

    })();

    // 右下角按钮点击事件
    (function () {
      // 获取所有按钮
      var aBtn = document.getElementById('btn').getElementsByTagName('li');
      var arr = [Table, Sphere, Helix, Grid, Love];
      for (var i = 0; i < aBtn.length; i++) {
        aBtn[i].onclick = arr[i];
      }
    })();

    // Table 元素周期表
    function Table() {
      if (Table.arr) {
        for (var i = 0; i < len; i++) {
          aLi[i].style.transform = Table.arr[i]
        }
      } else {

        Table.arr = [];
        var n = Math.ceil(len / 18) + 2; // 计算li要排列多少行
        var midY = n / 2 - 0.5; // 现在有9行,ul所要的位置在第四行
        var midX = 18 / 2 - 0.5; // 计算传值方向上ul所在的x的位置

        // 定义每个li之间的间距
        var disX = 170;
        var disY = 210;

        var arr = [{
            x: 0,
            y: 0
          },
          {
            x: 17,
            y: 0
          },
          {
            x: 0,
            y: 1
          },
          {
            x: 1,
            y: 1
          },
          {
            x: 12,
            y: 1
          },
          {
            x: 13,
            y: 1
          },
          {
            x: 14,
            y: 1
          },
          {
            x: 15,
            y: 1
          },
          {
            x: 16,
            y: 1
          },
          {
            x: 17,
            y: 1
          },
          {
            x: 0,
            y: 2
          },
          {
            x: 1,
            y: 2
          },
          {
            x: 12,
            y: 2
          },
          {
            x: 13,
            y: 2
          },
          {
            x: 14,
            y: 2
          },
          {
            x: 15,
            y: 2
          },
          {
            x: 16,
            y: 2
          },
          {
            x: 17,
            y: 2
          },
        ];

        // 循环计算li的位置
        for (var i = 0; i < len; i++) {
          var x, y;
          if (i < 18) {
            x = arr[i].x;
            y = arr[i].y;
          } else {
            x = i % 18;
            y = Math.floor(i / 18) + 2;
          }

          // 设置li的位置
          var val = 'translate3D(' + (x - midX) * disX + 'px,' + (y - midY) * disY + 'px,0px)'
          Table.arr[i] = val;
          aLi[i].style.transform = val;
        }
      }
    }

    // Sphere 球面布局
    function Sphere() {
      if (Sphere.arr) {
        for (var i = 0; i < len; i++) {
          aLi[i].style.transform = Sphere.arr[i];
        }
      } else {
        Sphere.arr = [];
        // 定义arr确定球面一共多少层,以及每层多少个li
        var arr = [1, 3, 7, 9, 11, 14, 21, 16, 12, 10, 9, 7, 4, 1],
          arrlen = arr.length,
          xDeg = 180 / (arrlen - 1);
        console.log(xDeg)

        // 循环遍历所有的li
        for (var i = 0; i < len; i++) {
          // 0  1 2 4
          // 定义遍历来保存此时的i是球面上的第几层，已经当前层的第几个
          var numC = 0, // 计算当前i是第几层
            numG = 0; // 计算当前i是处于当前层的第几个
          var arrSum = 0; // 当目前层一共多少个li

          // for循环判断此时的i是第几层的第几个
          for (var j = 0; j < arrlen; j++) {
            arrSum += arr[j]; // 1  4 4  11

            // 判断i是第几层第几个
            if (arrSum > i) {
              numC = j; // 0 1 1  2
              numG = arr[j] - (arrSum - i); // 0 0 1 0
              break;
            }
          }
          // 根据当前层数求出当前层每一liy轴旋转度数
          var yDeg = 360 / arr[numC];
          // 设置li旋转
          var val = "rotateY(" + (numG + 1.3) * yDeg + "deg) rotateX(" + (90 - numC * xDeg) + "deg) translateZ(800px)"
          Sphere.arr[i] = val;
          aLi[i].style.transform = val;
        }
      }


    }

    // Helix 螺旋式布局
    function Helix() {
      if (Helix.arr) {
        for (var i = 0; i < len; i++) {
          aLi[i].style.transform = Helix.arr[i]
        }
      } else {
        Helix.arr = [];

        var h = 3.7, //环数
          tY = 7, // 每个li上下错位
          num = Math.round(len / h), // 确定每环多少个li
          deg = 360 / num, // 计算每个li Y轴旋转度数
          mid = len / 2 - 0.5; // 找中间值

        for (var i = 0; i < len; i++) {
          var val = "rotateY(" + i * deg + "deg) translateY(" + (i - mid) * tY + "px) translateZ(900px)";
          Helix.arr[i] = val;
          aLi[i].style.transform = val
        }
      }
    }


    //生成Grid图形
    function Grid() {
      if (Grid.arr) {
        //不是第一次点击就直接赋值
        for (var i = 0; i < len; i++) {
          aLi[i].style.transform = Grid.arr[i];
        }
      } else {
        //如果是第一次点击就先计算
        Grid.arr = [];
        var disX = 250; // 每个li水平(x)方向的间距
        var disY = 250; // 每个li垂直(y)方向的间距
        var disZ = 600; // 每个li纵深(z)方向的间距

        // 计算每个li的x,y,z值
        for (var i = 0; i < len; i++) {
          var oLi = aLi[i];
          var x = (oLi.x - 2) * disX,
            y = (oLi.y - 2) * disY,
            z = (oLi.z - 2) * disZ;
          var val = "translate3D(" + x + "px," + y + "px," + z + "px)";
          Grid.arr[i] = val;
          oLi.style.transform = val;
        }
      }
    }

    //爱心图形
    function Love() {
      //这一步是为了提高性能
      if (Love.arr) {
        for (var i = 0; i < len; i++) {
          aLi[i].style.transform = Love.arr[i]
        }
      } else {

        Love.arr = [];
        var midY = 4;
        var midX = 7;

        // 定义每个li之间的间距
        var disX = 170;
        var disY = 210;

        var arr = [{
            x: 3,
            y: 0
          },
          {
            x: 4,
            y: 0
          },
          {
            x: 5,
            y: 0
          },
          {
            x: 9,
            y: 0
          },
          {
            x: 10,
            y: 0
          },
          {
            x: 11,
            y: 0
          },
          {
            x: 2,
            y: 1
          },
          {
            x: 3,
            y: 1
          },
          {
            x: 4,
            y: 1
          },
          {
            x: 5,
            y: 1
          },
          {
            x: 6,
            y: 1
          },
          {
            x: 8,
            y: 1
          },
          {
            x: 9,
            y: 1
          },
          {
            x: 10,
            y: 1
          },
          {
            x: 11,
            y: 1
          },
          {
            x: 12,
            y: 1
          },
          {
            x: 1,
            y: 2
          },
          {
            x: 2,
            y: 2
          },
          {
            x: 3,
            y: 2
          },
          {
            x: 4,
            y: 2
          },
          {
            x: 5,
            y: 2
          },
          {
            x: 6,
            y: 2
          },
          {
            x: 7,
            y: 2
          },
          {
            x: 8,
            y: 2
          },
          {
            x: 9,
            y: 2
          },
          {
            x: 10,
            y: 2
          },
          {
            x: 11,
            y: 2
          },
          {
            x: 12,
            y: 2
          },
          {
            x: 13,
            y: 2
          },
          {
            x: 1,
            y: 6
          },
          {
            x: 2,
            y: 6
          },
          {
            x: 3,
            y: 6
          },
          {
            x: 4,
            y: 6
          }, {
            x: 5,
            y: 6
          }, {
            x: 6,
            y: 6
          }, {
            x: 7,
            y: 6
          }, {
            x: 8,
            y: 6
          }, {
            x: 9,
            y: 6
          }, {
            x: 10,
            y: 6
          }, {
            x: 11,
            y: 6
          }, {
            x: 12,
            y: 6
          }, {
            x: 13,
            y: 6
          }, {
            x: 2,
            y: 7
          }, {
            x: 3,
            y: 7
          }, {
            x: 4,
            y: 7
          }, {
            x: 5,
            y: 7
          }, {
            x: 6,
            y: 7
          }, {
            x: 7,
            y: 7
          }, {
            x: 8,
            y: 7
          }, {
            x: 9,
            y: 7
          }, {
            x: 10,
            y: 7
          }, {
            x: 11,
            y: 7
          }, {
            x: 12,
            y: 7
          }, {
            x: 3,
            y: 8
          }, {
            x: 4,
            y: 8
          }, {
            x: 5,
            y: 8
          }, {
            x: 6,
            y: 8
          }, {
            x: 7,
            y: 8
          }, {
            x: 8,
            y: 8
          }, {
            x: 9,
            y: 8
          }, {
            x: 10,
            y: 8
          }, {
            x: 11,
            y: 8
          }, {
            x: 4,
            y: 9
          }, {
            x: 5,
            y: 9
          }, {
            x: 6,
            y: 9
          }, {
            x: 7,
            y: 9
          }, {
            x: 8,
            y: 9
          }, {
            x: 9,
            y: 9
          }, {
            x: 10,
            y: 9
          }, {
            x: 5,
            y: 10
          }, {
            x: 6,
            y: 10
          }, {
            x: 7,
            y: 10
          }, {
            x: 8,
            y: 10
          }, {
            x: 9,
            y: 10
          }, {
            x: 6,
            y: 11
          }, {
            x: 7,
            y: 11
          }, {
            x: 8,
            y: 11
          }, {
            x: 6.5,
            y: 12
          }, {
            x: 7.5,
            y: 12
          }, {
            x: 7,
            y: 13
          }



        ];
        console.log(arr.length)
        // 循环计算li的位置
        for (var i = 0; i < len; i++) {
          var x, y;
          if (i < 30) {
            x = arr[i].x;
            y = arr[i].y;
          } else if (i >= 75 && i < len) {
            x = arr[i - 45].x;
            y = arr[i - 45].y;
          } else {
            x = i % 15;
            y = Math.floor(i / 15) + 1;
          }

          // 设置li的位置
          var val = 'translate3D(' + (x - midX) * disX + 'px,' + (y - midY) * disY + 'px,0px)'
          Love.arr[i] = val;
          aLi[i].style.transform = val;
        }


      }
    }

  })()
}