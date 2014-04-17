<?

/** General config **/

date_default_timezone_set('Asia/Jerusalem');

define('LANG', detectLang());

define('DATE_FORMAT', 'd/m/Y');

define('TIME_FORMAT', 'H:i:s');

define('COMPANY_NAME', 'TaskManager');

/** Database and user config **/

define('DB_AREA', 'taskmanager_');

define('DB_HOST', 'localhost');

define('DB_USER', 'root');

define('DB_PASS', '');

$author = new Authorization;

$user = $author -> createWorkSpace();

if(gettype($user) != 'array'){

	$header = 'location: login/';

	if(isset($_GET['login']))
		$header .= "?login=$user";

	header($header);

	exit;
}

if(isset($_GET['login']))
	header('location: ' . $_SERVER['PHP_SELF']);

define('USER_NAME', $user['username']);

define('USER_ID', $user['id']);

define('ACCESS', (int) $user['permission']);

/* getting all allowed actions for this user */

$db_access = new Access;

/* getting visibility users */

$recognizedUsers = $author -> userClass -> getRecognized();