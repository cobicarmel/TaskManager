<?

abstract class Database{

	private static $response = [];

	private static $host = 'localhost';

	private static $dbuser = 'root';

	private static $dbpass = '';

	static $sql;

	static function createSql($dbname){

		self::$sql = new mysqli(self::$host, self::$dbuser, self::$dbpass, $dbname);

		if(! self::$sql)
			return;

		self::$sql -> set_charset('utf8');

		return true;
	}

	static function addResponse($key, $value = null){
		if($value === null){
			$value = $key;
			$key = 'data';
		}

		if(empty(self::$response[$key]))
			self::$response[$key] = [];

		self::$response[$key][] = $value;
	}

	static function addError($error){

		if(empty(self::$response['error']))
			self::$response['error'] = [];

		self::$response['error'][] = $error;
	}

	static function checkRequires($requires, $data){

		$errors = 0;

		foreach($requires as $key => $value)
			if(empty($data[$key]) || ! $data[$key]){
				self::addError($value);
				$errors++;
			}

		if($errors)
			self::escape();
	}

	static function escape(){
		self::getResponse(true);
		exit;
	}

	static function getResponse($print = false){
		if($print)
			echo json_encode(self::$response);
		else
			return self::$response;
	}

	static function groupArray($key, $array){

		$result = [];

		foreach($array as $k => $v){

			if(gettype($v) != 'array'){
				if($k == $key){
					$title = $v;
					unset($array[$k]);
					$result[$title] = $array;
					return $result;
				}
				continue;
			}

			$title = $v[$key];

			unset($v[$key]);

			if(isset($result[$title])){

				if(gettype($result[$title]) != 'array' || array_values($result[$title]) !== $result[$title])
					$result[$title] = [$result[$title]];

				$result[$title][] = $v;
			}
			else
				$result[$title] = $v;
		}

		return $result;
	}

	static function parseMultiCondition($array, $logic = '=', $delimiter =","){

		$stack = [];

		foreach($array as $key => $value){
	
				if(! strstr($key, '.'))

					$key = "`$key`";

			$stack[] = "$key $logic '$value'";
		}

		return implode(' ' . $delimiter . ' ', $stack);
	}

	static function parseMultiWhere($column, $values){

		$where = '';

		if(gettype($values) == 'array'){

			$stack = [];

			foreach($values as $value)
				$stack[] = "$column = '$value'";

			$where = implode(' || ', $stack);
		}
		else
			$where = "$column = '$values'";

		return $where;
	}

	static function  phoneToDb(){

		if(gettype($_POST['area-phone']) == 'array'){

			foreach($_POST['area-phone'] as $key => $value)

				if($value && $_POST['phone'][$key])

					$_POST['phone'][$key] = implode('-', [$value, $_POST['phone'][$key]]);
		}
		elseif($_POST['phone'] && $_POST['area-phone'])

			$_POST['phone'] = implode('-', [$_POST['area-phone'], $_POST['phone']]);

		unset($_POST['area-phone']);
	}
}

abstract class DBAction{

	protected $table;

	protected $data;

	protected $result;

	function __construct(){
		$this -> sql = Database::$sql;
	}
 
	protected function makeQuery($queryText){

		Database::addResponse('query', $queryText);

		$this -> result = $this -> sql -> query($queryText);

		if(! $this -> result){

			Database::addError($this -> sql -> error);

			Database::escape();
		}
	}
}

class DBInput extends DBAction{

	function __destruct(){
		Database::addResponse('affected_rows', $this -> sql -> affected_rows);
	}

	private function insert(){

		$columns = '`';
		$columns .= implode('`, `', array_keys($this -> data));
		$columns .= '`';

		$values = "'";
		$values .= implode("', '", array_values($this -> data));
		$values .= "'";

		return "insert into {$this -> table} ($columns) values ($values)";
	}

	private function remove(){

		return "delete from {$this -> table}";

	}

	private function update(){

		$params = Database::parseMultiCondition($this -> data);

		return "update {$this -> table} set $params";
	}

	function query($type, $table, $data, $where = null){

		$this -> table = $table;

		$this -> data = $data;

		$queryText = $this -> $type() . ' ' . $where;

		$queryText = str_replace("''", "null", $queryText);

		$this -> makeQuery($queryText);
	}

}

class DBOutput extends DBAction{

	private function parse($row){
		foreach($row as $key => $value)
			$row[$key] = str_replace("null", "''", $value);

		return $row;
	}

	function query($queryText){

		$this -> makeQuery($queryText);

		$data = [];

		while($row = $this -> result -> fetch_assoc())
			$data[] = $this -> parse($row);

		return $data;

	}
}