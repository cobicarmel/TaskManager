<div id="group-reminders">
	<div id="reminders-caption" class="caption">
		<div class="fa fa-bell"></div>
		<div id="reminders-title"><?=$LOCAL[50]?></div>
	</div>
	<div id="reminders-body">
		<div class="group-add"><?=$LOCAL[131]?></div>
		<table class="group-list data-table">
			<thead>
				<tr>
					<th colspan="2" style="width: 15%"><?=$LOCAL[32]?></th>
					<th style="width: 10%"><?=$LOCAL[7]?></th>
					<th><?=$LOCAL[132]?></th>
					<th style="width: 24%" colspan="4"><?=$LOCAL[87]?></th>
				</tr>
			</thead>
			<tbody class="tahoma"></tbody>
		</table>
		<form id="reminders-edit" class="group-edit abs-form">
			<div class="ui-icon ui-icon-close f-close" title="<?=$LOCAL[14]?>"></div>
			<table>
				<tr>
					<td class="form-label"><?=$LOCAL[132]?>:</td>
					<td colspan="3">
						<input name="title" required>
					</td>
				</tr>
				<tr>
					<td class="form-label"><?=$LOCAL[9]?>:</td>
					<td colspan="3">
						<textarea name="content"></textarea>
					</td>
				</tr>
				<tr>
					<td class="form-label"><?=$LOCAL[32]?>:</td>
					<td>
						<input id="rf-date" name="strdate" required>
					</td>
					<td class="form-label second-label"><?=$LOCAL[7]?>:</td>
					<td>
						<select id="rf-time" name="strtime" required></select>
					</td>
				</tr>
				<tr>
					<td colspan="2" class="form-label"><?=$LOCAL[143]?>:</td>
					<td colspan="2">
						<select name="pre">
							<option value="0"><?=$LOCAL[144]?></option>
							<option value="300000">5 <?=$LOCAL[136]?></option>
							<option value="600000">10 <?=$LOCAL[136]?></option>
							<option value="900000"><?=$LOCAL[137]?></option>
							<option value="1800000"><?=$LOCAL[138]?></option>
							<option value="3600000"><?=$LOCAL[139]?></option>
							<option value="10800000"><?=$LOCAL[140]?></option>
							<option value="43200000"><?=$LOCAL[141]?></option>
							<option value="86400000"><?=$LOCAL[142]?></option>
						</select>
					</td>
				</tr>
			</table>
			<button class="ui-state-default"></button>
		</form>
		<table class="group-temp">
			<tr>
				<td style="width: 1px" class="group-status"></td>
				<td class="group-strdate"></td>
				<td class="group-strtime"></td>
				<td class="group-title"></td>
				<td class="group-mark" colspan="2"></td>
				<td>
					<div class="fa fa-pencil" title="<?=$LOCAL[88]?>"></div>
				</td>
				<td>
					<div class="fa fa-times" title="<?=$LOCAL[46]?>"></div>
				</td>
			</tr>
		</table>
	</div>
	<audio id="reminder-audio">
		<source src="media/reminder.mp3">
	</audio>
</div>