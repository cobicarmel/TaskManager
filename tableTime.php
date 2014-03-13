<div id="table-time">
	<div id="tt-head" class="ui-widget-header ui-corner-all">
		<div id="tt-head-prev" class="ui-corner-all ui-datepicker-prev" title="<?=$LOCAL[12]?>">
			<span class="ui-icon ui-icon-circle-triangle-e"></span>
		</div>
		<div id="tt-head-title" class="tahoma"></div>
		<div id="tt-head-next" class="ui-corner-all ui-datepicker-next" title="<?=$LOCAL[13]?>">
			<span class="ui-icon ui-icon-circle-triangle-w"></span>
		</div>
	</div>
	<div id="tt-body-wrap">
		<div id="tt-body">
			<div id="agenda-bar"></div>
			<div id="tt-body-overlay"></div>
			<div id="tt-hours"></div>
		</div>
		<form id="new-meeting" class="abs-form">
			<div class="f-close ui-icon ui-icon-close" title="<?=$LOCAL[14]?>"></div>
			<div id="nm-head">
				<p id="nm-title" class="tahoma"></p>
				<div id="nm-date">
					<input name="strdate">
					<div id="nm-calendar" class="ui-icon ui-icon-calendar"></div>
				</div>
			</div>
			<table>
				<tr>
					<td class="form-label" style="width: 28%"><?=$LOCAL[4]?>:</td>
					<td>
						<select name="starttime" id="starttime"></select>
					</td>
					<td class="form-label" style="padding-right: 10px"><?=$LOCAL[5]?>:</td>
					<td>
						<select name="endtime" id="endtime"></select>
					</td>
				</tr>
				<tr>
					<td class="form-label"><?=$LOCAL[15]?>:</td>
					<td colspan="3">
						<input name="title" required>
					</td>
				</tr>
				<tr>
					<td class="form-label"><?=$LOCAL[16]?>:</td>
					<td colspan="3">
						<textarea name="content"></textarea>
					</td>
				</tr>
				<tr>
					<td class="form-label"><?=$LOCAL[11]?>:</td>
					<td colspan="3">
						<input name="place">
					</td>
				</tr>
				<tr>
					<td class="form-label"><?=$LOCAL[10]?>:</td>
					<td colspan="3">
						<div id="nm-add-client" class="ui-icon ui-icon-plus cmd-icon" title="<?=$LOCAL[19]?>"></div>
						<select name="client_id" id="client_id"></select>
					</td>
				</tr>
				<tr>
					<td style="text-align: center" colspan="4">
						<button class="ui-state-default"></button>
					</td>
				</tr>
			</table>
		</form>
		<div id="filter-meets" class="abs-form">
			<div class="f-close ui-icon ui-icon-close" title="<?=$LOCAL[14]?>"></div>
			<div id="fm-caption"></div>
			<table class="data-table">
				<thead>
					<tr>
						<th style="width: 8%">
							<input id="fm-multi-check" type="checkbox" class="auto-center">
						</th>
						<th style="width: 28%"><?=$LOCAL[7]?></th>
						<th><?=$LOCAL[68]?></th>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
			<button class="ui-state-default"><?=$LOCAL[69]?></button>
		</div>
	</div>
</div>
<div id="tt-templates" class="templates">
	<div class="tt-meeting">
		<div class="ttm-wrapper auto-center">
			<div class="ttm-time"></div>
			<div class="ttm-title"></div>
			<div class="ttm-client"></div>
		</div>
		<div class="ttm-close ui-icon ui-icon-close cmd-icon" title="<?=$LOCAL[33]?>"></div>
	</div>
	<div id="sm-message">
		<p><?=$LOCAL[34]?></p>
		<div class="sm-option">
			<input type="radio" name="sm-action" id="sms-1">
			<label for="sms-1">
				<div></div>
				<span><?=$LOCAL[37]?></span>
			</label>
		</div>
		<div class="sm-option">
			<input type="radio" name="sm-action" id="sms-2">
			<label for="sms-2">
				<div></div>
				<span><?=$LOCAL[36]?></span>
			</label>
		</div>
		<div class="sm-option">
			<input type="radio" name="sm-action" id="sms-3">
			<label for="sms-3">
				<div></div>
				<span><?=$LOCAL[35]?></span>
			</label>
		</div>
	</div>
	<div id="mm-picker">
		<label for="mm-input"><?=$LOCAL[38]?>:</label>
		<input id="mm-input">
	</div>
	<table id="fm-tr">
		<tr>
			<td>
				<input type="checkbox" class="auto-center">
			</td>
			<td class="fm-time"></td>
			<td class="fm-title"></td>
		</tr>
	</table>
</div>