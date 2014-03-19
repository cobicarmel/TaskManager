<?

class Task{

	private $input;

	private $output;

	private $data;

	private $currentDate;

	function __construct(){
		$this -> input = new DBInput;
		$this -> output = new DBOutput;
	}

	private function prepareData(){

		$requires = [
			'title' => 2,
			'starttime' => 3,
			'endtime' => 4
		];

		Database::checkRequires($requires, $_POST);

		$this -> currentDate = $_POST['date'];

		unset($_POST['date']);

		$_POST['starttime'] = DTime::clientToDB($_POST['starttime']);
		$_POST['endtime'] = DTime::clientToDB($_POST['endtime']);

	}

	private function toClient(){

		$data = Database::groupArray('id', $this -> data);

		$result = [];

		if(! $data)
			return;

		foreach($data as $key => $value){

			$date = DTime::DBToClient($value['starttime'])[0];

			if(empty($result[$date]))
				$result[$date] = [];

			$result[$date][$key] = $value;
		}

		Database::addResponse($result);
	}

	function changeTime(){

		$this -> currentDate = $_POST['date'];

		foreach($_POST['data'] as $key => $value){

			$meeting = $_POST['data'][$key];

			$meeting['starttime'] = DTime::clientToDB($meeting['starttime']);

			$meeting['endtime'] = DTime::clientToDB($meeting['endtime']);

			$this -> input -> query('update', 'tasks', $meeting, "where id = $key");
		}

		$this -> getDay();
	}

	function clientHistory(){

		$this -> data = $this -> output -> query("select * from tasks where client_id = $_POST[id] and starttime < now()");

		$this -> toClient();
	}

	function createTask(){

		$this -> prepareData();

		$this -> input -> query('insert', 'tasks', $_POST);

		$this -> getDay();
	}

	function editTask(){

		$this -> prepareData();

		$id = $_POST['id'];

		unset($_POST['id']);

		$this -> input -> query('update', 'tasks', $_POST, "where id = $id");

		$this -> getDay();
	}

	function editType(){

		$this -> input -> query('update', 'tasktypes', $_POST, "where id = $_POST[id]");

		$this -> getTypes();
	}

	function getTasks($column, $values){

		$where = Database::parseMultiWhere($column, $values);

		$this -> data = $this -> output -> query("select * from tasks where ($where) && system = $_POST[system]");

		$this -> toClient();
	}

	function getTypes(){

		$query = $this -> output -> query('select * from tasktypes');

		$query = Database::groupArray('id', $query);

		Database::addResponse($query);
	}

	function getDay(){

		$cdate = $this -> currentDate;

		$date = explode(' ', DTime::clientToDB($cdate ? $cdate : $_POST['date']))[0];

		$this -> getTasks("Date(starttime) = '$date' || Date(endtime)", $date);
	}

	function removeTask(){

		$ids = explode(',', $_POST['id']);

		$where = Database::parseMultiWhere('id', $ids);

		$this -> input -> query('remove', 'tasks', null, "where $where");

		$this -> getDay();
	}

	function removeType(){

		$this -> input -> query('remove', 'tasktypes', null, "where id = $_POST[id]");

		$this -> getTypes();
	}
}