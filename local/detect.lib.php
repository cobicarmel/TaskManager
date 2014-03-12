<?

function detectLang(){
	$userLang = preg_split('/[^a-z]/', $_SERVER['HTTP_ACCEPT_LANGUAGE']);
	return $userLang[0];
}