<?

class Payment extends Components {

	private $date;

	private $from;

	private $to;

	private $id;

	private $query;

	private $dateValues = ['date', 'from', 'to'];

	private $globValues = ['limit', 'id'];

	private $limit = '0, 10';

	private $table = 'payments';

	function __construct(){
		parent::__construct();
		$this -> init();
	}

	private function init(){

		foreach($this -> globValues as $value)
			if(isset($_POST[$value])){
				$this -> $value = $_POST[$value];
				unset($_POST[$value]);
			}

		foreach($this -> dateValues as $name)
			if(isset($_POST[$name]) && $_POST[$name]){
				$date = DTime::clientToDB($_POST[$name]);
				$this -> $name = explode(' ', $date)[0];
			}
	}

	private function toClient(){

		$data = $this -> query;

		foreach($data as $key => $value)
			$data[$key]['date'] = DTime::DBToClient($value['date'])[0];

		Database::addResponse($data);
	}

	function addPayment(){

		$_POST['date'] = $this -> date;

		$this -> input -> query('insert', $this -> table, $_POST);
	}

	function editPayment(){

		$_POST['date'] = $this -> date;

		$this -> input -> query('update', $this -> table, $_POST, "where id = {$this -> id}");

		$this -> getPayments();
	}

	function getPayments(){

		$queryText = "select id, date, sum, title from {$this -> table} where client = $_POST[client]";

		if($this -> id)
			$queryText .= " && id = {$this -> id}";

		if($this -> from)
			$queryText .= " && date >= '{$this -> from}'";

		if($this -> to)
			$queryText .= " && date <= '{$this -> to}'";

		$queryText .= ' order by date desc';

		if($this -> limit)
			$queryText .= ' limit ' . $this -> limit;

		$this -> query = $this -> output -> query($queryText);

		$this -> toClient();
	}

	function removePayment(){
		$this -> input -> query('remove', $this -> table, null, 'where id = ' . $this -> id);
	}
}