<div id="settings">
	<div id="settings-toolbar">
		<input type="radio" name="st-radio" id="st-radio1"></input>
		<label for="st-radio1"><?=$LOCAL[1]?></label>
		<input type="radio" name="st-radio" id="st-radio2"></input>
		<label for="st-radio2"><?=$LOCAL[72]?></label>
		<?if($dbaccess -> hasAction('Users')){?>
			<input type="radio" name="st-radio" id="st-radio3"></input>
			<label for="st-radio3"><?=$LOCAL[89]?></label>
		<?}?>
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
		<div id="set-group-tasktypes" class="set-tab" tab="st-radio2">
			<div class="sg-add"><?=$LOCAL[90]?></div>
			<table class="sg-list data-table">
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
			<form class="sg-edit abs-form">
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
			<table class="sg-temp">
				<tr>
					<td class="sg-title"></td>
					<td class="sg-place"></td>
					<td class="sg-duration tahoma"></td>
					<td>
						<div class="fa fa-pencil" title="<?=$LOCAL[88]?>"></div>
					</td>
					<td>
						<div class="fa fa-times" title="<?=$LOCAL[46]?>"></div>
					</td>
				</tr>
			</table>
		</div>
		<?if($dbaccess -> hasAction('Users')){?>
		<div id="set-group-users" class="set-tab" tab="st-radio3">
			<div class="sg-add"><?=$LOCAL[91]?></div>
			<table class="sg-list data-table">
				<thead>
					<tr>
						<th><?=$LOCAL[29]?></th>
						<th><?=$LOCAL[22]?></th>
						<th><?=$LOCAL[30]?></th>
						<th style="width: 12%" colspan="2"><?=$LOCAL[87]?></th>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
			<form id="se-user" class="sg-edit abs-form">
				<div class="ui-icon ui-icon-close f-close" title="<?=$LOCAL[14]?>"></div>
				<table>
					<tr>
						<td class="form-label"><?=$LOCAL[29]?>:</td>
						<td colspan="2">
							<input name="username" required placeholder="<?=$LOCAL[101]?>" pattern=".{4,}">
						</td>
					</tr>
					<tr>
						<td class="form-label"><?=$LOCAL[22]?>:</td>
						<td colspan="2">
							<input name="phone" class="phone number">
							<input name="area-phone" class="area-phone number" maxlength="3">
						</td>
					</tr>
					<tr>
						<td class="form-label"><?=$LOCAL[30]?>:</td>
						<td colspan="2">
							<input name="email">
						</td>
					</tr>
					<tr>
						<td class="form-label"><?=$LOCAL[96]?>:</td>
						<td colspan="2">
							<input type="password" name="password" placeholder="<?=$LOCAL[99]?>" pattern=".{6,}">
						</td>
					</tr>
					<tr>
						<td class="form-label"><?=$LOCAL[97]?>:</td>
						<td colspan="2">
							<input type="password" name="re-password" placeholder="<?=$LOCAL[100]?>" pattern=".{6,}">
						</td>
					</tr>
					<tr>
						<td class="form-label"><?=$LOCAL[98]?>:</td>
						<td colspan="2">
							<select name="permission">
								<?
								foreach($default['ranks'] as $k => $v)
									if($k >= ACCESS)
										echo "<option value='$k'>$LOCAL[$v]</option>";
								?>
							</select>
						</td>
					</tr>
				</table>
				<button class="ui-state-default"></button>
			</form>
			<table class="sg-temp">
				<tr>
					<td class="sg-username"></td>
					<td class="sg-phone tahoma number"></td>
					<td class="sg-email"></td>
					<td>
						<div class="fa fa-pencil" title="<?=$LOCAL[88]?>"></div>
					</td>
					<td>
						<div class="fa fa-times" title="<?=$LOCAL[46]?>"></div>
					</td>
				</tr>
			</table>
		</div>
		<?}?>
	</div>
</div>