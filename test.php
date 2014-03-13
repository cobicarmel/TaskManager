<?
//echo md5(md5(gzcompress($_GET['text'])));

require('../PHPMailer/class.phpmailer.php');
$mail = new PHPMailer();

// הגדרות
$mail->IsSMTP();
$mail->SMTPDebug  = 2;
$mail->SMTPAuth   = true;
$mail->Host       = 'smtp.gmail.com';
$mail->Port       = 587;
$mail->Username   = 'jzaltzberg@gmail.com';
$mail->Password   = '1712Hgec';
$mail->SMTPSecure = 'tls';
$mail->CharSet = 'UTF-8';
// סוף הגדרות

$mail->IsHTML(true);
$mail->SetFrom('jzaltzberg@gmail.com', 'מנהל ראשי');
$mail->AddReplyTo('jzaltzberg@gmail.com','מנהל ראשי');
$mail->Subject = 'בדיקת אימייל ראשון';
$mail->MsgHTML('שלום <br/><br/> זהו האימייל <b>הראשון</b> שלי');
$mail->AltBody = 'שלום \n\n זהו האימייל הראשון שלי';

$address = 'cobicarmel2@gmail.com';
$mail->AddAddress($address, 'משתמש חדש');

if(! $mail->Send()) {
   echo 'הודעה נשלחה';
   echo 'שגיאה: ' . $mail->ErrorInfo;
}
else {
   echo 'הודעה נשלחה';
}