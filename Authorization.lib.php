<?

require 'Users.class.php';

require 'Authorization.class.php';

require_once 'DB.class.php';

Database::createSql('localhost', 'root', '', 'taskmanager');

$users = (new Users) -> getAll();

$auth = new Authorization($users);

$user = $auth -> detectUser();

if(! $user){
	$header = 'location: login/';
	if(isset($_GET['login_attempt']))
		$header .= '?login_attempt';
	header($header);
	exit;
}

if(isset($_GET['login_attempt']))
	header('location: ' . $_SERVER['PHP_SELF']);

define('USERNAME', $user['username']);

define('ACCESS', (int) $user['permission']);

define('AREA', $user['area']);

/** getting all allowed actions for this user **/

$sql = new DBOutput;

$allowedActions = $sql -> query('select * from action_authorized where access >= ' . ACCESS);

/** creating user db config **/

Database::createSql('localhost', 'root', '', 'taskmanager_' . AREA);