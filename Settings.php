<div id="settings">
	<div id="settings-toolbar">
		<input type="radio" name="st-radio" id="st-radio1"></input>
		<label for="st-radio1"><?=$LOCAL[1]?></label>
		<input type="radio" name="st-radio" id="st-radio2"></input>
		<label for="st-radio2"><?=$LOCAL[72]?></label>
		<input type="radio" name="st-radio" id="st-radio3"></input>
		<label for="st-radio3"><?=$LOCAL[89]?></label>
		<input type="radio" name="st-radio" id="st-radio4"></input>
		<label for="st-radio4"><?=$LOCAL[71]?></label>
	</div>
	<div id="settings-body">
		<div class="set-tab" tab="st-radio1">
			<div id="set-agenda-nav" class="navigate-box">
				<div class="nav-arrows-wrap">
					<div id="san-prev" class="ui-icon ui-icon-carat-1-e auto-center" title="<?=$LOCAL[56]?>"></div>
				</div>
				<div id="san-title" class="nav-center"></div>
				<div class="nav-arrows-wrap">
					<div id="san-next" class="ui-icon ui-icon-carat-1-w auto-center" title="<?=$LOCAL[57]?>"></div>
				</div>
			</div>
			<div id="set-agenda-body">
			<?foreach($default['table_times'] as $n){?>
				<div class="sab-system">
					<?for($day = 73, $i = 0; $i < 7; $i++){?>
					<div class="ss-day">
						<div class="ss-title"><?=$LOCAL[$day + $i]?></div>
						<div class="ss-hours"></div>
						<div class="ss-add">
							<div class="ui-icon ui-icon-plus auto-center" title="<?=$LOCAL[49]?>" day="<?=$i?>"></div>
						</div>
					</div>
					<?}?>
				</div>
			<?}?>
			</div>
		</div>
		<div class="set-tab" tab="st-radio2">
			<div id="stt-add"><?=$LOCAL[90]?></div>
			<div id="set-tasktypes">
				<table class="data-table">
					<thead>
						<tr>
							<th><?=$LOCAL[84]?></th>
							<th><?=$LOCAL[85]?></th>
							<th style="width: 10%"><?=$LOCAL[86]?></th>
							<th style="width: 12%" colspan="2"><?=$LOCAL[87]?></th>
						</tr>
					</thead>
					<tbody></tbody>
				</table>
			</div>
			<form id="stt-edit" class="abs-form">
				<div class="ui-icon ui-icon-close f-close" title="<?=$LOCAL[14]?>"></div>
				<table>
					<tr>
						<td class="form-label"><?=$LOCAL[84]?>:</td>
						<td colspan="2">
							<input name="title" required>
						</td>
					</tr>
					<tr>
						<td class="form-label"><?=$LOCAL[85]?>:</td>
						<td colspan="2">
							<input name="place" required>
						</td>
					</tr>
					<tr>
						<td class="form-label"><?=$LOCAL[86]?>:</td>
						<td></td>
						<td>
							<input id="stt-duration" name="duration" value="30" required readonly>
						</td>
					</tr>
				</table>
				<button class="ui-state-default"></button>
			</form>
		</div>
		<div class="set-tab" tab="st-radio3"></div>
	</div>
</div>