<?

class Access{

	private $actions;

	function __construct(){
		$this -> input = new DBInput;
		$this -> output = new DBOutput;
		$this -> getActions();
	}

	private function getActions(){

		$query = $this -> output -> query('select * from action_authorized where access >= ' . ACCESS);

		$actions = Database::groupArray('subject', $query);

		foreach($actions as $subject => $items){
			$types = Database::groupArray('action', $items);
			$actions[$subject] = $types;
		}

		$this -> actions = $actions;
	}

	function changeAccess(){
		foreach($_POST['values'] as $row)
			$this -> input -> query('update', 'action_authorized', ['access' => $row['access']], "where id = $row[id]");
	}

	function hasAction($subject, $action = null){

		$hasSubject = isset($this -> actions[$subject]);

		if(! $hasSubject)
			return false;

		if(! $action)
			return true;

		$found = false;

		foreach($this -> actions[$subject] as $key => $n){
			$keys = explode(',', $key);
			if(in_array($action, $keys)){
				$found = true;
				break;
			}
		}

		return $found;
	}

	function listActions(){
		return $this -> actions;
	}

	function writeSettings(){

		global $LOCAL;

		$subTitles = [
			'Access' => 98,
			'Agenda' => 1,
			'Client' => 2,
			'Payment' => 51,
			'Settings' => 3,
			'sendMail' => 30,
			'Reminders' => 50,
			'Task' => 8,
			'Users' => 89
		];

		foreach($this -> actions as $subject => $actions){?>
			<h4><?=$LOCAL[$subTitles[$subject]]?></h4>
			<div>
			<table class="data-table">
				<thead>
					<tr>
						<th style="width: 40%"><?=$LOCAL[122]?></th>
						<th><?=$LOCAL[93]?></th>
						<th><?=$LOCAL[94]?></th>
						<th><?=$LOCAL[95]?></th>
					</tr>
				</thead>
				<tbody>
				<?foreach($actions as $action){?>
					<tr id="sa-tr<?=$action['id']?>">
						<td><?=$LOCAL[$action['title']]?></td>
						<td>
							<input type="checkbox" class="auto-center inline-input">
						</td>
						<td>
							<input type="checkbox" class="auto-center inline-input">
						</td>
						<td>
							<input type="checkbox" class="auto-center inline-input">
						</td>
					</tr>
				<?}?>
				</tbody>
			</table>
			</div>
		<?}
	}
}