<?php
	header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET,PUT,POST,DELETE,PATCH,OPTIONS');
	header('Content-Type: application/json');
$sqlNewTableUsers = "CREATE TABLE Users (
id INTEGER PRIMARY KEY,
Username TEXT NOT NULL,
Password TEXT,
Contacts TEXT
)"; 

$sqlNewTableChats = "CREATE TABLE Chats (
id INTEGER PRIMARY KEY,
adrFrom TEXT,
adrTo TEXT,
Message VARCHAR(800) NOT NULL
)"; 

function encrypt_decrypt($action, $string) 
    {
        $output = false;
        $encrypt_method = "AES-256-CBC";
        $secret_key = 'TBCHATSERVER123456789012';
        $secret_iv = '1239999888885321232345711';
        // hash
        $key = hash('sha256', $secret_key);    
        // iv - encrypt method AES-256-CBC expects 16 bytes 
        $iv = substr(hash('sha256', $secret_iv), 0, 16);
        if ( $action == 'encrypt' ) {
            $output = openssl_encrypt($string, $encrypt_method, $key, 0, $iv);
            $output = base64_encode($output);
        } else if( $action == 'decrypt' ) {
            $output = openssl_decrypt(base64_decode($string), $encrypt_method, $key, 0, $iv);
        }
        return $output;
    }
	
if (file_exists("chatserver.db")) { //CREATE DATABASE
	$db = new SQLite3('chatserver.db');
} else {
	$db = new SQLite3('chatserver.db');
	$db->querySingle($sqlNewTableUsers);
	$db->querySingle($sqlNewTableChats);
	
	//$db->exec("INSERT INTO CoinSecure(Address, Amount, AmountRGB) VALUES('TotalMarket', '0', 'XXXXXX')");	
	echo "Tables and file created..";
}
	if (!empty($_GET['action'])) { $action = $_GET['action']; } else { $action = ""; }
	
	if ($action == 'register') {
		
		if (!empty($_GET['username'])) { $username = $_GET['username']; } else { $username = ""; }
		if (!empty($_GET['password'])) { $password = $_GET['password']; } else { $password = ""; }
		$idexists = $db->querySingle("SELECT COUNT(Username) AS count FROM Users WHERE Username=='".$username."'");
		if ($idexists < 1) {
	$db->exec("INSERT INTO Users(Username, Password, Contacts) VALUES('".$username."', '".md5($password)."', '')");
		$contactlist = $db->querySingle("SELECT Contacts as vchAmount FROM Users WHERE Username='".$username."'");
	 $contactlist .= 'admin' . ","; 
	 		$contactlistb = $db->querySingle("SELECT Contacts as vchAmount FROM Users WHERE Username='admin'");
	 $contactlistb .= $username . ","; 
	$db->exec("UPDATE Users SET Contacts='".$contactlist."' WHERE Username == '".$username."'");
	$db->exec("UPDATE Users SET Contacts='".$contactlistb."' WHERE Username == 'admin'");
	$response = array("response"=>"registered", "username"=>$username);	
		} else {	$response = array("response"=>"failed", "username"=>$username);	}	
	echo json_encode($response);
	}
	
	if ($action == 'viewcontacts') { //chat.php?action=viewcontacts&username=test12
		if (!empty($_GET['username'])) { $username = $_GET['username']; } else { $username = ""; }
		if (!empty($_GET['password'])) { $password = $_GET['password']; } else { $password = ""; }
	
	if (empty($username)) { exit; }
	$arrayusers = array();
				$idexists = $db->querySingle("SELECT COUNT(Username) AS count FROM Users WHERE Username=='".$username."'");
	if ($idexists < 1) {
	//$db->exec("INSERT INTO Users(Username, Password, Contacts) VALUES('".$username."', '', '')");
	$db->exec("INSERT INTO Users(Username, Password, Contacts) VALUES('".$username."', '".md5($password)."', '')");
	$contactlist = $db->querySingle("SELECT Contacts as vchAmount FROM Users WHERE Username='".$username."'");
	 $contactlist .= 'admin' . ","; 
	 $contactlistb = $db->querySingle("SELECT Contacts as vchAmount FROM Users WHERE Username='admin'");
	 $contactlistb .= $username . ","; 
	$db->exec("UPDATE Users SET Contacts='".$contactlist."' WHERE Username == '".$username."'");
	$db->exec("UPDATE Users SET Contacts='".$contactlistb."' WHERE Username == 'admin'");
	
	} else {
		$pwd = $db->querySingle("SELECT Password as vchAmount FROM Users WHERE Username='".$username."'");
		if ($pwd != md5($password)) { exit; }
	}
	$contactlist = $db->querySingle("SELECT Contacts as vchAmount FROM Users WHERE Username='".$username."'");
		$contacts = explode(",", $contactlist);
	//array_push($arrayusers, $contacts);
	foreach ($contacts as $contact) {
	if (strlen($contact) > 1) {
		$sendmessages = $db->querySingle("SELECT COUNT(adrFrom) AS count FROM Chats WHERE adrFrom=='".$contact."' AND adrTo=='".$username."'");
	array_push($arrayusers, array("user"=>trim($contact), "messages"=>$sendmessages)); } 
	}
	echo json_encode($arrayusers);
	}
	if ($action == 'viewmessage') { //chat.php?action=viewmessage&username=test&adrFrom=test
		if (!empty($_GET['username'])) { $username = $_GET['username']; } else { $username = ""; }
		if (!empty($_GET['adrFrom'])) { $adrFrom = $_GET['adrFrom']; } else { $adrFrom = ""; }
		

$query="SELECT Message,adrFrom,adrTo FROM Chats WHERE adrFrom == '".$username."' OR adrTo== '".$username."'";
$result=$db->query($query);
	$arrchats = array();
while($row= $result->fetchArray()){
	if ($row['adrFrom'] == $username && $row['adrTo'] == $adrFrom || $row['adrTo'] == $username && $row['adrFrom']  == $adrFrom  ) {
		if ($row['adrFrom'] == $username) { $from = $username; } else { $from = $row['adrFrom']; }
		$message = encrypt_decrypt("decrypt", $row['Message']);
		array_push($arrchats, array("chatmessage"=>$message, "from"=>$from));
	}
}
$arrchats = array_reverse($arrchats);
	echo json_encode($arrchats);
	}
	if ($action == 'sendmessage') { //chat.php?action=sendmessage&username=test&sendto=test12&message=HOIII
	if (!empty($_GET['username'])) { $username = $_GET['username']; } else { $username = ""; }
	if (!empty($_GET['password'])) { $password = $_GET['password']; } else { $password = ""; }
	if (!empty($_GET['sendto'])) { $sendto = $_GET['sendto']; } else { $sendto = ""; }
	if (!empty($_GET['message'])) { $message = $_GET['message']; } else { $message = ""; }
		$messageENC = encrypt_decrypt("encrypt", $message);
	if (strlen($message) > 0) {
	$db->exec("INSERT INTO Chats(adrFrom, adrTo, Message) VALUES('".$username."', '".$sendto."', '".$messageENC."')");
	}
	$response = array("response"=>"sendmessage", "to"=>$sendto, "message"=>$message);		
	echo json_encode($response);
	}
	
	if ($action == 'addcontact') { //chat.php?action=addcontact&newcontact=test123&username=test
	if (!empty($_GET['username'])) { $username = $_GET['username']; } else { $username = ""; }
	if (!empty($_GET['password'])) { $password = $_GET['password']; } else { $password = ""; }
				$pwd = $db->querySingle("SELECT Password as vchAmount FROM Users WHERE Username='".$username."'");
		if ($pwd != md5($password)) { exit; }
		
	if (!empty($_GET['newcontact'])) { $newcontact = $_GET['newcontact']; } else { $newcontact = ""; }
	$idexists = $db->querySingle("SELECT COUNT(Username) AS count FROM Users WHERE Username=='".$newcontact."'");
	if ($idexists > 0) {
			$pwd = $db->querySingle("SELECT Password as vchAmount FROM Users WHERE Username='".$username."'");
		if ($pwd != md5($password)) { exit; }
		$contactlistb = $db->querySingle("SELECT Contacts as vchAmountb FROM Users WHERE Username='".$newcontact."'");
	$contactlist = $db->querySingle("SELECT Contacts as vchAmount FROM Users WHERE Username='".$username."'");
	if (strlen($newcontact) > 0 ) { $contactlist .= $newcontact . ",";   $contactlistb .= $username . ",";}
	$db->exec("UPDATE Users SET Contacts='".$contactlist."' WHERE Username == '".$username."'");
	$db->exec("UPDATE Users SET Contacts='".$contactlistb."' WHERE Username == '".$newcontact."'");
	$response = array("response"=>"useradded", "username"=>$newcontact);	
	} else {
	$response = array("response"=>"failed", "username"=>$newcontact);	
	}
	echo json_encode($response);
	}
	
	?>