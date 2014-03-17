<?

require '../Authorization.class.php';

define('APP_BASE', '/TaskManager/');

$auth = new Authorization;

if(isset($_GET['logout'])){
	$auth -> logout();
	header('location: ' . APP_BASE);
	exit;
}

$auth -> createAuth(APP_BASE);

header('location: ' . APP_BASE . '?login_attempt');