<?
require '../local/detect.lib.php';

$lang = detectLang();

require "local/$lang.php";
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title><?=$LOCAL[0]?></title>
	<link rel="stylesheet" href="styles/style.css">
	<link rel="icon" href="../media/icon.png">
</head>
<body>
<center>
	<div id="app">
		<div id="wrapper">
			<div id="login">
				<form method="post" action="login.lib.php">
					<h1><?=$LOCAL[1]?></h1>
					<p>
						<label data-icon="u"><?=$LOCAL[2]?>:</label>
						<input name="uname" required placeholder="<?=$LOCAL[5]?>">
					</p>
					<p>
						<label data-icon="p"><?=$LOCAL[3]?>:</label>
						<input name="upass" required type="password" placeholder="<?=$LOCAL[6]?>">
					</p>
					<?if(isset($_GET['login_attempt'])){?>
						<div id="login-failed"><?=$LOCAL[7]?></div>
					<?}?>
					<p>
						<input  id="keep-login" type="checkbox" name="loginkeeping">
						<label for="keep-login"><?=$LOCAL[4]?></label>
					</p>
					<p id="login-button">
						<button><?=$LOCAL[1]?></button>
					</p>
				</form>
			</div>
		</div>
	</div>
</center>
</body>
</html>