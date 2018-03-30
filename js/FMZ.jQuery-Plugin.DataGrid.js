/*
 * 说明：此文件用于创建基本的数据表格
 * 创建日期：2018-3-26
 */
(function() {
	$.fn.extend({
		createFuDataGrid: function(option) {
			if(typeof option.header == "undefined" || option.header.length == 0) {
				return;
			}
			FMZ_DataGrid.optionArray.push(option);
			var tableIndex = FMZ_DataGrid.optionArray.length - 1;
			FMZ_DataGrid.clickFunctionObject[tableIndex] = [];
			var table = document.createElement('table');
			table.className = "fu-dataGrid";
			table.setAttribute('data-index', tableIndex);
			var html, clickable, widthHtml;
			var thead = document.createElement('thead');
			var thead_tr = document.createElement('tr');
			var columnNum = option.header.length;
			if(option.includeOrderNumber && option.includeOrderNumber == true) {
				html = '<td class="orderNumber">序号</td>';
				columnNum++;
			}
			for(var i = 0; i < option.header.length; i++) {
				if(option.header[i].clickable && option.header[i].clickable == true) {
					clickable = "clickable='true'";
					if(option.header[i].clickFunction) {
						FMZ_DataGrid.clickFunctionObject[tableIndex][option.header[i].fieldName] = option.header[i].clickFunction;
					}
					else {
						FMZ_DataGrid.clickFunctionObject[tableIndex][option.header[i].fieldName] = function(){};
					}
				}
				else {
					clickable = "";
				}
				if(option.header[i].width) {
					widthHtml = "style='width: " + option.header[i].width + ";'";
				}
				else {
					widthHtml = "";
				}
				html += '<td fieldname="' + option.header[i].fieldName + '"' + clickable + widthHtml + '>' + option.header[i].label + '</td>';
			}
			if(option.operation && option.operation.data.length > 0) {
				if(option.operation.width) {
					widthHtml = "style='width: " + option.operation.width + ";'";
				}
				else {
					widthHtml = "";
				}
				html += '<td class="opration" ' + widthHtml + '>操作</td>';
				columnNum++;
				for(var i = 0; i < option.operation.data.length; i++) {
					if(option.operation.data[i].clickFunction) {
						FMZ_DataGrid.clickFunctionObject[tableIndex][option.operation.data[i].label] = option.operation.data[i].clickFunction;
					}
					else {
						FMZ_DataGrid.clickFunctionObject[tableIndex][option.operation.data[i].label] = function() {};
					}
				}
			}
			thead_tr.innerHTML = html;
			thead.appendChild(thead_tr);
			table.appendChild(thead);
			
			var tbody = document.createElement('tbody');
			var tbody_tr;
			var rowNum = option.rowNum || 10;
			for (var i = 0; i < rowNum; i++) {
				tbody_tr = document.createElement('tr');
				if(option.emptyRow && option.emptyRow == "hide") {
					tbody_tr.className = "hide";
				}
				html = "";
				for (var j = 0; j < columnNum; j++) {
					html += '<td>&nbsp;</td>';
				}
				tbody_tr.innerHTML = html;
				tbody.appendChild(tbody_tr);
			}
			table.appendChild(tbody);
			$(this).append(table);
			
			$(this).createFuPagination();
			
			FMZ_DataGrid.bindClickFunction.call(table);
		},
		
		loadFuDataGridData: function(tableData) {
			if($(this).find('.fu-dataGrid').length == 0) {
				return;
			}
			var $tbody_tr = $(this).find('tbody tr');
			var $thead_td = $(this).find('thead td');
			var dataIndex = parseInt($(this).find('.fu-dataGrid').attr('data-index'));
			var option = FMZ_DataGrid.optionArray[dataIndex];
			var fieldName = "";
			
			if(option.operation && option.operation.data.length > 0) {
				var operationHtml = "";
				for(var i = 0; i < option.operation.data.length; i++) {
					operationHtml += '<a href="#" name="' + option.operation.data[i].label + '">' + option.operation.data[i].label + '</a>';
				}
			}
			
			for(var i = 0; i < $tbody_tr.length; i++) {
				$($tbody_tr[i]).find('td').html('&nbsp;');
				if(!tableData.data[i] && option.emptyRow && option.emptyRow == "hide") {
					$($tbody_tr[i]).addClass('hide');
					continue;
				}
				if(tableData.data[i].ROW_ID) {
					$($tbody_tr[i]).attr('row_id', tableData.data[i].ROW_ID);
				}
				else {
					$($tbody_tr[i]).removeAttr('row_id');
				}
				$($tbody_tr[i]).removeClass('hide');
				for(var j = 0; j < $thead_td.length; j++) {
					if($($thead_td[j]).hasClass('orderNumber')) {
						$($tbody_tr[i]).find('td')[j].innerHTML = i + 1;
						continue;
					}
					if($($thead_td[j]).hasClass('opration')) {
						$($tbody_tr[i]).find('td')[j].innerHTML = operationHtml;
						continue;
					}
					fieldName = $($thead_td[j]).attr('fieldname');
					if(tableData.data[i][fieldName]) {
						if($($thead_td[j]).attr('clickable') && $($thead_td[j]).attr('clickable') == "true") {
							$($tbody_tr[i]).find('td')[j].innerHTML = '<a href="#">' + tableData.data[i][fieldName] + '</a>';
						}
						else {
							$($tbody_tr[i]).find('td')[j].innerHTML = tableData.data[i][fieldName];
						}
					}
					else {
						$($tbody_tr[i]).find('td')[j].innerHTML = "&nbsp;";
					}
				};
			}
			var totalPage = Math.ceil(tableData.totalNum / $tbody_tr.length);
			$(this).refreshPagination(tableData.totalNum, totalPage, tableData.pageIndex);
		},
		getFuDataGridClickedRowID: function() {
			return FMZ_DataGrid.RowID;
		},
	});
})(jQuery);

var FMZ_DataGrid = {
	optionArray: [],
	clickFunctionObject: {},
	RowID : "",
	bindClickFunction: function() {
		$(this).find('tbody td').click(function(event) {
			var target = event.target || window.event.srcElement;
			if(target.tagName == "A") {
				var $td = $(target).parent();
				var $table = $($td.parents('table')[0]);
				FMZ_DataGrid.RowID = $td.parent().attr("row_id");
				var ColumnNum = $td.index();
				var fieldName = $table.find('thead td').eq(ColumnNum).attr('fieldname');
				var tableIndex = $table.attr('data-index');
				if(typeof fieldName != "undefined") {
					FMZ_DataGrid.clickFunctionObject[tableIndex][fieldName]();
				}
				else {
					if($table.find('thead td').eq(ColumnNum).hasClass('opration')) {
						var label = target.innerHTML;
						FMZ_DataGrid.clickFunctionObject[tableIndex][label]();
					}
				}
			}
			else if(target.tagName == "TD") {
				FMZ_DataGrid.RowID = $(target).parent().attr("row_id");
			}
		});
	},
};

(function() {
	$.fn.extend({
		createFuPagination: function() {
			var container = document.createElement('div');
			container.className = "fu-pagination";
			container.innerHTML = '共记录：<span class="totalNum">0</span>' +
								  '<div class="buttonContainer">' +
								  	'<button class="flipButton" name="prev">上一页</button>' +
								  	'<span class="pageButtonContainer">' +
								  		'<button class="pageButton selected" num="1">1</button>' +
								  	'</span>' +
								  	'<button class="flipButton" name="next">下一页</button>' +
								  '</div>';
			$(this).append(container);
		},
		refreshPagination: function(totalNum, totalPage, pageIndex) {
			$(this).find('.fu-pagination').find('.totalNum').text(totalNum);
			$(this).find('.fu-pagination').attr('totalpage', totalPage);
			
			if(pageIndex <= 0) {
				pageIndex = 1;
			}
			else if(pageIndex > totalPage) {
				pageIndex = totalPage;
			}
			var currentButtonNum = $(this).find('.fu-pagination').find('.pageButton').length;
			var buttonNum = totalPage >= 5 ? 5 : totalPage;
			
			if(currentButtonNum == buttonNum) {
				if($(this).find('.fu-pagination').find('.pageButton[num="' + pageIndex + '"]').length > 0) {
					$(this).find('.fu-pagination').find('.pageButton').removeClass('selected');
					$(this).find('.fu-pagination').find('.pageButton[num="' + pageIndex + '"]').addClass('selected');
					return;
				}
			}
			else {
				var buttonHtml = "";
				for (var i = 0; i < buttonNum; i++) {
					buttonHtml += '<button class="pageButton">&nbsp;</button>';
				}
				$(this).find('.fu-pagination').find('.pageButtonContainer').html(buttonHtml);
			}
			
			var $pageButton = $(this).find('.fu-pagination').find('.pageButton');
			if(totalPage <= 5 || pageIndex <= 5) {
				$pageButton.removeClass('selected');
				for (var i = 1; i <= totalPage; i++) {
					$pageButton[i - 1].innerHTML = i;
					$pageButton[i - 1].setAttribute('num', i);
					if(i == pageIndex) {
						$pageButton[i - 1].classList.add('selected');
					}
				}
			}
			else {
				$pageButton.removeClass('selected');
				var buttonIndex = 0;
				if(totalPage - pageIndex <= 4) {
					for (var i = totalPage - 4; i <= totalPage; i++) {
						$pageButton[buttonIndex].innerHTML = i;
						$pageButton[buttonIndex].setAttribute('num', i);
						if(i == pageIndex) {
							$pageButton[buttonIndex].classList.add('selected');
						}
						buttonIndex++;
					}
				}
				else {
					for (var i = (pageIndex + 1 - pageIndex % 5); i <= (pageIndex + 5 - pageIndex % 5); i++) {
						$pageButton[buttonIndex].innerHTML = i;
						$pageButton[buttonIndex].setAttribute('num', i);
						if(i == pageIndex) {
							$pageButton[buttonIndex].classList.add('selected');
						}
						buttonIndex++;
					}
				}
			}
		},
		bindPageClickEvent: function(bindfunction) {
			$(this).find('.buttonContainer').click(function(event) {
				var target = event.target || window.event.srcElement;
				if(target.tagName == "BUTTON") {
					var newPage;
					if($(target).hasClass('pageButton')) {
						newPage = parseInt($(target).attr('num'));
					}
					else if($(target).hasClass('flipButton')) {
						var currentPage = parseInt($(target).siblings('.pageButtonContainer').find('button.selected').attr('num'));
						var totalPage = parseInt($(target).parent().parent().attr('totalpage'));
						if($(target).attr('name') == "prev") {
							newPage = currentPage - 1 > 0 ? currentPage - 1 : 1;
						}
						else {
							newPage = currentPage + 1 <= totalPage ? currentPage + 1 : totalPage;
						}
					}
					bindfunction(newPage);
				}
				
			});
		},
	});
})(jQuery)
