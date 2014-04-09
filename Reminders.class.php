<?

class Reminders{

	private  $id;

	private $input;

	private $output;

	private $data;

	function __construct(){
		$this -> input = new DBInput;
		$this -> output = new DBOutput;
	}

	private function parseInData(){

		if(isset($_POST['id'])){
			$this -> id = $_POST['id'];
			unset($_POST['id']);
		}

		if(empty($_POST['strdate']))
			return;

		$_POST['custom_pre'] = null;

		$datetime = $_POST['strdate'] . ' ' . $_POST['strtime'];

		unset($_POST['strdate'], $_POST['strtime']);

		$_POST['date'] = DTime::clientToDB($datetime);
	}

	private function parseOutData(){

		$data = & $this -> data;

		$data =  Database::groupArray('id', $data);

		foreach($data as $key => $value){
			$datetime = DTime::DBToClient($value['date']);
			$data[$key]['strdate'] = $datetime[0];
			$data[$key]['strtime'] = $datetime[1];
		}
	}

	function addReminders(){
		$this -> parseInData();
		$_POST['user_id'] = USER_ID;
		$this -> input -> query('insert', 'reminders', $_POST);
		Database::addResponse($this -> getAll());
	}

	function editReminders(){
		$this -> parseInData();
		$this -> input -> query('update', 'reminders', $_POST, "where id = {$this -> id} && user_id = " . USER_ID);
		Database::addResponse($this -> getAll());
	}

	function getAll(){
		$this -> data = $this -> output -> query('select * from reminders where user_id = ' . USER_ID . ' order by date');
		$this -> parseOutData();
		return $this -> data;
	}

	function removeReminders(){
		$this -> parseInData();
		$this -> input -> query('remove', 'reminders', null, "where id = {$this -> id} && user_id = " . USER_ID);
		Database::addResponse($this -> getAll());
	}
}