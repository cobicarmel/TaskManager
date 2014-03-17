<div id="settings">
	<div id="settings-toolbar">
		<input type="radio" name="st-radio" id="st-radio1"></input>
		<label for="st-radio1"><?=$LOCAL[1]?></label>
		<input type="radio" name="st-radio" id="st-radio2"></input>
		<label for="st-radio2"><?=$LOCAL[72]?></label>
		<input type="radio" name="st-radio" id="st-radio3"></input>
		<label for="st-radio3"><?=$LOCAL[71]?></label>
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
			<?foreach($default['table_times'] as $i => $title){?>
				<div class="sab-system">
					<?for($day = 73; $day < 80; $day++){?>
					<div class="ss-day">
						<div class="ss-title"><?=$LOCAL[$day]?></div>
						<div class="ss-hours"></div>
						<div class="ss-add">
							<div class="ui-icon ui-icon-plus auto-center" title="<?=$LOCAL[49]?>"></div>
						</div>
					</div>
					<?}?>
				</div>
			<?}?>
			</div>
		</div>
		<div class="set-tab" tab="st-radio2"></div>
		<div class="set-tab" tab="st-radio3"></div>
	</div>
</div>