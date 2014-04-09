<?
require '../local/detect.lib.php';

$lang = detectLang();

require "local/$lang.php";

$attempt = isset($_GET['login']) ? $_GET['login'] : null;
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
					<?if($attempt == 'nouser'){?>
						<div id="login-failed"><?=$LOCAL[7]?></div>
					<?}
					if(0){?>
						<p>
							<label><?=$LOCAL[8]?>:</label>
							<input name="uns" required placeholder="<?=$LOCAL[9]?>">
						</p>
						<?if($attempt == 'noarea'){?>
							<div id="login-failed"><?=$LOCAL[10]?></div>
						<?}
					}
					else{ ?>
						<input type="hidden" name="uns" value="taskmanager">
					<? } ?>
					<div id="keepme">
						<input  id="keep-login" type="checkbox" name="keepme">
						<label for="keep-login"><?=$LOCAL[4]?></label>
					</div>
					<button><?=$LOCAL[1]?></button>
				</form>
			</div>
		</div>
	</div>
</center>
</body>
</html>