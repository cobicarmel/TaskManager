<?

class Outlook{

	private $message;

	private $name;

	private $task;

	function __construct(){
		require 'Task.class.php';
		$this -> task = new Task;
	}

	private function flush(){

		header("Content-type:text/calendar");
		header('Content-Disposition: attachment; filename="' . $this -> name . '.ics"');
		Header('Content-Length: ' . strlen($this -> message));
		Header('Connection: close');

		echo $this -> message;

		exit;
	}

	private function setMessage($task){

		$data = "
			BEGIN: VCALENDAR
			VERSION: 2.0
			METHOD: PUBLISH
			BEGIN:VEVENT
			DTSTART: " . date("Ymd\THis\Z", strtotime($task['starttime'])) . "
			DTEND: " . date("Ymd\THis\Z", strtotime($task['endtime'])) . "
			LOCATION: $task[place]
			TRANSP: OPAQUE
			SEQUENCE: 0
			UID:
			DTSTAMP:" . date("Ymd\THis\Z") . "
			SUMMARY: $task[title]
			DESCRIPTION: $task[content]
			PRIORITY: 1
			TM_CLIENT: $task[client_id]
			CLASS: PUBLIC
			BEGIN: VALARM
			TRIGGER: -PT10080M
			ACTION: DISPLAY
			DESCRIPTION: Reminder
			END: VALARM
			END: VEVENT
			END: VCALENDAR";

		$this -> message = preg_replace('/\t/', '', $data);
	}

	private function insertTask($data){

		$assocData = [];

		foreach($data as $row){
			$row = preg_replace('/\r\n?/', '', $row);

			$rowData = explode(':', $row);

			if(count($rowData) < 2)
				continue;

			$key = explode(';', $rowData[0])[0];

			$value = trim($rowData[1]);

			if(! isset($assocData[$key]))
				$assocData[$key] = $value;
		}

		$requires = ['DTSTART', 'DTEND', 'SUMMARY'];

		Database::checkRequires(array_flip($requires), $assocData, false);

		$taskData = [
			'title' => $assocData['SUMMARY'],
			'starttime' => DTime::timeToDB(strtotime($assocData['DTSTART'])),
			'endtime' => DTime::timeToDB(strtotime($assocData['DTEND']))
		];

		$optionals = [
			'DESCRIPTION' => 'content',
			'LOCATION' => 'place',
			'TM_CLIENT' => 'client_id'
		];

		foreach($optionals as $key => $value)
			if(isset($assocData[$key]))
				$taskData[$value] = $assocData[$key];

		$taskData['system'] = $_POST['system'];

		$this -> task -> addTask($taskData);
	}

	function exportTask($task_id){
		$task = $this -> task -> getTask('id', $task_id)[$task_id];
		$this -> name = $task['title'];
		$this -> setMessage($task);
		$this -> flush();
	}

	function importTask(){

		$file = $_FILES['file'];
		$fileName = $file['tmp_name'];
		$fileExtension = pathinfo($file['name'], PATHINFO_EXTENSION);

		if($fileExtension != 'ics'){
			Database::addError(5);
			Database::escape();
		}

		$fileContent = file_get_contents($fileName);

		$data = preg_split('/\r\n/', $fileContent);

		$starts = array_keys($data, 'BEGIN:VEVENT');

		$ends = array_keys($data, 'END:VEVENT');

		foreach($starts as $key => $value){
			$endLength = $ends[$key] - $value;
			$taskData = array_slice($data, $value, $endLength);

			$this -> insertTask($taskData);
		}

		$this -> task -> getDay();
	}
}