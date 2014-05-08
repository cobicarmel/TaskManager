<?

require 'Global.lib.php';

/* getting the requested operation */

$subject = $_REQUEST['subject'];

$action = $_REQUEST['action'];

unset($_REQUEST['subject'], $_REQUEST['action']);

/* checking user permissions for specify action */

if(! $db_access -> hasAction($subject, $action)){
	header('HTTP/1.0 403 Forbidden');
	exit;
}

/* filtering input */

Database::filterInput($_REQUEST);

/* performing action */

require_once "$subject.class.php";

$class = new $subject;

$class -> $action();

/* returning result */

Database::getResponse(true);