<?

if(!empty($_FILES)){
	require 'Global.lib.php';

	require 'Task.class.php';

	require 'Outlook.class.php';

	$calendar = new Outlook;

	$calendar -> importTask();
}

?>

<form method="post" enctype="multipart/form-data">
	<input name="file" type="file">
	<input type="submit">
</form>