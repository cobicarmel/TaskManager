<?

require 'Global.lib.php';

/* getting the requested operation */

$subject = $_POST['subject'];

$action = $_POST['action'];

unset($_POST['subject'], $_POST['action']);

/* checking user permissions for specify action */

if(! $db_access -> hasAction($subject, $action)){
	header('HTTP/1.0 403 Forbidden');
	exit;
}

/* filtering input */

Database::filterInput($_POST);

/* performing action */

require_once "$subject.class.php";

$class = new $subject;

$class -> $action();

/* returning result */

Database::getResponse(true);