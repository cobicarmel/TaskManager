<?

abstract class DTime{

	static function timeToDB($time){

		return date('Y-m-d H:i:s', $time);

	}

	static function textToTime($datetime){

		$datetime = explode(' ', $datetime);

		$date = $datetime[0];

		$format = DATE_FORMAT;

		if(isset($datetime[1])){

			$time = $datetime[1];

			if(empty(explode(':', $time)[2]))

				$time .= ':00';

			$date .= ' ' . $time;

			$format .= ' ' . TIME_FORMAT;

		}

		return DateTime::createFromFormat($format, $date) -> getTimestamp();

	}

	static function clientToDB($datetime){

		$time = self::textToTime($datetime);

		return self::timeToDB($time);

	}

	static function DBToClient($dbDateTime){

		$format = DATE_FORMAT . ' ' . TIME_FORMAT;

		$datetime = date($format, strtotime($dbDateTime));

		$datetime = explode(' ', $datetime);

		$time = explode(':', $datetime[1]);

		unset($time[2]);

		$datetime[1] = implode(':', $time);

		return $datetime;
	}
}