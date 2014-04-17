<?

function detectLang(){

    $userLang = 'en';

    if(isset($_SERVER['HTTP_ACCEPT_LANGUAGE']))
	    $userLang = preg_split('/[^a-z]/', $_SERVER['HTTP_ACCEPT_LANGUAGE'])[0];

	return $userLang;
}