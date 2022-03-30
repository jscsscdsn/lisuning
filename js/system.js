/* Version v8
 ** QQ:2528119536 
 ** Up:2018.03.08*/
var zanpian = {
  //浏览器信息
  'browser': {
    'url': document.URL,
    'domain': document.domain,
    '127.0.0.1': document.title,
    'language': function () {
      try {
        var ua = (navigator.language || navigator.browserLanguage).toLowerCase(); //zh-tw|zh-hk|zh-cn
        return ua;
      } catch (e) {}
    }(),
    'canvas': function () {
      return !!document.createElement('canvas').getContext;
    }(),
    'useragent': function () {
      var ua = navigator.userAgent; //navigator.appVersion
      return {
        'mobile': !!ua.match(/AppleWebKit.*Mobile.*/), //是否为移动终端 
        'ios': !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        'android': ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1, //android终端或者uc浏览器 
        'iPhone': ua.indexOf('iPhone') > -1 || ua.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器 
        'iPad': ua.indexOf('iPad') > -1, //是否iPad
        'trident': ua.indexOf('Trident') > -1, //IE内核
        'presto': ua.indexOf('Presto') > -1, //opera内核
        'webKit': ua.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        'gecko': ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') == -1, //火狐内核 
        'weixin': ua.indexOf('MicroMessenger') > -1 //是否微信 ua.match(/MicroMessenger/i) == "micromessenger",			
      };
    }()
  },
  //系统公共
  'cms': {
    'tab': function () {
      $("#myTab li a").click(function (e) {
        $(this).tab('show');
        //$($(this).attr('href')).find('a').lazyload({effect: "fadeIn"});
      });
    },
    'scrolltop': function () {
      var a = $(window);
      $scrollTopLink = $("a.backtop");
      a.scroll(function () {
        500 < $(this).scrollTop() ? $scrollTopLink.css("display", "block") : $scrollTopLink.css("display", "none")
      });
      $scrollTopLink.on("click", function () {
        $("html, body").animate({
          scrollTop: 0
        }, 400);
        return !1
      })
    },

    //公共
    'all': function (url) {
      $('body').on("click", "#login,#user_login,#navbar_user_login", function (event) {
        $('.zanpian-modal').modal('hide');
        if (!zanpian.user.islogin()) {
          event.preventDefault();
          zanpian.user.loginform();
          return false;
        }
      });
      $('.navbar-search').click(function () {
        $('.user-search').toggle();
        $('#nav-signed,#example-navbar-collapse').hide();
      })
      $('.navbar-navmore').click(function () {
        $('.user-search').toggle();
        $('#nav-signed,.user-search').hide();
      })
      //点击弹出注册窗口
      $('body').on("click", "#register", function () {
        zanpian.cms.modal(cms.root + 'index.php?s=/home/ajax/reg');
        zanpian.user.reg();
      });
      //显示更多
      $('body').on("click", ".more-click", function () {
        var self = $(this);
        var box = $(this).attr('data-box');
        var allNum = $(this).attr('data-count');
        var buNum = allNum - $(this).attr('data-limit');
        var sta = $(this).attr('data-sta');
        var hideItem = $('.' + box).find('li[rel="h"]');
        if (sta == undefined || sta == 0) {
          hideItem.show(200);
          $(this).find('span').text('收起部分' + buNum);
          self.attr('data-sta', 1);
        } else {
          hideItem.hide(200);
          $(this).find('span').text('查看全部' + allNum);
          self.attr('data-sta', 0);
        }

      });
      //键盘上一页下一页
      var prevpage = $("#pre").attr("href");
      var nextpage = $("#next").attr("href");
      $("body").keydown(function (event) {
        if (event.keyCode == 37 && prevpage != undefined) location = prevpage;
        if (event.keyCode == 39 && nextpage != undefined) location = nextpage;
      });
      //播放窗口隐藏右侧板块
      $('body').on("click", "#player-shrink", function () {
        $(".player_right").toggle();
        $(".player_left").toggleClass("max");
        $(".player-shrink").toggleClass("icon-left");
      });
      if ($('.player_playlist').length > 0) {
        zanpian.player.playerlist();
      }
      if ($('.top-show').length > 0) {
        $('.top-show').children().hover(function (t) {
          $(this).siblings().removeClass('active');
          $(this).addClass('active').find(".loading").lazyload();
        })
      }
      $('body').on("click", "#lyric", function (event) {
        $("#" + $(this).data('id')).toggle();
      });
      $(window).resize(function () {
        zanpian.player.playerlist();
      });
      $(".player-tool em").click(function () {
        $html = $(this).html();
        try {
          if ($html == '关灯') {
            $(this).html('开灯')
          } else {
            $(this).html('关灯')
          }
        } catch (e) {}
        $(".player-open").toggle(300);
        $(".player_left").toggleClass("player-top")
        $(".player_right").toggleClass("player-top")
      });
      $('body').on("focus", "#id_input", function () {
        //$("#role_list").hide();						   
      })
      $('body').on("click", "#get_role", function () {
        $("#role_list").show();
      });
      $('body').on("click", "#user_detail_add", function (event) {
        if (!zanpian.user.islogin()) {
          zanpian.user.loginform();
          return false;
        }
        var url = $(this).data('url');
        zanpian.cms.modal(url);
      });

    }
  },

  'detail': {
    'collapse': function () { //内容详情折叠
      $('body').on("click", "[data-toggle=collapse]", function () {
        $this = $(this);
        $($this.attr('data-target')).toggle();
        $($this.attr('data-default')).toggle();
        if ($this.attr('data-html')) {
          $data_html = $this.html();
          $this.html($this.attr('data-html'));
          $this.attr('data-html', $data_html);
        }
        if ($this.attr('data-val')) {
          $data_val = $this.val();
          $this.val($this.attr('data-val'));
          $this.attr('data-val', $data_val);
        }
      });
    },
    //播放列表折叠
    'playlist': function () {
      //更多播放地址切换
      $(".player-more .dropdown-menu li").click(function () {
        $("#playTab").find('li').removeClass('active');
        var activeTab = $(this).html();
        var prevTab = $('.player-more').prev('li').html();
        $('.player-more').prev('li').addClass('active').html(activeTab);
        //var prevTab = $('#playTab li:nth-child(2)').html(); 
        //$('#playTab li:nth-child(2)').addClass('active').html(activeTab);		   
        $(this).html(prevTab);
      });
      if ($('.player-more').length > 0) {
        $(".dropdown-menu li.active").each(function () {
          var activeTab = $(this).html();
          var prevTab = $('.player-more').prev('li').html();
          $('.player-more').prev('li').addClass('active').html(activeTab);
          $(this).html(prevTab).removeClass('active');
        });
      }
      //手机端播放源切换
      $(".mplayer .dropdown-menu li").click(function () {
        var sclass = $(this).find('a').attr('class');
        var stext = $(this).text();
        $("#myTabDrop2 .name").text(stext);
        $("#myTabDrop2").removeClass($("#myTabDrop2").attr('class'));
        $("#myTabDrop2").addClass(sclass);
      });
      var WidthScreen = true;
      for (var i = 0; i < $(".playlist ul").length; i++) {
        series($(".playlist ul").eq(i), 20, 1);
      }

      function series(div, n1, n2) { //更多剧集方法
        var len = div.find("li").length;
        var n = WidthScreen ? n1 : n2;
        if (len > 24) {
          for (var i = n2 + 18; i < len - ((n1 / 2) - 2) / 2; i++) {
            div.find("li").eq(i).addClass("hided");
          }
          var t_m = "<li class='more open'><a target='_self' href='javascript:void(0)'>更多剧集</a></li>";
          div.find("li").eq(n2 + 17).after(t_m);
          var more = div.find(".more");
          var _open = false;
          div.css("height", "auto");
          more.click(function () {
            if (_open) {
              div.find(".hided").hide();
              $(this).html("<a target='_self' href='javascript:void(0)'>更多剧集</a>");
              $(this).removeClass("closed");
              $(this).addClass("open");
              $(this).insertAfter(div.find("li").eq(n2 + 17));
              _open = false;
            } else {
              div.find(".hided").show();
              $(this).html("<a target='_self' href='javascript:void(0)'>收起剧集</a>");
              $(this).removeClass("open");
              $(this).addClass("closed");
              $(this).insertAfter(div.find("li:last"));
              _open = true;
            }
          })
        }
      }
    },

  },
  'player': {
    //    //播放页面播放列表
    'playerlist': function () {
      var height = $(".player_left").height();
      if ($('.player_prompt').length > 0) {
        var height = height - 50;
      }
      $(".player_playlist").height(height - 55);
      var mheight = $(".mobile_player_left").height();
      if ($(".player_playlist").height() > mheight) {
        $(".player_playlist").height(mheight - 55);
      }


    },

  },

  //图片处理
  'image': {
    //幻灯与滑块
    'swiper': function () {
      $.ajaxSetup({
        cache: true
      });
      $.getScript(cms.public + "js/swiper.min.js", function () {
        var swiper = new Swiper('.box-slide', {
          pagination: '.swiper-pagination',
          lazyLoading: true,
          preventClicks: true,
          paginationClickable: true,
          autoplayDisableOnInteraction: false,
          autoplay: 3000,
          loop: true,
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
        });
        var swiper = new Swiper('.details-slide', {
          pagination: '.swiper-pagination',
          autoHeight: true,
          loop: true,
          nextButton: '.details-slide-next',
          prevButton: '.details-slide-pre',
          paginationType: 'fraction',
          keyboardControl: true,
          lazyLoading: true,
          lazyLoadingInPrevNext: true,
          lazyLoadingInPrevNextAmount: 1,
          lazyLoadingOnTransitionStart: true,
        });
        var swiper = new Swiper('.news-switch-3', {
          lazyLoading: true,
          slidesPerView: 3,
          spaceBetween: 0,
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          breakpoints: {
            1200: {
              slidesPerView: 3,
              spaceBetween: 0
            },
            992: {
              slidesPerView: 2,
              spaceBetween: 0
            },
            767: {
              slidesPerView: 1,
              spaceBetween: 0
            }
          }
        });
        var swiper = new Swiper('.news-switch-4', {
          lazyLoading: true,
          slidesPerView: 4,
          spaceBetween: 0,
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          breakpoints: {
            1200: {
              slidesPerView: 4,
              spaceBetween: 0
            },
            992: {
              slidesPerView: 3,
              spaceBetween: 0
            },
            767: {
              slidesPerView: 2,
              spaceBetween: 0
            }
          }
        });
        var swiper = new Swiper('.news-switch-5', {
          lazyLoading: true,
          slidesPerView: 5,
          spaceBetween: 0,
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          breakpoints: {
            1200: {
              slidesPerView: 4,
              spaceBetween: 0
            },
            992: {
              slidesPerView: 3,
              spaceBetween: 0
            },
            767: {
              slidesPerView: 2,
              spaceBetween: 0
            }
          }
        });
        var swiper = new Swiper('.vod-swiper-4', {
          lazyLoading: true,
          slidesPerView: 4,
          spaceBetween: 0,
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          breakpoints: {
            1200: {
              slidesPerView: 4,
              spaceBetween: 0
            },
            767: {
              slidesPerView: 3,
              spaceBetween: 0
            }
          }
        });
        var swiper = new Swiper('.vod-swiper-5', {
          lazyLoading: true,
          slidesPerView: 5,
          spaceBetween: 0,
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          breakpoints: {
            1200: {
              slidesPerView: 4,
              spaceBetween: 0
            },
            767: {
              slidesPerView: 3,
              spaceBetween: 0
            }
          }
        });
        var swiper = new Swiper('.vod-swiper-6', {
          lazyLoading: true,
          slidesPerView: 6,
          spaceBetween: 0,
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          loop:true,
          breakpoints: {
            1200: {
              slidesPerView: 5,
              spaceBetween: 0
            },
            992: {
              slidesPerView: 4,
              spaceBetween: 0
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 0
            }
          }
        });
      });
    },
    //延迟加载
    'lazyload': function () {
      $.ajaxSetup({
        cache: true
      });
      $.getScript(cms.public + "js/jquery.lazyload.min.js", function (response, status) {
        $(".loading").lazyload({
          effect: "fadeIn",
          failurelimit: 15
        });
      });
    },

  },

};
MAC.Star.Init = function () {
  //不能用data-score，这是默认参数，会使动态设置的数值无效
  var $that = $('.mac_star');
  if ($that.length == 0) {
    return;
  }
  MAC.Ajax(maccms.path + '/index.php/ajax/score?mid=' + $that.attr('data-mid') + '&id=' + $that.attr('data-id'), 'get', 'json', '', function (e) {
    $that.attr({
      'score': e.data.score,
      'data-star': Math.ceil(e.data.score / 2)
    });
    $that.raty({
      starType: 'li',
      number: 5,
      numberMax: 5,
      space: false,
      score: function () {
        return $that.attr('data-star');
      },
      hints: ['很差', '较差', '还行', '推荐', '力荐'],
      starOff: '',
      starOn: 'active',
      target: $("#ratewords"),
      targetKeep: e.data.score_num > 0 ? true : false,
      targetText: '暂无评分',
      click: function (score, evt) {
        MAC.Ajax(maccms.path + '/index.php/ajax/score?mid=' + $that.attr('data-mid') + '&id=' + $that.attr('data-id') + '&score=' + (score * 2), 'get', 'json', '', function (r) {
          if (r.code == 1) {
            $that.attr({
              'score': r.data.score,
              'data-star': Math.ceil(r.data.score / 2)
            });
            $that.raty('set', {
              'score': Math.ceil(r.data.score / 2),
              'targetKeep': r.data.score_num > 0 ? true : false,
            });
            MAC.Pop.Msg(100, 20, '评分成功', 1000);
          } else {
            $that.raty('score', $that.attr('data-star'));
            MAC.Pop.Msg(100, 20, r.msg, 1000);
          }
        }, function () {
          $that.raty('score', $that.attr('data-star'));
          MAC.Pop.Msg(100, 20, '网络异常', 1000);
        });
      }
    });

  });
}
MAC.Digg.Init = function () {
  $('body').on('click', '.digg_link', function (e) {
    var $that = $(this);
    if ($that.attr("data-id")) {

      MAC.Ajax(maccms.path + '/index.php/ajax/digg.html?mid=' + $that.attr("data-mid") + '&id=' + $that.attr("data-id") + '&type=' + $that.attr("data-type"), 'get', 'json', '', function (r) {
        $that.addClass('disabled');
        if (r.code == 1) {
          if ($that.attr("data-type") == 'up') {
            $that.find('.digg_num').html(r.data.up);
          } else {
            $that.find('.digg_num').html(r.data.down);
          }
        } else {
          MAC.Pop.Msg(100, 20, r.msg, 1000);
        }
      });

    }
  });
}
MAC.Gbook = {
  'Login': 0,
  'Verify': 0,
  'Init': function () {
    $('body').on('keyup', '.gbook_content', function (e) {
      MAC.Remaining($(this), 200, '.gbook_remaining')
    });
    $('body').on('click', '.gbook_submit', function (e) {
      MAC.Gbook.Submit();
    });
  },
  'Show': function ($page) {
    MAC.Ajax(maccms.path + '/index.php/gbook/index?page=' + $page, 'post', 'json', '', function (r) {
      $(".mac_gbook_box").html(r);
    }, function () {
      $(".mac_gbook_box").html('留言加载失败，请刷新...');
    });
  },
  'Submit': function () {
    if ($(".gbook_content").val() == '') {
      MAC.Pop.Msg(100, 20, '请输入您的留言!', 1000);
      return false;
    }
    MAC.Ajax(maccms.path + '/index.php/gbook/saveData', 'post', 'json', $('.gbook_form').serialize(), function (r) {
      MAC.Pop.Msg(100, 20, r.msg, 1000);
      if (r.code == 1) {
        location.reload();
      } else {
        if (MAC.Gbook.Verify == 1) {
          MAC.Verify.Refresh();
        }
      }
    });
  },
  'Report': function (name, id) {
    MAC.Pop.Show(400, 300, '数据报错', maccms.path + '/index.php/gbook/report.html?id=' + id + '&name=' + encodeURIComponent(name), function (r) {

    });
  }
}
$(document).ready(function () {
  zanpian.image.swiper(); //幻灯片					   
  zanpian.cms.all(); //主要加载
  zanpian.cms.tab(); //切换
  zanpian.cms.scrolltop();
  zanpian.image.lazyload(); //图片延迟加载
  zanpian.detail.collapse();
  zanpian.detail.playlist(); //更多剧集
  if ($(".qrcode").length > 0) {
    $(".qrcode").qrcode({
      text: location.href, //设置二维码内容，必须  
      render: "canvas", //设置渲染方式 （有两种方式 table和canvas，默认是canvas）   
      width: 200, //设置宽度    
      height: 200, //设置高度    
      typeNumber: -1, //计算模式    
      correctLevel: 0, //纠错等级    
      background: "#ffffff", //背景颜色    
      foreground: "#000000" //前景颜色   
    });
  }
  $(".top-tab").click(function () {
    if (!$(this).hasClass("active")) {
      $(this).addClass("active").siblings().removeClass("active");
      $($(this).attr("to")).siblings().removeClass("in active");
      $($(this).attr("to")).addClass("in active").find(".loading").lazyload();
    }
  });
});
