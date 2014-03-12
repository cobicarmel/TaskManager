<?

require '../Authorization.class.php';

$auth = new Authorization;

if(isset($_GET['logout'])){
	$auth -> logout();
	header('location: ../');
}

$auth -> createAuth('/TaskManager/');