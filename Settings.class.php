<?

class Settings{

	private $config;

	function __construct(){
		$this -> input = new DBInput;
		$this -> output = new DBOutput;
		$this -> getConfig();
	}

	private function getConfig(){

		$query = $this -> output -> query('select * from config');

		$config = [];

		foreach($query as $set)
			$config[$set['name']] = json_decode($set['value']);

		$this -> config = $config;
	}

	function listConfig(){
		return $this -> config;
	}

	function changeSettings(){

		foreach($_POST as $name => $value)
			$this -> input -> query('update', 'config', ['value' => addslashes(json_encode($value))], "where name = '$name'");
	}
}