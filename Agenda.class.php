<?

class Agenda{

	function __construct(){
		$this -> input = new DBInput;
		$this -> output = new DBOutput;

		if(isset($_POST['date'])){
			$date = Dtime::clientToDB($_POST['date']);
			$_POST['date'] = explode(' ', $date)[0];
		}
	}

	function addAgenda(){

		$this -> input -> query('insert', 'agenda', $_POST);

		$this -> getAll();
	}

	function addSpecial(){

		$this -> input -> query('insert', 'special', $_POST);

		$this -> getSpecial();
	}

	function getAll(){

		$data = $this -> output -> query("select * from agenda where system = $_POST[system]");

		Database::addResponse($data);

	}

	function getSpecial(){

		$data = $this -> output -> query("select * from special where date = Date('$_POST[date]') && system = $_POST[system]");

		$cdate = Dtime::DBToClient($_POST['date'])[0];

		foreach($data as $key => $value)
			$data[$key]['date'] = $cdate;

		$data = Database::groupArray('date', $data);

		if(isset($data[$cdate]))
			$data[$cdate] = Database::groupArray('original', $data[$cdate]);

		Database::addResponse($data);

	}

	function remove(){

		$this -> input -> query('remove', 'agenda', null, "where id = $_POST[id]");

		$this -> getAll();
	}

	function updateSpecial(){

		$where = [
			'date' => $_POST['date'],
			'original' => $_POST['original']
		];

		unset($_POST['original']);

		$where = Database::parseMultiCondition($where, '=', '&&');

		$this -> input -> query('update', 'special', $_POST, " where $where");

		$this -> getSpecial();
	}

	function updateAgenda(){

		$this -> input -> query('update', 'agenda', $_POST, "where id = $_POST[id]");

		$this -> getAll();
	}

}