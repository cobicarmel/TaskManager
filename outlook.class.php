<?

class Outlook{

	private $data;

	private $name;

	private function flush(){

		header("Content-type:text/calendar");
		header('Content-Disposition: attachment; filename="' . $this -> name . '.ics"');
		Header('Content-Length: ' . strlen($this -> data));
		Header('Connection: close');

		echo $this -> data;

		exit;
	}

	private function setMessage($task){

		$data = "
			BEGIN: VCALENDAR
			VERSION: 2.0
			METHOD: PUBLISH
			BEGIN: VEVENT
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
			TM_SYSTEM:  $task[system]
			CLASS: PUBLIC
			BEGIN: VALARM
			TRIGGER: -PT10080M
			ACTION: DISPLAY
			DESCRIPTION: Reminder
			END: VALARM
			END: VEVENT
			END: VCALENDAR";

		$this -> data = preg_replace('/\t/', '', $data);
	}

	function exportTask($task_id){
		$task = (new Task) -> getTask('id', $task_id)[$task_id];
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

		$assocData = [];

		foreach($data as $row){
			$row = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $row);
			if($row != ''){
				$rowData = explode(':', $row);
				$assocData[$rowData[0]] = trim($rowData[1]);
			}
		}

		$requires = ['DTSTART', 'DTEND', 'SUMMARY', 'TM_SYSTEM'];

		Database::checkRequires($requires, $assocData);

		$taskData = [
			'title' => $assocData['SUMMARY'],
			'content' => $assocData['DESCRIPTION'],
			'place' => $assocData['LOCATION'],
			'starttime' => $assocData['DTSTART'],
			'endtime' => $assocData['DTEND'],
			'client_id' => $assocData['TM_CLIENT'],
			'system' => $assocData['TM_SYSTEM']
		];
	}
}