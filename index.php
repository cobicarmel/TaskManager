<?
require 'Global.lib.php';

require 'Task.class.php';

require 'Reminders.class.php';

$config = [
	'default' => (new Settings) -> listConfig(),
	'reminders' => (new Reminders) -> getAll(),
	'tasktypes' => (new Task) -> getTaskTypes(),
	'users' => $recognizedUsers
];
?>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title><?=$LOCAL[18]?></title>
	<link rel="stylesheet" href="styles/style.css">
	<link rel="stylesheet" href="styles/jquery-ui.css">
	<link rel="stylesheet" href="styles/font-awesome.min.css">
	<link rel="icon" href="media/icon.png">
</head>
<body>
<center>
<div id="api-error"></div>
<div id="app">
	<div id="appcenter">
		<div id="ac-dialog">
			<p></p>
		</div>
		<div class="ac-tab" tab="calendar">
			<div id="calendar"></div>
		</div>
		<?
		if($db_access -> hasAction('Task')){
			foreach($config['default']['table_times'] as $i => $title){?>
				<div class="ac-tab" tab="table-time-<?=$i?>">
					<? require 'TableTime.php' ?>
				</div>
			<? }
		}
		if($db_access -> hasAction('Client')){ ?>
			<div class="ac-tab" tab="client">
				<?require 'Client.php';?>
			</div>
		<? }
		if($db_access -> hasAction('Reminders')){ ?>
			<div class="ac-tab" tab="reminders">
				<?require 'Reminders.php';?>
			</div>
		<? }
		if($db_access -> hasAction('Settings')) { ?>
			<div class="ac-tab" tab="settings">
				<?require 'Settings.php';?>
			</div>
		<? } ?>
		<div id="popup">
			<div id="popup-img"></div>
			<div id="popup-title"></div>
		</div>
		<div id="reminder-popup">
			<div class="ui-icon ui-icon-close f-close" title="<?=$LOCAL[14]?>"></div>
			<div id="rp-head">
				<div id="rp-strtime" class="tahoma"></div>
				<div id="rp-bell" class="fa fa-bell"></div>
			</div>
			<div id="rp-details">
				<div id="rp-title"></div>
				<div id="rp-client-wrapper">
					<span><?=$LOCAL[149]?>:</span>
					<div id="rp-client"></div>
				</div>
			</div>
			<div id="rp-actions">
				<div class="rpa-action">
					<div class="rpa-title"><?=$LOCAL[134]?></div>
					<input id="rp-minutes" class="number" value="5" type="number" min="1" max="99">
					<div><?=$LOCAL[136]?></div>
					<div id="rp-later" class="fa fa-arrow-circle-o-left"></div>
				</div>
				<div class="rpa-action">
					<div class="rpa-title"><?=$LOCAL[135]?></div>
					<div id="rp-edit" class="fa fa-arrow-circle-o-left"></div>
				</div>
			</div>
		</div>
		<?require 'Templates.php'?>
	</div>
	<div id="appside">
		<?require 'appSide.php';?>
	</div>
</div>
</center>
</body>
<script src="scripts/jquery.js"></script>
<script src="scripts/jquery-ui.js"></script>
<script src="scripts/jquery.tablesorter.js"></script>
<script src="scripts/date.js"></script>
<script src="local/<?=LANG?>.js"></script>
<script src="scripts/VBoard.js"></script>
<script src="scripts/Task.js"></script>
<script src="scripts/Agenda.js"></script>
<script src="scripts/TableTime.js"></script>
<script src="scripts/Client.js"></script>
<script src="scripts/Payment.js"></script>
<script src="scripts/Settings.js"></script>
<script src="scripts/Reminders.js"></script>
<script src="scripts/Api.js"></script>
<script src="scripts/Access.js"></script>
<script src="scripts/jquery-plugins.js"></script>
<script src="scripts/jquery.upload.js"></script>
<script src="scripts/TaskManager.js"></script>
<script src="scripts/script.js"></script>
<script>
var Config = <?=json_encode($config)?>;
Access.actions = <?=json_encode($db_access -> listActions())?>;
</script>
</html>