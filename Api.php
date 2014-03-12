<?

require 'Global.php';

$subject = $_POST['subject'];

$action = $_POST['action'];

unset($_POST['subject'], $_POST['action']);

/** checking user permissions for specify action **/

$allowed = false;

foreach($allowedActions as $act)
	if($act['subject'] == $subject && $act['action'] == $action){
		$allowed = true;
		break;
	}

if(! $allowed){
	header('HTTP/1.0 403 Forbidden');
	exit;
}

/** filtering input **/	

foreach($_POST as $key => $value)
	$_POST[$key] = str_replace("'", "\'", $value);

/** performing action **/

require "$subject.class.php";

$class = new $subject;

$class -> $action();

Database::getResponse(true);