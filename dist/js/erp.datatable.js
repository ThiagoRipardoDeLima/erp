class ErpTables {

	constructor() {
		this.configExtensions();
		this.setupFilterLabel();
		$(document).on('click', '.buttons-html5, .buttons-columnVisibility, [data-widget="pushmenu"]', function () { $('.dataTable').DataTable().rows().invalidate(); });
	}

	configExtensions() {
		var $me = this;

		$.fn.extend({
			configDatatable: function ($custom = {}) {
				$(this).DataTable($me.getConfig($custom));
			},
			getErpTablesApi: function () {
				return $me;
			},
			getColumns: function () {
				var $map = ($return, $element) => {
					if ($($element).data('width')) $return.width = $($element).data('width');
					if ($($element).data('type')) $return.type = $($element).data('type');
					if ($($element).hasClass('hidden')) $return.visible = false;

					return $return;
				}

				var $columns = $.map($('#' + $(this).attr('id') + ' th[data-name]'), function ($element, $index) {
					var $return = { data: $($element).data('name'), name: $($element).data('name') };
					if ($($element).data('classname')) $return.className = $($element).data('classname');
					if ($index == 0) $return.responsivePriority = 0;
					return $map($return, $element);
				});

				var $buttons = $.map($('#' + $(this).attr('id') + ' th[data-button]'), function ($element) {
					var $return = { data: 'id', orderable: false, type: $($element).data('button'), className: 'text-center', responsivePriority: 1 };
					if ($($element).data('classname')) $return.className = 'text-center ' + $($element).data('classname');
					return $map($return, $element);
				});

				return $.merge($columns, $buttons);
			},
			getDataFromDom: function () {
				var $row = $(this).getRowFromDom();
				return $row ? $row.data() : null;
			},
			getDataKey: function () {
				var $tr = $(this).getTrFromDom();
				return $tr ? $tr.data('key') : null;
			},
			getColumnFromDom: function () {
				var $table = $(this).closest('.dataTable');
				if ($table.length == 0) return null;

				return $table.DataTable().column($(this));
			},
			getRowFromDom: function () {
				var $table = $(this).closest('.dataTable');
				if ($table.length == 0) return null;

				var $row = $table.DataTable().row('[data-key="' + $(this).getDataKey() + '"]');
				return $row.length ? $row : $table.DataTable().row($(this).getTrFromDom());
			},
			getTrFromDom() {
				if (!$(this)) return null;
				var $tr = $(this).closest('tr');
				if (!$tr) return null;

				if ($($tr).hasClass('child')) {
					$tr = $($tr).prev();
				}

				return $tr;
			},
			refreshDataTable: function () {
				$(this).DataTable().ajax.reload(null, false);
			},
			reloadDataTable: function () {
				$(this).DataTable().ajax.reload();
			}
		});

		$.extend($.fn.dataTableExt.oSort, {
			"num-fmt": function ($a, $b) {
				var $val1 = parseFloat(($a ? $a.replace(",", ".") : '0'))
				var $val2 = parseFloat(($b ? $b.replace(",", ".") : '0'))
				return (($val1 < $val2) ? 1 : (($val1 > $val2) ? -1 : 0));
			}
		});
	}

	customizeExcel($xlsx) {
		var $sheet = $xlsx.xl.worksheets['sheet1.xml'];
		var $table = $('.dataTable').DataTable();
		var $columns = $table.settings()[0]['aoColumns'];
		var $sheetColumns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
			'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI'];

		$.each($columns, function ($index, $column) {
			if ($column['sType'] == 'num-fmt') {
				$('row c[r^="' + $sheetColumns[$index] + '"]:not([r="' +
					$sheetColumns[$index] + '1"],[r="' +
					$sheetColumns[$index] + '2"],[r="' +
					$sheetColumns[$index] + '3"])', $sheet).attr('s', '64');
			}
		});

		$(this).getErpTablesApi().fixHeaderExcel($xlsx);
		$(this).getErpTablesApi().fixFooterExcelNumberFormat($xlsx);
	}

	customizePdf($doc) {
		var $table = $('.dataTable').DataTable();
		var $columns = $table.settings()[0]['aoColumns'];
		var $visibleColumns = $table.columns(':visible')[0];
		var $rows = $.map($doc.content, function ($content) { return $content.table ? $content.table.body : null; });

		$.each($rows, function ($rowIdx, $row) {
			$.each($row, function ($colIdx, $cel) {
				var $column = $columns[$visibleColumns[$colIdx]];
				if ($cel) {
					if (($cel['style'] != 'tableHeader') && ($column['sType'] == 'num-fmt')) {
						$cel['alignment'] = 'right';
					}
				}
			});
		});
	}

	renderBoolean($data, $type, $row, $meta) {
		return $data == 1 ? 'SIM' : 'NÃO';
	}

	renderDate($data, $type, $row, $meta) {
		return $(this).getErpTablesApi().getDate($data);
	}

	renderDateTime($data, $type, $row, $meta) {
		return $(this).getErpTablesApi().getDate($data, { hour: true, minute: true });
	}

	renderDecimal($data, $type, $row, $meta) {
		$data = (!$data ? '0' : $data.toString());
		return ($type == 'export' ? $data.replace(",", ".") : parseFloat($data.replace(",", ".")).toLocaleString('pt-br', { minimumFractionDigits: 2 }));
	}

	renderFooter() {
		var $api = this.api();
		var $columns = $api.settings()[0]['aoColumns'];

		$.each($columns, function ($index, $column) {
			var $total = 0.0;
			if ($column['className'] && ~$column['className'].indexOf('erp-footer')) {
				var $total = $api.column($index)
					.data()
					.reduce(function ($total, $val) {
						if ($($val).is('input')) {
							$val = $($val).val();
						} else if ($($val).is('div')) {
							$val = $($val).find('.erp-footer').val();
						}

						return $total + parseFloat(($val ? $val.replace(",", ".") : '0'));
					}, 0);

				if (($column['sType'] == 'num-fmt') || ($column['type'] == 'num-fmt')) {
					$($api.column($index).footer()).html($total.toLocaleString('pt-br', { minimumFractionDigits: 2 }));
				} else {
					$($api.column($index).footer()).html($total);
				}
			}
		});
	}

	renderMessageTop() {
		return $('.modal-header small').text();
	}

	renderMonthName($data, $type, $row, $meta) {
		var $months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
		var $index = parseInt(!Number.isNaN($data) ? $data : '1') - 1;
		return $months[$index];
	}

	renderBtnUpdate($data, $type, $row, $meta) {
		return '<a href="#"><i class="fa fa-pen-square text-primary"></i></a>';
	}

	renderBtnView($data, $type, $row, $meta) {
		return '<a href="#"><i class="fa fa-search text-primary"></i></a>';
	}

	renderBtnDelete($data, $type, $row, $meta) {
		return '<a href="#"><i class="fa fa-times text-danger"></i></a>';
	}

	renderBtnCheck($data, $type, $row, $meta) {
		return '<input type="checkbox"/>';
	}

	fixFooterExcelNumberFormat($xlsx) {
		var $sheet = $xlsx.xl.worksheets['sheet1.xml'];
		var $styles = $xlsx.xl['styles.xml'];
		var $cellXfs = '<xf numFmtId="4" fontId="2" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyNumberFormat="1"/>';
		var $new = $styles.childNodes[0].childNodes[5].childNodes.length;

		$styles.childNodes[0].childNodes[5].innerHTML += $cellXfs;

		var $footerColumns = $('row:last c', $sheet);

		$.each($footerColumns, function ($index, $column) {
			$($column).removeAttr('t');
			$($column).attr('s', $new);

			if ($($column).find('t').length) {
				$($column).html('<v>' + $($column).find('t').text().replace('.', '').replace(',', '.') + '</v>');
			}

		});
	}

	fixHeaderExcel($xlsx) {
		var $sheet = $xlsx.xl.worksheets['sheet1.xml'];
		var $styles = $xlsx.xl['styles.xml'];
		var $cellXfs = '<xf numFmtId="0" fontId="2" fillId="0" borderId="0" applyFont="1" applyFill="1" applyBorder="1" xfId="0" applyAlignment="1"><alignment horizontal="center"/></xf>';
		var $index = $styles.childNodes[0].childNodes[5].childNodes.length;

		$styles.childNodes[0].childNodes[5].innerHTML += $cellXfs;

		$('row c[r="A1"]', $sheet).attr('s', $index);
	}

	generateRowid($row, $data) {
		$($row).attr('data-key', $data.id);
	}

	getConfig($custom) {
		var $config = this.getDefaultConfig();
		var $me = this;

		for (var $property in $custom) {
			if ($custom[$property] !== null) $config[$property] = $custom[$property];

			if ($property == 'columns') {
				for (var $column in $config[$property]) {

					switch ($config[$property][$column]['type']) {
						case 'bool':
							$config[$property][$column]['className'] = $.trim(($config[$property][$column]['className'] ? $config[$property][$column]['className'] : '') + ' text-center');
							$config[$property][$column]['render'] = $me.renderBoolean;
							break;

						case 'date':
							$config[$property][$column]['render'] = $me.renderDate;
							break;

						case 'date-time':
							$config[$property][$column]['render'] = $me.renderDateTime;
							break;

						case 'delete':
							$config[$property][$column]['render'] = $me.renderBtnDelete;
							break;

						case 'month':
							$config[$property][$column]['render'] = $me.renderMonthName;
							break;

						case 'num-fmt':
							$config[$property][$column]['render'] = $me.renderDecimal;
							break;

						case 'string':
							$config[$property][$column]['className'] = ($config[$property][$column]['className'] ?
								$config[$property][$column]['className'] + ' ' :
								'') + 'text-left';
							break;

						case 'update':
							$config[$property][$column]['render'] = $me.renderBtnUpdate;
							break;

						case 'view':
							$config[$property][$column]['render'] = $me.renderBtnView;
							break;

						case 'check':
							$config[$property][$column]['render'] = $me.renderBtnCheck;
							break;
					}

					if ($.inArray($config[$property][$column]['type'], ['date', 'num', 'num-fmt']) >= 0) {
						$config[$property][$column]['className'] = ($config[$property][$column]['className'] ?
							$config[$property][$column]['className'] + ' ' :
							'') + 'text-right';
					}

				}
			}
		}

		return $config;
	}

	getDate($data, $options) {
		if (!$data) return '';
		if ($data.length <= 10) $data += ' 00:00:00';

		var $date = new Date($data.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
		var $day = $date.getDate().toString().padStart(2, '0');
		var $month = ($date.getMonth() + 1).toString().padStart(2, '0');
		var $year = $date.getFullYear();
		var $hour = $date.getHours().toString().padStart(2, '0');
		var $minute = $date.getMinutes().toString().padStart(2, '0');
		var $second = $date.getSeconds().toString().padStart(2, '0');

		return $day + "/" + $month + "/" + $year
			+ ($options?.hour ? ' ' + $hour : '')
			+ ($options?.minute ? ':' + $minute : '')
			+ ($options?.second ? ':' + $second : '');
	}

	getDefaultConfig() {
		var $me = this;
		return {
			"dom": 'Btip',
			"autoWidth": false,
			"fixedHeader": true,
			"responsive": true,
			"retrieve": true,
			"order": [0],
			"ordering": false,
			"select": true,
			"processing": true,
			"paging": true,
			"serverSide": false,
			"pagingType": "simple_numbers",
			"pageLength": 10,
			"footerCallback": $me.renderFooter,
			"buttons": [
				{ extend: 'pdf', text: 'Imprimir (PDF)', exportOptions: { columns: ':visible' }, orientation: 'landscape', footer: true, customize: $me.customizePdf, messageTop: $me.renderMessageTop },
				{ extend: 'excel', text: 'Exportar (XLSX)', exportOptions: { orthogonal: 'export' }, autoFilter: true, footer: true, customize: $me.customizeExcel, messageTop: $me.renderMessageTop },
				{ extend: 'copy', text: 'Copiar' },
				{ extend: 'colvis', text: '<i class="fas fa-eye"></i>' }
			],
			"language": {
				"sEmptyTable": "Nenhum registro encontrado",
				"sInfo": "Exibindo [_START_..._END_] de _TOTAL_ registros",
				"sInfoEmpty": "Exibindo [0...0] de 0 registros",
				"sInfoFiltered": "(Filtrados de _MAX_ registros)",
				"sInfoPostFix": "",
				"sInfoThousands": ".",
				"sLengthMenu": "_MENU_ resultados por página",
				"sLoadingRecords": "Carregando...",
				"sProcessing": "Processando...",
				"sZeroRecords": "Nenhum registro encontrado",
				"sSearch": "Pesquisar",
				"oPaginate": {
					"sNext": ">",
					"sPrevious": "<",
					"sFirst": "<<",
					"sLast": ">>"
				},
				"oAria": {
					"sSortAscending": ": Ordenar colunas de forma ascendente",
					"sSortDescending": ": Ordenar colunas de forma descendente"
				},
				"buttons": {
					"copyTitle": "Copiar para Área de Transferência",
					"copyKeys": "Utilize <i>ctrl</i> ou <i>\u2318</i> + <i>C</i> para copiar. <br><br>Para cancelar, aperte <i>esc</i>.",
					"copySuccess": {
						"_": "%d linhas copiadas",
						"1": "1 linha copiada"
					}
				}
			},
			"createdRow": $me.generateRowid
		};
	}

	setupFilterLabel() {
		$(document).on('submit', 'form', function () {
			if (!$('[name=_label]') || !$('[name=_label]').length) return;

			var $text = '';
			$('.form-control').each(function () {
				if ($text && $(this).val()) $text += ' | ';
				if ($(this).val()) {
					$text += $(this).prev('label').text() + ': ';

					if ($(this).is('select')) {
						$text += $(this).find('option:selected').html()
					} else if ($(this).is('input[type=date]')) {
						$text += $(this).getSescTablesApi().getDate($(this).val())
					} else {
						$text += $(this).val();
					}
				}
			});
			$('[name=_label]').val($text);
		});
	}
}

var $ = jQuery;
var $tables = new ErpTables();
