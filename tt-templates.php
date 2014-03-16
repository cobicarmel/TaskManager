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