<?

require 'Global.lib.php';

/** checking user permissions for specify action **/

$subject = $_POST['subject'];

$action = $_POST['action'];

unset($_POST['subject'], $_POST['action']);

if(! $dbaccess -> hasAction($subject, $action)){
	header('HTTP/1.0 403 Forbidden');
	exit;
}

/** filtering input **/	

foreach($_POST as $key => $value)
	$_POST[$key] = str_replace("'", "\'", $value);

/** performing action **/

require_once "$subject.class.php";

$class = new $subject;

$class -> $action();

Database::getResponse(true);