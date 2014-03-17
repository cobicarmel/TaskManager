<div id="clients">
	<h4><?=$LOCAL[19]?></h4>
	<div>
		<form id="new-client">
			<table>
				<tr>
					<td class="form-label" style="width: 20%"><?=$LOCAL[20]?>:</td>
					<td colspan="2">
						<input name="first_name" tabindex="1" required>
					</td>
					<td class="form-label second-label" style="width: 20%"><?=$LOCAL[22]?>:</td>
					<td id="nc-phone" colspan="2">
						<input name="phone[]" tabindex="4" class="phone number">
						<input name="area-phone[]" class="area-phone number" tabindex="3" maxlength="3">
					</td>
				</tr>
				<tr>
					<td class="form-label" style="width: 18%"><?=$LOCAL[21]?>:</td>
					<td colspan="2">
						<input name="last_name" tabindex="2">
					</td>
					<td class="form-label second-label"><?=$LOCAL[25]?>:</td>
					<td colspan="2">
						<input name="mid" class="number" tabindex="5">
					</td>
				</tr>
				<tr>
					<td class="form-label"><?=$LOCAL[23]?>:</td>
					<td colspan="2">
						<input name="address" tabindex="6">
					</td>
					<td class="form-label second-label"><?=$LOCAL[24]?>:</td>
					<td colspan="2">
						<input name="city" tabindex="7">
					</td>
				</tr>
				<tr>
					<td class="form-label"><?=$LOCAL[31]?>:</td>
					<td id="nc-mail" colspan="2">
						<input name="email[]" type="email" tabindex="8">
					</td>
					<td></td>
					<td colspan="2">
						<button class="ui-state-default" tabindex="9"><?=$LOCAL[26]?></button>
					</td>
				</tr>
			</table>
		</form>
	</div>
	<h4><?=$LOCAL[27]?></h4>
	<div id="search-clients"></div>
	<h4 class="search-results"><?=$LOCAL[39]?></h4>
	<div class="search-results">
		<div id="search-result-wrapper">
			<table id="search-result" class="data-table">
				<thead>
					<th><?=$LOCAL[29]?></th>
					<th><?=$LOCAL[30]?></th>
				</thead>
				<tbody></tbody>
			</table>
		</div>
	</div>
	<h4><?=$LOCAL[28]?></h4>
	<div id="client-details">
		<div id="cd-basic">
			<table id="cd-list" class="data-table">
				<thead>
					<tr>
						<th><?=$LOCAL[29]?></th>
						<th><?=$LOCAL[30]?></th>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
		</div>
		<div id="cd-detailed">
			<div class="clear" style="height: 100%">
				<div id="cdd-head">
					<div id="cdd-image">
						<img src="media/default_user.png" title="<?=$LOCAL[40]?>">
					</div>
					<div id="cdd-title"></div>
					<div id="cdd-remove" title="<?=$LOCAL[46]?>" class="ui-icon ui-icon-close cmd-icon"></div>
				</div>
				<div id="cdd-body">
					<div id="cd-toolbar">
						<div class="cdt-tab" tab="cd-card"><?=$LOCAL[41]?></div>
						<div class="cdt-tab" tab="cd-history"><?=$LOCAL[42]?></div>
						<div class="cdt-tab" tab="cd-edit"><?=$LOCAL[43]?></div>
						<?if(ACCESS <= 2){?>
							<div class="cdt-tab" tab="cd-payments"><?=$LOCAL[51]?></div>
						<?}?>
					</div>
					<div id="cd-blanks">
						<div id="cd-card">
							<div class="cdc-data-box">
								<div class="cdc-data">
									<div class="cdc-right">
										<div id="cdc-addphone" title="<?=$LOCAL[47]?>" class="ui-icon ui-icon-plus cmd-icon"></div>
									</div>
									<div class="cdc-title"><?=$LOCAL[22]?></div>
									<div id="cdc-phone" class="cdc-items"></div>
								</div>
								<div class="cdc-data">
									<div class="cdc-right">
										<div id="cdc-addmail" title="<?=$LOCAL[48]?>" class="ui-icon ui-icon-plus cmd-icon"></div>
									</div>
									<div class="cdc-title"><?=$LOCAL[31]?></div>
									<div id="cdc-email" class="cdc-items"></div>
								</div>
							</div>
							<div class="cdc-data-box">
								<div class="cdc-data">
									<div class="cdc-right"></div>
									<div class="cdc-title"><?=$LOCAL[24]?></div>
									<div id="cdc-city" class="cdc-items"></div>
								</div>
								<div class="cdc-data">
									<div class="cdc-right"></div>
									<div class="cdc-title"><?=$LOCAL[23]?></div>
									<div id="cdc-address" class="cdc-items"></div>
								</div>
							</div>
							<div class="cdc-data-box">
								<div class="cdc-data">
									<div class="cdc-right"></div>
									<div class="cdc-title"><?=$LOCAL[25]?></div>
									<div id="cdc-mid" class="cdc-items"></div>
								</div>
							</div>
						</div>
						<div id="cd-history">
							<table class="data-table">
								<thead>
									<th><?=$LOCAL[32]?></th>
									<th><?=$LOCAL[7]?></th>
									<th><?=$LOCAL[45]?></th>
								</thead>
								<tbody class="tahoma"></tbody>
							</table>
						</div>
						<div id="cd-edit">
							<form id="edit-client">
								<table>
									<tr>
										<td class="form-label" style="width: 40%"><?=$LOCAL[20]?>:</td>
										<td>
											<input name="first_name" tabindex="1" required>
										</td>
									</tr>
									<tr>
										<td class="form-label"><?=$LOCAL[21]?>:</td>
										<td>
											<input name="last_name">
										</td>
									</tr>
									<tr>
										<td class="form-label"><?=$LOCAL[22]?>:</td>
										<td>
											<input name="phone" tabindex="4" class="phone number">
											<input name="area-phone" class="area-phone number" maxlength="3">
										</td>
									</tr>
									<tr>
										<td class="form-label"><?=$LOCAL[25]?>:</td>
										<td>
											<input name="mid" class="number">
										</td>
									</tr>
									<tr>
										<td class="form-label"><?=$LOCAL[23]?>:</td>
										<td>
											<input name="address">
										</td>
									</tr>
									<tr>
										<td class="form-label"><?=$LOCAL[24]?>:</td>
										<td>
											<input name="city">
										</td>
									</tr>
									<tr>
										<td class="form-label"><?=$LOCAL[31]?>:</td>
										<td>
											<input name="email" type="email">
										</td>
									</tr>
									<tr>
										<td></td>
										<td>
											<button class="ui-state-default"><?=$LOCAL[44]?></button>
										</td>
									</tr>
								</table>
							</form>
						</div>
						<?if(ACCESS <= 2){?>
						<div id="cd-payments">
							<h4><?=$LOCAL[53]?></h4>
							<div id="cdp-new">
								<form id="new-payment">
									<table>
										<tr>
											<td class="form-label"><?=$LOCAL[52]?>:</td>
											<td colspan="2">
												<input class="dec-number" name="sum" required>
											</td>
										</tr>
										<tr>
											<td class="form-label"><?=$LOCAL[45]?>:</td>
											<td colspan="2">
												<textarea name="title"></textarea>
											</td>
										</tr>
										<tr>
											<td class="form-label"><?=$LOCAL[32]?>:</td>
											<td colspan="2">
												<input class="p-date" name="date" required>
											</td>
										</tr>
										<tr>
											<td></td>
											<td colspan="2">
												<button class="ui-state-default"><?=$LOCAL[54]?></button>
											</td>
										</tr>
									</table>
								</form>
							</div>
							<h4><?=$LOCAL[58]?></h4>
							<div>
								<p><?=$LOCAL[59]?>:</p>
								<form id="cdp-reports">
									<table>
										<tr>
											<td><?=$LOCAL[60]?>:</td>
											<td><input name="from"></td>
										</tr>
										<tr>
											<td><?=$LOCAL[61]?>:</td>
											<td><input name="to"></td>
										</tr>
										<tr>
											<td></td>
											<td>
												<button class="ui-state-default"><?=$LOCAL[62]?></button>
											</td>
										</tr>
									</table>
								</form>
							</div>
							<h4><?=$LOCAL[55]?></h4>
							<div id="cdp-list">
								<div id="cdp-wrapper" style="height: 100%">
									<div style="height: 90%; overflow: auto">
										<table id="cdp-table" class="data-table">
											<thead>
												<th style="width: 6%"></th>
												<th style="width: 26%"><?=$LOCAL[32]?></th>
												<th style="width: 22%"><?=$LOCAL[52]?></th>
												<th><?=$LOCAL[45]?></th>
											</thead>
											<tbody class="tahoma"></tbody>
										</table>
									</div>
									<div id="cdp-navigate" class="navigate-box">
										<div class="nav-arrows-wrap">
											<div id="cn-prev" class="ui-icon ui-icon-arrowthick-1-e auto-center" title="<?=$LOCAL[56]?>"></div>
										</div>
										<div id="cn-total" class="nav-center tahoma"></div>
										<div class="nav-arrows-wrap">
											<div id="cn-next" class="ui-icon ui-icon-arrowthick-1-w auto-center" title="<?=$LOCAL[57]?>"></div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<?}?>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>