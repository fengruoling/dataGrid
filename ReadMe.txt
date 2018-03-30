运行环境说明：
需引入jQuery

数据列表参数说明：

1.表格构建参数
var option = {
	header: [	//表头字段
		{
			label: "",							//表头列名称
			fieldName: "",						//表头列字段名称
			width: "",							//列宽度，非必填，不填时列宽度均分，值域可填px值，可填百分比
			clickable: true|false,				//列是否可点击，默认值为false
			clickFunction: function				//列可点击时，定义点击事件
		},
	],
	rowNum: number,								//表格行数，默认值为10
	includeOrderNumber: true|false,				//是否包含序号列，默认值为false
	operation: {								//定义操作列
		width: "",								//操作列宽度，不填时默认均分
		data: [									//定义操作列里的操作按钮
			{
				label: "",						//操作按钮标签名称
				clickFunction: function			//操作按钮点击时执行的事件
			},
		]
	},
	emptyRow: "show|hide"						//设置表格行为空时是否隐藏，值为hide时，空行隐藏
};

2.表格数据加载参数
var tableData = {
	data: [										//要加载的表格数据
		{
			ROW_ID: "",							//该条数据的主键值
			字段名称：字段值,					//字段名-字段值，字段名与表头定义的字段名称相对应
		},
	],
	totalNum: number,							//总记录数
	pageIndex: number,							//当前数据所在页数
};

数据列表函数调用说明：
$(dom).createFuDataGrid(option);				//在dom结构内按照option设置的参数创建一个空的数据列表

$(dom).loadFuDataGridData(tableData);			//在dom结构内加载tableData里的数据值（需先创建数据列表）

$(dom).getFuDataGridClickedRowID();				//获取数据列表中被点击的表格行的主键ID

$(dom).bindPageClickEvent(function(page){});	//绑定页码的点击事件,需传参page，page值由插件内部进行赋值
