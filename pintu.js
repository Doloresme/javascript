var imgH = $('.gameBox').height(),
    imgW = $('.gameBox').width(),
    cellW = imgW / 3,
    cellH = imgH / 3,
    flag = true,
    oriArr = [], //正序数组
    ranArr = [], //乱序数组
    imgArr = []; //调整后的数组
init();
function init() {
    domSplit();
    gameState();
}
//分割游戏dom区域，变成9宫格样式
function domSplit() {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            //创建初始数组
            oriArr.push(i * 3 + j);
            // imgArr.push(i * 3 + j); //为了获取随机数组
            //创建每个小的div，添加到gameBox中
            var div = $('<div class="cell"></div>');
            div.css({
                'width': cellW + 'px',
                'height': cellH + 'px',
                'left': j * cellW + 'px',
                'top': i * cellH + 'px',
                // 'backgroundPosition': (-j * cellW) + 'px' +  (-i * cellH) + 'px'
                'backgroundPosition': (-j) * cellW + 'px ' + (-i) * cellH + 'px',
            })
            $('.gameBox').append(div);
        }
    }
}
//按钮状态
function gameState() {
    $('.start').on('click', function () {
        if (flag) {//开始游戏-->按钮变成‘复原’ -->获取乱序数组 
                    // --> 拖拽小格子 -->小格子交换位置
            $(this).text('复原');
            flag = false;
            randomArr();
            cellOrder(imgArr);
            $('.cell').on('mousedown', function (e) {
                // console.log(this);
                var x = e.pageX - $(this).offset().left,//获取鼠标距离此容器边框的距离
                    y = e.pageY - $(this).offset().top,
                    index1 = $(this).index(),
                    that = this;
                // console.log(x, y);
                $(document).on('mousemove', function (e2) {
                    $(that).css({ //实现小格子的拖拽
                        'z-index': 40,
                        'left': e2.pageX - $('.gameBox').offset().left - x + 'px',
                        'top': e2.pageY - $('.gameBox').offset().top - y + 'px'
                    })
                }).on('mouseup', function (e3) {
                    $(document).off('mousemove').off('mouseup');//解除绑定事件
                    //鼠标放下的时候判断此小格子是否需要与其他格子交换位置
                    //from  --> to(从移动的x轴和y轴的距离计算与哪个小格子交换)
                    var left = e3.pageX - $('.gameBox').offset().left;
                    var top = e3.pageY - $('.gameBox').offset().top;
                    // console.log(index1);
                    var index2 = changeIndex(left, top, index1);
                    // console.log(index2);
                    if (index2 == index1) {
                        cellReturn(index1);
                    } else {
                        cellChange(index1, index2);
                    }
                })
            })
        } else {
            $(this).text('开始');
            flag = true;
            cellOrder(oriArr);
            $('.cell').off('mousedown');
        }
        // console.log(flag);
    })
}
// 获取乱序数组（2种方法实现，第一种感觉耗费资源太多）(第二种老出错？？？为啥)
// function randomArr() {
//     imgArr = [];
//     var len = oriArr.length,
//         num;
//     console.log(len)
//     for(var i = 0;i< len; i++){
//         num = Math.floor(Math.random() * len);
//         if($.inArray(num, imgArr) == -1){
//             imgArr.push(num);
//         }else{ //如果重复就重新获取
//             i --;
//         }  
//     }
//     // console.log(imgArr);
// }
function randomArr() {
    $.extend(true, imgArr, oriArr);
    imgArr.sort(function () {
        return Math.random() - 0.5;
    })
}

//根据数组排列9宫格小方块
function cellOrder(arr) {
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        $('.cell').eq(i).animate({
            'left': (arr[i] % 3) * cellH + 'px',
            'top': Math.floor(arr[i] / 3) * cellH + 'px',
        })
    }
}
//根据移动的x轴和y轴的距离判断与哪个各自交换位置
function changeIndex(x, y, index) {
    if (x < 0 || x > imgW || y < 0 || y > imgH) {
        return index;
    }
    var col = Math.floor(x / cellW),
        row = Math.floor(y / cellH),
        l = row * 3 + col;
    // console.log(row, col);
    // return l; //为什么不能直接返回l呢？
    var i = 0,
        len = imgArr.length;
    while ((i < len) && (imgArr[i] !== l)) {
        i++;
    }
    return i;
}
//交换位置 （交换的其实是数组的位置【乱序状态下，要用imgArr[i]】）
function cellChange(from, to) {
    var fromI = imgArr[from] % 3,//开始位置的列
        fromJ = Math.floor(imgArr[from] / 3), //开始位置的行
        toI = imgArr[to] % 3, //目标位置的列
        toJ = Math.floor(imgArr[to] / 3), //目标位置行
        temp = imgArr[from]; //利用一个变量，使起始位置和目标位置的值交换
    // imgArr[from] = imgArr[to];
    // imgArr[to] = temp;
    // cellOrder(imgArr);
    $('.cell').eq(from).animate({
        'left': toI * cellW + 'px',
        'top': toJ * cellH + 'px'
    }, function () {
        $(this).css('z-index', '10');
    });
    $('.cell').eq(to).animate({
        'left': fromI * cellW + 'px',
        'top': fromJ * cellH + 'px'
    }, function () {
        $(this).css('z-index', '10');
        imgArr[from] = imgArr[to];
        imgArr[to] = temp;
        check()
    })
    // cellOrder(imgArr);
    // console.log(from, to);
}
function cellReturn(index) {
    var row = Math.floor(imgArr[index] / 3);
    var col = imgArr[index] % 3;
    $('.cell').eq(index).animate({
        'top': row * cellH + 'px',
        'left': col * cellW + 'px',
    }, 400, function () {
        $(this).css('z-index', '10');
    })
}
function check() {
    if (imgArr.toString() == oriArr.toString()) {
        alert('游戏成功！');
        flag = true;
        $('.start').text('开始');
    }
}