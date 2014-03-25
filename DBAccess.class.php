<?

class DBAccess{

	private $actions;

	function __construct(){
		$this -> output = new DBOutput;
		$this -> getActions();
	}

	private function getActions(){

		$query = $this -> output -> query('select subject, action from action_authorized where access >= ' . ACCESS);

		$actions = Database::groupArray('subject', $query);

		foreach($actions as $subject => $items){
			$types = Database::groupArray('action', $items);
			$actions[$subject] = array_keys($types);
		}

		$this -> actions = $actions;
	}

	function hasAction($subject, $action = null){
		return isset($this -> actions[$subject]) && ($action ? in_array($action, $this -> actions[$subject]) : true);
	}

	function listActions(){
		return $this -> actions;
	}
}