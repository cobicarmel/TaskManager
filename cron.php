<?
require 'Global.lib.php';

$input = new DBInput;

$passedTime = (new Settings) -> getProperty('remove_old_reminders');

if($passedTime !== 'never')
	$input -> query('remove', 'reminders', null, "where date < now() - interval $passedTime day && status = '1'");

Database::getResponse(true);