<?

class Task extends Components{

	private $data;

	private $currentDate;

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

		if(! $this -> data)
			return;

		$result = [];

		foreach($this -> data as $key => $value){

			$date = DTime::DBToClient($value['starttime'])[0];

			if(empty($result[$date]))
				$result[$date] = [];

			$result[$date][$key] = $value;
		}

		Database::addResponse($result);
	}

	function addTask($data){
		$this -> input -> query('insert', 'tasks', $data);
	}

	function addTaskTypes(){

		$this -> input -> query('insert', 'tasktypes', $_POST);

		$this -> listTaskTypes();
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

		$this -> addTask($_POST);

		$this -> getDay();
	}

	function editTask(){

		$this -> prepareData();

		$id = $_POST['id'];

		unset($_POST['id']);

		$this -> input -> query('update', 'tasks', $_POST, "where id = $id");

		$this -> getDay();
	}

	function editTaskTypes(){

		$this -> input -> query('update', 'tasktypes', $_POST, "where id = $_POST[id]");

		$this -> listTaskTypes();
	}

	function getTask($column, $values, $system = 0){

		$system = isset($_POST['system']) ? $_POST['system'] : $system;

		$where = Database::parseMultiWhere($column, $values);

		$data = $this -> output -> query("select * from tasks where ($where) && system = $system");

		return Database::groupArray('id', $data);
	}

	function getTasks($column, $values, $system = 0){

		$this -> data = $this -> getTask($column, $values, $system);

		$this -> toClient();
	}

	function getDay(){

		$cdate = $this -> currentDate;

		$date = explode(' ', DTime::clientToDB($cdate ? $cdate : $_POST['date']))[0];

		$this -> getTasks("Date(starttime) = '$date' || Date(endtime)", $date);
	}

	function getTaskTypes(){
		$query = $this -> output -> query('select * from tasktypes');
		return Database::groupArray('id', $query);
	}

	function listTaskTypes(){
		Database::addResponse($this -> getTaskTypes());
	}

	function removeTask(){

		$ids = explode(',', $_POST['id']);

		$where = Database::parseMultiWhere('id', $ids);

		$this -> input -> query('remove', 'tasks', null, "where $where");

		$this -> getDay();
	}

	function removeTaskTypes(){

		$this -> input -> query('remove', 'tasktypes', null, "where id = $_POST[id]");

		$this -> listTaskTypes();
	}
}