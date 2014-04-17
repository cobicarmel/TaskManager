<div id="as-datetime" class="as-bar tahoma">
	<div id="dt-day" class="dt-label caption"></div>
	<div id="dt-date" class="dt-label caption"></div>
	<div id="dt-time" class="dt-label caption"></div>
</div>
<div id="user" class="as-bar">
	<div id="user-label" class="caption">
		<span class="ui-icon ui-icon-person"></span>
	</div>
	<div id="user-name"><?=USER_NAME?></div>
	<div id="logout" class="caption">
		<a href="login/login.lib.php?logout"><?=$LOCAL[67]?></a>
	</div>
</div>
<div id="today" class="as-bar">
	<h4 class="caption"><?=$LOCAL[1]?>:</h4>
	<div>
		<table id="today-agenda"></table>
	</div>
	<h4 class="caption"><?=$LOCAL[17]?>:</h4>
	<div>
		<table id="soon"></table>
	</div>
</div>
<div id="menu" class="as-bar">
	<?
	if($db_access -> hasAction('Task')){
		foreach($config['default']['table_times'] as $i => $title){ ?>
			<div class="menu-tab" tab="table-time-<?=$i?>"><?=$title?></div>
	<? }
	}
	if($db_access -> hasAction('Client')){ ?>
		<div class="menu-tab" tab="client"><?=$LOCAL[2]?></div>

	<? }
	if($db_access -> hasAction('Reminders')){ ?>
		<div class="menu-tab" tab="reminders"><?=$LOCAL[50]?></div>
	<? }
	if($db_access -> hasAction('Settings')) {?>
		<div class="menu-tab" tab="settings"><?=$LOCAL[3]?></div>
	<? } ?>
</div>