<?

class Components {

	protected $input;

	protected $output;

	function __construct(){
		$this -> input = new DBInput;
		$this -> output = new DBOutput;
	}
}