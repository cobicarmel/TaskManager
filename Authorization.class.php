<?

class Authorization{

	private $usersTable;

	private $users = [];

	private $cookies = [
		'username' => 'uname',
		'password' => 'upass'
	];

	function __construct($usersTable = null){

		if(! $usersTable)
			return;

		$this -> usersTable = $usersTable;
		$this -> input = new DBInput;
		$this -> output = new DBOutput;
		$this -> getAllUsers();
	}

	private function cryptPass($pass){
		return md5(md5(gzcompress($pass)));
	}

	private function decodeCookie($code){
		return base64_decode($code);
	}

	private function encodeCookie($text){
		return base64_encode($text); 
	}

	private function getAllUsers(){
		$this -> users = $this -> output -> query("select * from {$this -> usersTable}");
	}

	private function getCookies(){

		if(empty($_COOKIE[$this -> cookies['username']]) || empty($_COOKIE[$this -> cookies['password']]))
			return false;

		return [
			'username' => $this -> decodeCookie($_COOKIE[$this -> cookies['username']]),
			'password' => $this -> decodeCookie($_COOKIE[$this -> cookies['password']])
		];
	}

	private function setCookies($username, $password, $path){

		$time = time() + (3600 * 24 * 30);

		setcookie($this -> cookies['username'], $this -> encodeCookie($username), $time, $path);

		setcookie($this -> cookies['password'], $this -> encodeCookie($password), $time, $path);
	}

	function createAuth($path){
		$password = $this -> cryptPass($_POST[$this -> cookies['password']]);
		$this -> setCookies($_POST[$this -> cookies['username']], $password, $path);
		header("location: $path");
		exit;
	}

	function detectUser(){

		$cookies = $this -> getCookies();

		if(! $cookies)
			return;

		foreach($this -> users as $user)
			if($cookies['username'] == $user['username'] && $cookies['password'] == $user['password'])
				return $user;
	}

	function logout(){
		foreach($_COOKIE as $key => $value)
			setcookie($key, null, time());
	}

}