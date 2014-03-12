<?

require 'Authorization.lib.php';

date_default_timezone_set('Asia/Jerusalem');

require 'local/detect.lib.php';

define('LANG', detectLang());

define('DATE_FORMAT', 'd/m/Y');

define('TIME_FORMAT', 'H:i:s');