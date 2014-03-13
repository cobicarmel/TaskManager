<?
class Client{

	private $input;

	private $output;

	private $query;

	private $client_id;

	private $multiData = [
		'phone' => [
			'table' => 'phone_numbers',
			'column' => 'phone_number',
			'values' => []
		],
		'email' => [
			'table' => 'email',
			'column' => 'email_address',
			'values' => []
		]
	];

	function __construct(){
		$this -> input = new DBInput;
		$this -> output = new DBOutput;
	}

	/** PRIVATE METHODS **/

	private function addMultiItem($table, $column, $value){

		$param = [
			'client_id' => $this -> client_id,
			$column => $value
		];

		$this -> input -> query('insert', $table, $param);
	}

	private function getMultiData(){

		foreach($this -> query as $client_id => $client_details){

			foreach($this -> multiData as $key => $params){

				$data = $this -> output -> query("select id, $params[column] from $params[table] where client_id = $client_id");

				$client_details[$key] = [];

				foreach($data as $k => $v)
					$client_details[$key][$v['id']] = $v[$params['column']];

			}

			$this -> query[$client_id] = $client_details;
		}
	}

	private function insertMultiData(){

		foreach($this -> multiData as $v){

			$data = $v['values'];

			$param = ['client_id' => $this -> client_id];

			foreach($data as $item)

				if($item)

					$this -> addMultiItem($v['table'], $v['column'], $item);
		}
	}

	private function parseInData(){

		foreach($this -> multiData as $k => $v){

			if(! empty($_POST[$k]))
				$this -> multiData[$k]['values'] = $_POST[$k];

			unset($_POST[$k]);
		}
	}

	private function phoneToDb(){

		if(gettype($_POST['area-phone']) == 'array'){

			foreach($_POST['area-phone'] as $key => $value)

				if($value && $_POST['phone'][$key])

					$_POST['phone'][$key] = implode('-', [$value, $_POST['phone'][$key]]);
		}
		elseif($_POST['phone'] && $_POST['area-phone'])

			$_POST['phone'] = implode('-', [$_POST['area-phone'], $_POST['phone']]);

		unset($_POST['area-phone']);
	}

	private function toClient(){
		Database::addResponse($this -> query);
	}

	private function toDb(){

		if(isset($_POST['phone']))
			$this -> phoneToDb();

		if(isset($_POST['id'])){

			$this -> client_id = $_POST['id'];

			unset($_POST['id']);
		}

		$this -> parseInData();
	}

	private function updateMultiData(){

		foreach($this -> multiData as $v){

			$data = $v['values'];

			if(gettype($data) != 'array')
				return $data ? $this -> addMultiItem($v['table'], $v['column'], $data): null;

			$keys = array_keys($data);

			foreach($keys as $key){

				$param = [$v['column'] => $data[$key]];

				if(! $data[$key])
					return $this -> input -> query('remove', $v['table'], null, "where id = $key");

				$this -> input -> query('update', $v['table'], $param, "where id = $key");
			}
		}
	}

	/** PUBLIC METHODS **/

	function addItem(){

		$this -> toDb();

		foreach($this -> multiData as $v){

			if(empty($v['values'][0]))
				continue;

			$this -> addMultiItem($v['table'], $v['column'], $v['values'][0]);
		}

		$this -> getAll($this -> client_id);
	}

	function edit(){

		$this -> toDb();

		$this -> input -> query('update', 'clients', $_POST, "where id = {$this -> client_id}");

		$this -> updateMultiData();

		$this -> getAll($this -> client_id);
	}

	function getClient($id = null){

		$query = 'select * from Clients';

		if($id)
			$query .= ' ' . Database::parseMultiWhere('id', $id);

		$query .= ' order by last_name, first_name';

		$this -> query = Database::groupArray('id', $this -> output -> query($query));

		$this -> getMultiData();

		return $this -> query;
	}

	function getAll($id = null){

		$this -> getClient($id);

		$this -> toClient();
	}

	function newClient(){

		$this -> toDb();

		$this -> input -> query('insert', 'clients', $_POST);

		$this -> client_id = $this -> input -> sql -> insert_id;

		$this -> insertMultiData();

		$this -> getAll($this -> client_id);
	}

	function remove(){
		$this -> input -> query('remove', 'clients', null, "where id = $_POST[id]");
	}

	function search(){

		$this -> toDb();

		foreach($_POST as $key => $value){
			if($value)
				$_POST[$key] = $value . '%';
			else
				unset($_POST[$key]);
		}

		$stack = [];

		$query = 'select Clients.id, first_name, last_name from Clients';

		foreach($this -> multiData as $v){

			$search = $v['values'][0];

			if($search){

				$stack[$v['table'] . '.' . $v['column']] = $search . '%';

				$query .= " join $v[table] on Clients.id = $v[table].client_id";
			}
		}

		$query .= ' where ';

		$values = array_merge($_POST, $stack);

		$query .= Database::parseMultiCondition($values, 'like', '&&');

		$this -> query = $this -> output -> query($query);

		$this -> toClient();
	}
}