<div id="templates">
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
		<div class="sm-option">
			<input type="radio" name="sm-action" id="sms-4">
			<label for="sms-4">
				<div></div>
				<span><?=$LOCAL[165]?></span>
			</label>
		</div>
	</div>
	<div id="mm-picker">
		<label for="mm-input"><?=$LOCAL[38]?>:</label>
		<input id="mm-input">
	</div>
	<div id="md-picker">
		<form>
			<label for="md-input"><?=$LOCAL[156]?>:</label>
			<input id="md-input">
		</form>
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
	<div id="c-add-item">
		<div class="ui-icon ui-icon-close f-close" title="<?=$LOCAL[14]?>"></div>
		<div id="cai-title"></div>
		<form id="cai-form">
			<div id="cai-inputs"></div>
			<button class="ui-state-default"><?=$LOCAL[49]?></button>
		</form>
	</div>
	<div id="cr-print">
		<div class="f-close ui-icon ui-icon-close" title="<?=$LOCAL[14]?>"></div>
		<div id="crp-content">
			<h3><?=$LOCAL[63]?></h3>
			<ul>
				<li><?=$LOCAL[64]?>:
					<span id="crp-client"></span>
				</li>
				<li><?=$LOCAL[60]?>:
					<span id="crp-from"></span>
				</li>
				<li><?=$LOCAL[61]?>:
					<span id="crp-to"></span>
				</li>
			</ul>
			<div id="crp-table-wrap">
				<table id="crp-table" class="data-table">
					<thead>
					<tr>
						<th style="width: 25%"><?=$LOCAL[32]?></th>
						<th style="width: 25%"><?=$LOCAL[52]?></th>
						<th><?=$LOCAL[45]?></th>
					</tr>
					</thead>
					<tbody></tbody>
				</table>
			</div>
			<div id="crp-total"></div>
		</div>
		<button class="ui-state-default"><?=$LOCAL[65]?></button>
	</div>
	<div class="ss-part">
		<div class="ui-icon ui-icon-close cmd-icon" title="<?=$LOCAL[46]?>"></div>
		<div class="sp-title"></div>
		<div class="sp-time tahoma"></div>
	</div>
	<div id="agenda-edit">
		<div class="ui-icon ui-icon-close f-close" title="<?=$LOCAL[14]?>"></div>
		<div id="ae-day" class="form-title"></div>
		<form id="ae-form">
			<table>
				<tr>
					<td><?=$LOCAL[4]?>:</td>
					<td>
						<select id="ae-starttime" name="starttime" required></select>
					</td>
				</tr>
				<tr>
					<td><?=$LOCAL[5]?>:</td>
					<td>
						<select id="ae-endtime" name="endtime" required></select>
					</td>
				</tr>
				<tr>
					<td><?=$LOCAL[80]?>:</td>
					<td>
						<select id="ae-taskgroup" name="tasktype" required></select>
					</td>
				</tr>
				<tr>
					<td><?=$LOCAL[81]?>:</td>
					<td>
						<select id="ae-static" name="static" required>
							<option></option>
							<option value="0"><?=$LOCAL[83]?></option>
							<option value="1"><?=$LOCAL[82]?></option>
						</select>
					</td>
				</tr>
			</table>
			<button class="ui-state-default"></button>
		</form>
	</div>
	<form id="tt-excel" class="abs-form">
		<div class="f-close ui-icon ui-icon-close" title=""></div>
		<div id="te-body">
			<input type="hidden" name="system">
			<input type="hidden" name="date">
			<input type="hidden" name="subject" value="Outlook">
			<input type="hidden" name="action" value="importtask">
			<label for="te-file"><?=$LOCAL[161]?></label>
			<input id="te-file" type="file" name="file" accept="text/calendar" required="required">
			<div id="te-toggle">
				<div id="te-file-title">
					<div id="tft-label"><?=$LOCAL[162]?>:&nbsp;</div>
					<div id="tft-name"></div>
				</div>
				<button class="ui-state-default"><?=$LOCAL[160]?></button>
			</div>
		</div>
	</form>
	<div id="te-error">
		<div><?=$LOCAL[163]?>.</div>
		<br>
		<div><?=$LOCAL[164]?></div>
	</div>
</div>