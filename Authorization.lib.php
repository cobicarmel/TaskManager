<?

require 'Authorization.class.php';

require_once 'DB.class.php';

Database::createSql('localhost', 'root', '', 'taskmanager');

$auth = new Authorization('users');

$user = $auth -> detectUser();

if(! $user){
	header('location: login/');
	exit;
}

define('USERNAME', $user['username']);

define('ACCESS', (int) $user['permission']);

/** getting all allowed actions for this user **/

$sql = new DBOutput;

$allowedActions = $sql -> query('select * from action_authorized where access >= ' . ACCESS);

/** creating user db config **/

Database::createSql('localhost', 'root', '', "taskmanager_$user[area]");