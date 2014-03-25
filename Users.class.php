<?

class Users{

	private $users;

	private $input;

	private $output;

	private $userId;

	function __construct(){
		$this -> input = new DBInput;
		$this -> output = new DBOutput;
	}

	private function getUsers(){
		$query = $this -> output -> query('select * from users');
		$this -> users = Database::groupArray('id', $query);
	}

	private function parseInData(){

		Database::phoneToDb();

		$this -> userId = $_POST['id'];

		if($_POST['password'] && $_POST['password'] == $_POST['re-password'])
			$_POST['password'] = Authorization::cryptPass($_POST['password']);
		else
			unset($_POST['password']);

		unset($_POST['re-password'], $_POST['id']);

		if($_POST['permission'] < ACCESS){
			Database::addError('you do not have access to change this permission level');
			Database::escape();
		}
	}

	private function toClient($users){

		foreach($users as $i => $user)
			unset($users[$i]['password']);

		return $users;
	}

	function addUsers(){

		$this -> parseInData();

		$this -> input -> query('insert', 'users', $_POST);

		Database::addResponse($this -> getRecognized());
	}

	function editUsers(){

		$this -> parseInData();

		$this -> input -> query('update', 'users', $_POST, "where id = {$this -> userId}");

		Database::addResponse($this -> getRecognized());
	}

	function getAll(){
		$this -> getUsers();
		return $this -> users;
	}

	function getRecognized(){

		if(! $this -> users)
			$this -> getUsers();

		$users = array_filter($this -> users, function($user){
			return $user['permission'] >= ACCESS;
		});

		return $this -> toClient($users);
	}

	function removeUsers(){

		$this -> input -> query('remove', 'users', null, "where id = $_POST[id]");

		Database::addResponse($this -> getRecognized());
	}
}