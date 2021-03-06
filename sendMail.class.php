<?

require('../PHPMailer/class.phpmailer.php');

class sendMail{

	private $mail;

	private $user;

	private $clients;

	private $output;

	private $message;

	private $config;

	function __construct(){

		$this -> mail = new PHPMailer();

		$this -> output = new DBOutput;

		$this -> config = (new Settings) -> listConfig();

		$this -> setUser();

		$this -> getMessage();

		$this -> setSettings();

		$this -> setClients();

	}

	private function getMessage(){
		$this -> message = $this -> output -> query("select subject, message from mail_messages where id = $_POST[msgtype]")[0];
	}

	private function setClients(){

		$requires = [
			'id' => 1,
			'msgtype' => 2
		];

		Database::checkRequires($requires, $_POST);

		require 'Client.class.php';

		$this -> clients = (new Client) -> getClient($_POST['id']);
	}

	private function parseMessage($id){

		$client = $this -> clients[$id];

		$replacements = [
			'%recipient%' => $client['first_name'],
			'%sender_name%' => $this -> config['mail_sender_name']
		];

		$message = str_replace(
			array_keys($replacements),
			array_values($replacements),
			$this -> message['message']
		);

		$this -> mail -> MsgHTML($message);
	}

	private function setRecipient($id){

		$this -> mail -> ClearAddresses();

		$client = $this -> clients[$id];

		$fullname = implode(' ', [$client['first_name'], $client['last_name']]);

		foreach($client['email'] as $email)
			$this -> mail -> AddAddress($email, $fullname);

	}

	private function setSettings(){

		/** server settings **/

		$this -> mail -> IsSMTP();
		$this -> mail -> SMTPAuth = true;
		$this -> mail -> Host = 'smtp.gmail.com';
		$this -> mail -> Port = 587;
		$this -> mail -> SMTPSecure = 'tls';
		$this -> mail -> Username = $this -> user;

		/** message settings **/

		$this -> mail -> CharSet = 'UTF-8';
		$this -> mail -> IsHTML(true);
		$this -> mail -> SetFrom($this -> user, $this -> config['mail_sender_name']);
		$this -> mail -> Subject = $this -> message['subject'];
	}

	private function setUser(){
		$this -> user = $this -> config['mail_sender_address'];
		$this -> mail -> Password = $this -> config['mail_sender_pass'];
	}

	function send(){

		$result = [
			'success' => 0,
			'failed' => 0
		];

		foreach($this -> clients as $id => $client){

			$this -> setRecipient($id);

			$this -> parseMessage($id);

			$send = $this -> mail -> Send();

			$result[$send ? 'success' : 'failed']++;
		}

		Database::addResponse($result);
	}
}