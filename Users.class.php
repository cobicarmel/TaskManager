<?

class Users{

	var $users;

	var $input;

	var $output;

	function __construct(){
		$this -> input = new DBInput;
		$this -> output = new DBOutput;
		$this -> getUsers();
	}

	private function getUsers(){
		$this -> users = $this -> output -> query("select * from users");
	}

	function getAll(){
		return Database::groupArray('id', $this -> users);
	}
}