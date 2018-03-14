# mrk-flot-menu
 /**
 * 鼠标滑过，逐级浮动展开菜单
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