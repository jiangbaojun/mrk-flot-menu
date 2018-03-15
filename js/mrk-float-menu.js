/* -----------------------------------------------
/* Author : jiangbaojun
/* Demo
/* GitHub : https://github.com/jiangbaojun/mrk-flot-menu.git
/* How to use? : Check the GitHub README
/* v1.1
/* ----------------------------------------------- */


/**
 * 浮动展开菜单
 * 数据说明：
 *      1、采用扁平树数据
 *      2、字段说明，iconSrc和iconClass，优先使用iconSrc，可同时为空（没有图标）
 *          id:             菜单节点id,
 *          parentId:       当前节点父级节点id,
 *          title:          菜单标题文本,
 *          iconSrc:        菜单文本前面的图片,
 *          iconClass:      菜单文本前面的font-awesome字体class，如用户图标fa-user,
 *          url:            菜单对应的页面地址,
 *          orderNum:       同级别的排序数字，1开始，越大越靠后
 *  使用说明：
 *     格式： $(selector).mrkMenu(options);
 *     参数说明：
 *          1、selector 选择器，生成菜单的外层容器
 *          2、options：
 *                  menuData：       菜单数据，默认[]
 *                  menuRootId：     菜单根节点id，控件根据该id，生成所有子节点的菜单,默认""
 *                  searchResultToTree：每次过滤搜索，是否以树形展示过滤结果，默认false
 *                  onClickMenu:	事件，点击菜单节点时的回调函数。
 *                                          function(data)，data为回调函数参数，object，字段如下：
 *                                              direct:     是否是最底层节点（没有子菜单，直接的菜单项）
 *                                              level:      当前点击的菜单级别，从1开始
 *                                              data:       点击的菜单节点数据
 *                                              e:e         原始event对象
 *                                              
 *  暴露方法：
 *  	search：过滤搜索菜单，并重新渲染
 *  		用法：$(selector).mrkMenu("search",searchText)
 *
 *
 * @author jiangbaojun
 * @version V1.1
 */
(function ($) {
    /**
     * jQuery扩展控件方法
     * @param options   自定义配置选项
     * @param params    暴露方法参数
     */
    $.fn.mrkMenu = function (options, params) {
    	//扩展方法
        if (typeof options == "string") {
            var method = $.fn.mrkMenu.methods[options];
            if (method) return method(this, params);
        }
    	//扩展默认配置选项数据
    	extendDefault(options);
        //初始化控件
        init(this, params);
    };
    /**
     * 控件暴露方法
     */
    $.fn.mrkMenu.methods = {
        /**
         * 根据过滤条件,刷新菜单
         * @param target    target
         * @param text      过滤文本
         */
		"search": function(target, text){
			activeOptions.searchText = text;
			//根据搜索条件过滤菜单数据
	        activeOptions = filterMenuData(activeOptions);
			init(target, text);
		}
	};
    /**
     * 控件默认配置选项
     */
    $.fn.mrkMenu.defaultOptions = {
        menuData: [],
        menuRootId: "",
        searchResultToTree: false,
        onClickMenu: function(target){}
    };
    var activeOptions = $.fn.mrkMenu.defaultOptions;
    
    /**
     * 扩展默认配置选项数据
     * @param options   初始化配置选项，用于替换控件默认配置选项
     */
    function extendDefault(options){
    	//不可自定义默认配置
    	var innerDefaultOptions = {
			menuStartIndex: 1,
			searchText: "",
			originData: options.menuData,
            originMenuRootId: options.menuRootId,
			searchPid: "search-root"
    	};
        //扩展自定义配置
        var opts = $.extend({}, $.fn.mrkMenu.defaultOptions);
        activeOptions = $.extend(true, opts, options, innerDefaultOptions);
    }
    /**
     * 初始化浮动展开菜单
     * @param target    目标菜单容器
     * @param params    暴露方法参数
     */
    function init(target, params){
        //清除旧的菜单内容
        target.html("");
        createMenus(target,activeOptions.menuRootId,activeOptions.menuStartIndex);
    }
    
    /**
     * 根据搜索条件过滤菜单数据
     * @param activeOptions  控件输入参数
     */
    function filterMenuData(activeOptions){
    	var searchText = activeOptions.searchText;
    	var menuData = activeOptions.originData;
    	var filterData = [];
    	if(searchText==null || searchText==undefined || searchText==""){
            activeOptions.menuData = activeOptions.originData;
            activeOptions.menuRootId = activeOptions.originMenuRootId;
    		return activeOptions;
    	}
    	var reg = new RegExp(searchText);
    	//获得所有直接节点数组
    	for(var i=0;i<menuData.length;i++){
    		var item = menuData[i];
    		if(reg.test(item.title) && !hasChildren(menuData,item.id)){
    			if(!activeOptions.searchResultToTree){
    				item.parentId=activeOptions.searchPid;
    			}
    			filterData.push(item);
    		}
    	}
    	if(activeOptions.searchResultToTree){
    		//树形结果展示，需要获得所有父节点
    		activeOptions.menuData = getAllParents(filterData);
    	}else{
    		activeOptions.menuRootId = activeOptions.searchPid;
    		activeOptions.menuData = filterData;
    	}
    	return activeOptions;
    }

    /**
     * 判断当前节点是否有子节点
     * @param menuData  菜单数据
     * @param id  		当前节点id
     */
    function hasChildren(menuData,id){
    	for(var i=0;i<menuData.length;i++){
    		var item = menuData[i];
    		if(item.parentId == id){
    			return true
    		}
    	}
    	return false;
    }
    
    /**
     * 获得给定节点数组的所有父节点
     * @param filterData  给定节点数组
     */
    function getAllParents(filterData){
    	var resultArr = filterData;
    	var noRepeatPids = [];
    	for(var i=0;i<filterData.length;i++){
    		var item = filterData[i];
    		//filterData内相同父节点的节点，获得一次就可以
    		if(!containItem(noRepeatPids, item.parentId)){
    			noRepeatPids.push(item.parentId);
    			var parentNodes = getParents(item,[]);
    			//去除重复节点
    			for(var k=0;k<parentNodes.length;k++){
    				if(!containNode(resultArr, parentNodes[k])){
    					resultArr.push(parentNodes[k]);
    				}
    			}
    		}
    	}
    	return resultArr;
    }
    
    /**
     * 数组包含判断
     */
    function containItem(ids, id){
    	for(var i=0;i<ids.length;i++){
    		if(ids[i] == id){
    			return true;
    		}
    	}
    	return false;
    }
    
    /**
     * 节点包含判断
     */
    function containNode(arr, item){
    	for(var i=0;i<arr.length;i++){
    		if(arr[i].id == item.id){
    			return true;
    		}
    	}
    	return false;
    }
    
    /**
     * 获得给定节点的所有父节点,不包含当前节点
     * @param item  给定节点
     * @param result  累加结果数据
     */
    function getParents(item,result){
    	var menuData = activeOptions.originData;
    	var parentNode = null;
    	for(var i=0;i<menuData.length;i++){
    		var temp = menuData[i];
    		if(temp.id == item.parentId){
    			parentNode= temp;
    			break;
    		}
    	}
    	if(parentNode != null){
    		result.push(parentNode);
    		getParents(parentNode,result);
    	}
    	return result;
    }
    
    /* 创建菜单dom元素
    * @param target     菜单根节点jquery对象
    * @param id         菜单数据根节点id值
    * @param j          用于class名称，表示每级菜单的level。该参数定义初始级别，然后累加
    * @user: jiangbaojun
    */
    function createMenus(target, id, j){
        var self = this;
        if(target===undefined||target==null){
            return;
        }
        if(j==activeOptions.menuStartIndex){
            target = $('<ul />').addClass("menu-root").appendTo(target);
            target.addClass('treeview-level-'+j++);
            target.html("");
            target.append('<li class="header">主菜单</li>');
        }
        var data=activeOptions.menuData;
        var rootMenu = $.grep(data, function (n) {
            if (n.parentId == id)
                return true;
        });
        if(!rootMenu.length) return;
        //sort(排序)
        rootMenu.sort(function (a, b) {
            return a.orderNum - b.orderNum;
        });
        //add menu node（插入同级菜单节点）
        $.each(rootMenu, function () {
            var that = this;
            var li = $('<li />').addClass("treeview").appendTo(target);
            var li_a = $('<a/>').attr({"href": this.url || "#", "menuId": this.id})
                .addClass(this.url === '' ? '' : 'menu-item')
                .appendTo(li);
            // 菜单前的图标优先使用图片
            if(this.iconSrc){
                $("<img/>").attr("src",this.iconSrc).addClass("menu-icon").appendTo(li_a);
            }else if(this.iconClass){
                $('<i/>').addClass("fa "+this.iconClass || "").appendTo(li_a);
            }else{
                li_a.addClass("no-icon");
            }
            // title
            $('<span class="menu-text" />').text(this.title).appendTo(li_a);

            var childrenUL = $('<ul class="treeview-menu" />');
            createMenus(childrenUL, that.id, j+1);
            if(childrenUL.children().length){
                childrenUL.addClass('treeview-level-'+j);
                childrenUL.appendTo(li);
                li_a.attr('href','javascript:void(0)');
                li_a.removeClass('menu-item');
                //arrows
                $('<span class="arrow fold"></span>').appendTo(li_a);
                //菜单选项添加事件
                li.on('click', function (e) {
                    activeOptions.onClickMenu.call(li, {direct:false, level:j-1, data:that, e:e});
                    e.preventDefault();
                    e.stopPropagation();
                });
            }else{
                li.addClass("direct-menu");
                //菜单选项添加事件
                li.on('click', function (e) {
                    activeOptions.onClickMenu.call(li, {direct:true, level:j-1, data:that, e:e});
                    e.preventDefault();
                    e.stopPropagation();
                });
            }
            //为所有级别菜单li添加hover事件
            li.hover(function(){
                    $(this).addClass("on");
                    $(this).parent("ul").siblings("a").addClass("selected");
                    //判断页面高度能否完全显示下级菜单
                    var ul =  $(this).find(">ul");
                    if(ul.length){
                        ul.addClass("top").removeClass("bottom");
                        var clientWidth = getViewPort().width;
                        var clientHeight = getViewPort().height;
                        var ulX =  ul.offset().left;
                        var ulY =  ul.offset().top;
                        var scrollTop = $(document).scrollTop();
                        var scrollLeft = $(document).scrollLeft();
                        var childNum = $(this).find(">ul>li").length;
                        if(childNum && childNum>0){
                            //子菜单高度
                            var childHeight = ul.outerHeight();
                            //顶部超出高度
                            var outofTop = (ulY-scrollTop+childHeight) - clientHeight;
                            //底部超出高度
                            var outofBottom = 0-(ulY-childHeight);
                            //优先顶部显示(如果顶部可以显示完全，就顶部显示)
                            if(outofTop<=0){
                                ul.addClass("top").removeClass("bottom");
                            }else{
                                //底部可以显示完全
                                if(outofBottom<=0){
                                    ul.removeClass("top").addClass("bottom");
                                }else{
                                    //都显示不全，选择显示最多的
                                    if(outofTop>outofBottom){
                                        ul.removeClass("top").addClass("bottom");
                                    }else{
                                        ul.addClass("top").removeClass("bottom");
                                    }
                                }
                            }
                        }
                    }
                },
                function(){
                    $(this).removeClass("on");
                    $(this).find("ul").removeClass("top").removeClass("bottom");
                    $(this).parent("ul").siblings("a").removeClass("selected");
            });
        });
    }
    /**
     * 获得页面可见高度
     * @returns {{width: *, height: *}}
     */
    function getViewPort() {
        var e = window,
            a = 'inner';
        if (!('innerWidth' in window)) {
            a = 'client';
            e = document.documentElement || document.body;
        }

        return {
            width: e[a + 'Width'],
            height: e[a + 'Height']
        };
    }
})(jQuery);
