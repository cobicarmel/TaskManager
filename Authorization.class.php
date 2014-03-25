<?

require_once 'DB.class.php';

class Authorization{

	private $cookies = [
		'username' => 'uname',
		'password' => 'upass',
		'area' => 'uns'
	];

	private $data;

	public $userClass;

	static function cryptPass($pass){
		return md5(md5(gzcompress($pass)));
	}

	private function decodeCookie($code){
		return base64_decode($code);
	}

	private function encodeCookie($text){
		return base64_encode($text); 
	}

	private function detectUser(){

		require 'Users.class.php';

		$this -> userClass = new Users;

		$users = $this -> userClass -> getAll();

		$data = $this -> data;

		foreach($users as $user)
			if($data['username'] == $user['username'] && $data['password'] == $user['password'])
				return $user;
	}

	private function getCookies(){

		$cookies = [];

		foreach($this -> cookies as $title => $name){
			if(empty($_COOKIE[$name]))
				return false;

			$cookies[$title] = $this -> decodeCookie($_COOKIE[$name]);
		}

		return $cookies;
	}

	function createAuth(){

		$_POST[$this -> cookies['password']] = self::cryptPass($_POST[$this -> cookies['password']]);

		$time = $_POST['keepme'] ? time() + (3600 * 24 * 30) : 0;

		foreach($this -> cookies as $name)
			setcookie($name, $this -> encodeCookie($_POST[$name]), $time, APP_BASE);
	}

	function createWorkSpace(){
	
		$this -> data = $this -> getCookies();

		if(! $this -> data)
			return 'nocookies';

		$db = Database::createSql(DB_AREA . $this -> data['area']);

		if(! $db)
			return 'noarea';

		$user = $this -> detectUser();

		if(! $user)
			return 'nouser';

		return $user;
	}

	function logout(){
		foreach($_COOKIE as $key => $value)
			setcookie($key, null, time(), APP_BASE);
	}
}