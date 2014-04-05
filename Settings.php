<div id="settings">
	<div id="settings-toolbar">
		<input type="radio" name="st-radio" id="st-radio1">
		<label for="st-radio1"><?=$LOCAL[1]?></label>
		<input type="radio" name="st-radio" id="st-radio2">
		<label for="st-radio2"><?=$LOCAL[72]?></label>
		<?if($dbaccess -> hasAction('Users')){?>
			<input type="radio" name="st-radio" id="st-radio3">
			<label for="st-radio3"><?=$LOCAL[89]?></label>
		<?}
		if($dbaccess -> hasAction('Settings', 'changesettings')){?>
			<input type="radio" name="st-radio" id="st-radio4">
			<label for="st-radio4"><?=$LOCAL[121]?></label>
		<?}
		if($dbaccess -> hasAction('Settings', 'changesettings')){?>
			<input type="radio" name="st-radio" id="st-radio5">
			<label for="st-radio5"><?=$LOCAL[71]?></label>
		<?}?>
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
			<?foreach($config['default']['table_times'] as $n){?>
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
		<div id="group-tasktypes" class="set-tab" tab="st-radio2">
			<div class="group-add"><?=$LOCAL[90]?></div>
			<table class="group-list data-table">
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
			<form class="group-edit abs-form">
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
			<table class="group-temp">
				<tr>
					<td class="group-title"></td>
					<td class="group-place"></td>
					<td class="group-duration tahoma"></td>
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
		<div id="group-users" class="set-tab" tab="st-radio3">
			<div class="group-add"><?=$LOCAL[91]?></div>
			<table class="group-list data-table">
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
			<form id="se-user" class="group-edit abs-form">
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
								foreach($config['default']['ranks'] as $k => $v)
									if($k >= ACCESS)
										echo "<option value='$k'>$LOCAL[$v]</option>";
								?>
							</select>
						</td>
					</tr>
				</table>
				<button class="ui-state-default"></button>
			</form>
			<table class="group-temp">
				<tr>
					<td class="group-username"></td>
					<td class="group-phone tahoma number"></td>
					<td class="group-email"></td>
					<td>
						<div class="fa fa-pencil" title="<?=$LOCAL[88]?>"></div>
					</td>
					<td>
						<div class="fa fa-times" title="<?=$LOCAL[46]?>"></div>
					</td>
				</tr>
			</table>
		</div>
		<?}
		if($dbaccess -> hasAction('Settings', 'changesettings')){?>
		<div class="set-tab" tab="st-radio4">
			<form id="set-access">
				<div id="sa-tables">
				<?$dbaccess -> writeSettings()?>
				</div>
				<div id="sa-submit">
					<button class="ui-state-default"><?=$LOCAL[44]?></button>
				</div>
			</form>
		</div>
		<div class="set-tab" tab="st-radio5">
			<form id="general-settings" class="abs-form auto-center">
				<div id="gs-boxes">
					<div class="gs-column">
						<div class="data-box">
							<h4 class="db-caption"><?=$LOCAL[8]?></h4>
							<table>
								<tr>
									<td><?=$LOCAL[102]?></td>
									<td>
										<input name="meeting_duration" placeholder="<?=$LOCAL[103]?>" type="number" min="10" required>
									</td>
								</tr>
								<tr>
									<td><?=$LOCAL[104]?></td>
									<td>
										<select name="undefined_time">
											<option value="0"><?=$LOCAL[107]?></option>
											<option value="1"><?=$LOCAL[106]?></option>
											<option value="2"><?=$LOCAL[105]?></option>
										</select>
									</td>
								</tr>
								<tr>
									<td><?=$LOCAL[108]?></td>
									<td>
										<select name="interactive_meet">
											<option value="0"><?=$LOCAL[111]?></option>
											<option value="1"><?=$LOCAL[110]?></option>
											<option value="2"><?=$LOCAL[109]?></option>
										</select>
									</td>
								</tr>
							</table>
						</div>
						<div class="data-box">
							<h4 class="db-caption"><?=$LOCAL[50]?></h4>
							<table>
								<tr>
									<td><?=$LOCAL[145]?></td>
									<td>
										<select name="reminders_audio">
											<option value="0"><?=$LOCAL[146]?></option>
											<option value="1"><?=$LOCAL[147]?></option>
										</select>
									</td>
								</tr>
							</table>
						</div>
					</div>
					<div class="gs-column">
						<div class="data-box">
							<h4 class="db-caption"><?=$LOCAL[30]?></h4>
							<table>
								<tr>
									<td><?=$LOCAL[112]?></td>
									<td>
										<select name="meet_cancel_mail">
											<option value="0"><?=$LOCAL[113]?></option>
											<option value="1"><?=$LOCAL[114]?></option>
											<option value="2"><?=$LOCAL[115]?></option>
										</select>
									</td>
								</tr>
								<tr>
									<td><?=$LOCAL[116]?></td>
									<td>
										<input name="mail_sender_address" type="email" placeholder="<?=$LOCAL[118]?>">
									</td>
								</tr>
								<tr>
									<td><?=$LOCAL[117]?></td>
									<td>
										<input name="mail_sender_pass" type="password" placeholder="<?=$LOCAL[120]?>">
									</td>
								</tr>
								<tr>
									<td><?=$LOCAL[119]?></td>
									<td>
										<input name="mail_sender_name">
									</td>
								</tr>
							</table>
						</div>
					</div>
				</div>
				<div id="group-submit">
					<button class="ui-state-default"><?=$LOCAL[44]?></button>
				</div>
			</form>
		</div>
		<?}?>
	</div>
</div>