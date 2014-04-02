<?

class Reminders{

	private $input;

	private $output;

	private  $data;

	function __construct(){
		$this -> input = new DBInput;
		$this -> output = new DBOutput;
		$this -> getReminders();
	}

	private function parseInData(){

	}

	private function parseOutData(){

		$data = & $this -> data;

		$data =  Database::groupArray('id', $data);

		foreach($data as $key => $value){
			$datetime = DTime::DBToClient($value['date']);
			$data[$key]['date'] = $datetime[0];
			$data[$key]['time'] = $datetime[1];
		}
	}

	private function getReminders(){
		$this -> data = $this -> output -> query('select * from reminders');
		$this -> parseOutData();
	}

	function editReminders(){
		$this -> parseInData();
		$this -> input -> query('update', 'reminders', $_POST, "where id = {$this -> userId}");
	}

	function getAll(){
		return $this -> data;
	}
}