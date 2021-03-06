<?
class Client extends Components {

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

	/** PRIVATE METHODS **/

	private function addMultiItem($table, $column, $value){

		$param = [
			'client_id' => $this -> client_id,
			$column => $value
		];

		$this -> input -> query('insert', $table, $param);
	}

	private function getMultiData(){

		$ids = array_keys($this -> query);

		$where = Database::parseMultiWhere('client_id', $ids);

		foreach($this -> multiData as $key => $values){

			$data = $this -> output -> query("select * from $values[table] where $where");

			foreach($data as $item){
				if(empty($this -> query[$item['client_id']][$key]))
					$this -> query[$item['client_id']][$key] = [];

				$this -> query[$item['client_id']][$key][$item['id']] = $item[$values['column']];
			}
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

	private function toClient(){
		Database::addResponse($this -> query);
	}

	private function toDb(){

		if(isset($_POST['phone']))
			Database::phoneToDb();

		if(isset($_POST['id'])){

			$this -> client_id = $_POST['id'];

			unset($_POST['id']);
		}

		$this -> parseInData();
	}

	private function updateMultiData(){

		foreach($this -> multiData as $v){

			$data = $v['values'];

			if(gettype($data) != 'array'){

				if($data)
					$this -> addMultiItem($v['table'], $v['column'], $data);

				continue;
			}

			$keys = array_keys($data);

			foreach($keys as $key){

				$param = [$v['column'] => $data[$key]];

				if(! $data[$key])
					$this -> input -> query('remove', $v['table'], null, "where id = $key");
				else
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

		$query = 'select * from clients';

		if($id)
			$query .= ' where ' . Database::parseMultiWhere('id', $id);

		$query .= ' order by last_name, first_name';

		$this -> query = Database::groupArray('id', $this -> output -> query($query));

		if(! empty($this -> query))
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

		$query = 'select clients.id, first_name, last_name from clients';

		foreach($this -> multiData as $v){

			$search = $v['values'][0];

			if($search){

				$stack[$v['table'] . '.' . $v['column']] = $search . '%';

				$query .= " join $v[table] on clients.id = $v[table].client_id";
			}
		}

		$query .= ' where ';

		$values = array_merge($_POST, $stack);

		$query .= Database::parseMultiCondition($values, 'like', '&&');

		$this -> query = $this -> output -> query($query);

		$this -> toClient();
	}
}