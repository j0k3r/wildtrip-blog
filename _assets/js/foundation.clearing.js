(function(e,l,q,t){Foundation.libs.clearing={name:"clearing",version:"5.5.3",settings:{templates:{viewing:'<a href="#" class="clearing-close">&times;</a><div class="visible-img" style="display: none"><div class="clearing-touch-label"></div><img src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" alt="" /><p class="clearing-caption"></p><a href="#" class="clearing-main-prev"><span></span></a><a href="#" class="clearing-main-next"><span></span></a></div><img class="clearing-preload-next" style="display: none" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" alt="" /><img class="clearing-preload-prev" style="display: none" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D" alt="" />'},
close_selectors:".clearing-close, div.clearing-blackout",open_selectors:"",skip_selector:"",touch_label:"",init:!1,locked:!1},init:function(a,b,c){var d=this;Foundation.inherit(this,"throttle image_loaded");this.bindings(b,c);d.S(this.scope).is("["+this.attr_name()+"]")?this.assemble(d.S("li",this.scope)):d.S("["+this.attr_name()+"]",this.scope).each(function(){d.assemble(d.S("li",this))})},events:function(a){var b=this,c=b.S,d=e(".scroll-container");0<d.length&&(this.scope=d);c(this.scope).off(".clearing").on("click.fndtn.clearing",
"ul["+this.attr_name()+"] li "+this.settings.open_selectors,function(a,d,e){d=d||c(this);e=e||d;var f=d.next("li"),g=d.closest("["+b.attr_name()+"]").data(b.attr_name(!0)+"-init"),k=c(a.target);a.preventDefault();g||(b.init(),d.closest("["+b.attr_name()+"]").data(b.attr_name(!0)+"-init"));e.hasClass("visible")&&d[0]===e[0]&&0<f.length&&b.is_open(d)&&(e=f,k=c("img",e));b.open(k,d,e);b.update_paddles(e)}).on("click.fndtn.clearing",".clearing-main-next",function(a){b.nav(a,"next")}).on("click.fndtn.clearing",
".clearing-main-prev",function(a){b.nav(a,"prev")}).on("click.fndtn.clearing",this.settings.close_selectors,function(b){Foundation.libs.clearing.close(b,this)});e(q).on("keydown.fndtn.clearing",function(a){b.keydown(a)});c(l).off(".clearing").on("resize.fndtn.clearing",function(){b.resize()});this.swipe_events(a)},swipe_events:function(a){var b=this,c=b.S;c(this.scope).on("touchstart.fndtn.clearing",".visible-img",function(b){b.touches||(b=b.originalEvent);var a={start_page_x:b.touches[0].pageX,start_page_y:b.touches[0].pageY,
start_time:(new Date).getTime(),delta_x:0,is_scrolling:t};c(this).data("swipe-transition",a);b.stopPropagation()}).on("touchmove.fndtn.clearing",".visible-img",function(a){a.touches||(a=a.originalEvent);if(!(1<a.touches.length||a.scale&&1!==a.scale)){var d=c(this).data("swipe-transition");"undefined"===typeof d&&(d={});d.delta_x=a.touches[0].pageX-d.start_page_x;Foundation.rtl&&(d.delta_x=-d.delta_x);"undefined"===typeof d.is_scrolling&&(d.is_scrolling=!!(d.is_scrolling||Math.abs(d.delta_x)<Math.abs(a.touches[0].pageY-
d.start_page_y)));if(!d.is_scrolling&&!d.active){a.preventDefault();var e=0>d.delta_x?"next":"prev";d.active=!0;b.nav(a,e)}}}).on("touchend.fndtn.clearing",".visible-img",function(a){c(this).data("swipe-transition",{});a.stopPropagation()})},assemble:function(a){var b=a.parent();if(!b.parent().hasClass("carousel")){b.after('<div id="foundationClearingHolder"></div>');a=b.detach();var c;null!=a[0]&&(c=a[0].outerHTML,a=this.S("#foundationClearingHolder"),b='<div class="clearing-assembled"><div>'+b.data(this.attr_name(!0)+
"-init").templates.viewing+('<div class="carousel">'+c+"</div>")+"</div></div>",c=this.settings.touch_label,Modernizr.touch&&(b=e(b).find(".clearing-touch-label").html(c).end()),a.after(b).remove())}},open:function(a,b,c){function d(){setTimeout(function(){this.image_loaded(m,function(){1!==m.outerWidth()||r?f.call(this,m):d.call(this)}.bind(this))}.bind(this),100)}function f(a){var d=e(a);d.css("visibility","visible");d.trigger("imageVisible");u.css("overflow","hidden");n.addClass("clearing-blackout");
h.addClass("clearing-container");k.show();this.fix_height(c).caption(g.S(".clearing-caption",k),g.S("img",c)).center_and_label(a,l).shift(b,c,function(){c.closest("li").siblings().removeClass("visible");c.closest("li").addClass("visible")});k.trigger("opened.fndtn.clearing")}var g=this,u=e(q.body),n=c.closest(".clearing-assembled"),h=g.S("div",n).first(),k=g.S(".visible-img",h),m=g.S("img",k).not(a),l=g.S(".clearing-touch-label",h),r=!1,p={};e("body").on("touchmove",function(a){a.preventDefault()});
m.error(function(){r=!0});this.locked()||(k.trigger("open.fndtn.clearing"),p=this.load(a),p.interchange?m.attr("data-interchange",p.interchange).foundation("interchange","reflow"):m.attr("src",p.src).attr("data-interchange",""),m.css("visibility","hidden"),d.call(this))},close:function(a,b){a.preventDefault();var c;c=e(b);c=/blackout/.test(c.selector)?c:c.closest(".clearing-blackout");var d=e(q.body),f;b===a.target&&c&&(d.css("overflow",""),d=e("div",c).first(),f=e(".visible-img",d),f.trigger("close.fndtn.clearing"),
this.settings.prev_index=0,e("ul["+this.attr_name()+"]",c).attr("style","").closest(".clearing-blackout").removeClass("clearing-blackout"),d.removeClass("clearing-container"),f.hide(),f.trigger("closed.fndtn.clearing"));e("body").off("touchmove");return!1},is_open:function(a){return 0<a.parent().prop("style").length},keydown:function(a){var b=e(".clearing-blackout ul["+this.attr_name()+"]"),c=this.rtl?39:37;a.which===(this.rtl?37:39)&&this.go(b,"next");a.which===c&&this.go(b,"prev");27===a.which&&
this.S("a.clearing-close").trigger("click.fndtn.clearing")},nav:function(a,b){var c=e("ul["+this.attr_name()+"]",".clearing-blackout");a.preventDefault();this.go(c,b)},resize:function(){var a=e("img",".clearing-blackout .visible-img"),b=e(".clearing-touch-label",".clearing-blackout");a.length&&(this.center_and_label(a,b),a.trigger("resized.fndtn.clearing"))},fix_height:function(a){a=a.parent().children();var b=this;a.each(function(){var a=b.S(this),d=a.find("img");a.height()>d.outerHeight()&&a.addClass("fix-height")}).closest("ul").width(100*
a.length+"%");return this},update_paddles:function(a){a=a.closest("li");var b=a.closest(".carousel").siblings(".visible-img");0<a.next().length?this.S(".clearing-main-next",b).removeClass("disabled"):this.S(".clearing-main-next",b).addClass("disabled");0<a.prev().length?this.S(".clearing-main-prev",b).removeClass("disabled"):this.S(".clearing-main-prev",b).addClass("disabled")},center_and_label:function(a,b){!this.rtl&&0<b.length?b.css({marginLeft:-(b.outerWidth()/2),marginTop:-(a.outerHeight()/2)-
b.outerHeight()-10}):b.css({marginRight:-(b.outerWidth()/2),marginTop:-(a.outerHeight()/2)-b.outerHeight()-10,left:"auto",right:"50%"});return this},load:function(a){var b,c;"A"===a[0].nodeName?(b=a.attr("href"),c=a.data("clearing-interchange")):(c=a.closest("a"),b=c.attr("href"),c=c.data("clearing-interchange"));this.preload(a);return{src:b?b:a.attr("src"),interchange:b?c:a.data("clearing-interchange")}},preload:function(a){this.img(a.closest("li").next(),"next").img(a.closest("li").prev(),"prev")},
img:function(a,b){if(a.length){var c=e(".clearing-preload-"+b),d=this.S("a",a),f;d.length?f=d.attr("href"):(d=this.S("img",a),f=d.attr("src"));(d=d.data("clearing-interchange"))?c.attr("data-interchange",d):(c.attr("src",f),c.attr("data-interchange",""))}return this},caption:function(a,b){var c=b.attr("data-caption");c?(a.get(0).innerHTML=c,a.show()):a.text("").hide();return this},go:function(a,b){var c=this.S(".visible",a),d=c[b]();this.settings.skip_selector&&0!=d.find(this.settings.skip_selector).length&&
(d=d[b]());d.length&&this.S("img",d).trigger("click.fndtn.clearing",[c,d]).trigger("change.fndtn.clearing")},shift:function(a,b,c){var d=b.parent(),e=this.settings.prev_index||b.index(),g=this.direction(d,a,b);a=this.rtl?"right":"left";var l=parseInt(d.css("left"),10),n=b.outerWidth(),h={};b.index()===e||/skip/.test(g)?/skip/.test(g)&&(b=b.index()-this.settings.up_count,this.lock(),h[a]=0<b?-(b*n):0,d.animate(h,300,this.unlock())):/left/.test(g)?(this.lock(),h[a]=l+n,d.animate(h,300,this.unlock())):
/right/.test(g)&&(this.lock(),h[a]=l-n,d.animate(h,300,this.unlock()));c()},direction:function(a,b,c){a=this.S("li",a);b=a.outerWidth()+a.outerWidth()/4;b=Math.floor(this.S(".clearing-container").outerWidth()/b)-1;c=a.index(c);this.settings.up_count=b;a=this.adjacent(this.settings.prev_index,c)?c>b&&c>this.settings.prev_index?"right":c>b-1&&c<=this.settings.prev_index?"left":!1:"skip";this.settings.prev_index=c;return a},adjacent:function(a,b){for(var c=b+1;c>=b-1;c--)if(c===a)return!0;return!1},
lock:function(){this.settings.locked=!0},unlock:function(){this.settings.locked=!1},locked:function(){return this.settings.locked},off:function(){this.S(this.scope).off(".fndtn.clearing");this.S(l).off(".fndtn.clearing")},reflow:function(){this.init()}}})(jQuery,window,window.document);