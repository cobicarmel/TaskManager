<?

require '../Config.host.php';

require '../Authorization.class.php';

$auth = new Authorization;

if(isset($_GET['logout'])){
	$auth -> logout();
	header('location: ' . APP_BASE);
	exit;
}

$auth -> createAuth();

header('location: ' . APP_BASE . '?login');