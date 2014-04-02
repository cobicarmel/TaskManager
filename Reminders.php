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
					<th style="width: 8%"><?=$LOCAL[133]?></th>
					<th style="width: 20%"><?=$LOCAL[32]?></th>
					<th style="width: 20%"><?=$LOCAL[7]?></th>
					<th><?=$LOCAL[132]?></th>
					<th style="width: 12%" colspan="2"><?=$LOCAL[87]?></th>
				</tr>
			</thead>
			<tbody class="tahoma"></tbody>
		</table>
		<form class="group-edit abs-form">
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
						<input id="rf-date" name="date">
					</td>
					<td class="form-label second-label"><?=$LOCAL[7]?>:</td>
					<td>
						<select id="rf-time" name="time"></select>
					</td>
				</tr>
			</table>
			<button class="ui-state-default"></button>
		</form>
		<table class="group-temp">
			<tr>
				<td class="group-status"></td>
				<td class="group-date"></td>
				<td class="group-time"></td>
				<td class="group-title"></td>
				<td>
					<div class="fa fa-pencil" title="<?=$LOCAL[88]?>"></div>
				</td>
				<td>
					<div class="fa fa-times" title="<?=$LOCAL[46]?>"></div>
				</td>
			</tr>
		</table>
	</div>
</div>