<?php
/**
 * Created by PhpStorm.
 * User: BAngujo
 * Date: 12/3/2014
 * Time: 8:49 AM
 */
header('Content-Type:application/json;charset=utf-8;');
$result = array();
if (isset($_FILES)) {
	//$result = array_merge($result, $_FILES);
	$target_path = "uploads/";

	$target_path = $target_path . basename($_FILES['myFile']['name']);

	if (move_uploaded_file($_FILES['myFile']['tmp_name'], $target_path)) {
		$result['msg'] = "The file " . basename($_FILES['myFile']['name']) . " has been uploaded";
	} else {
		$result['msg'] = "There was an error uploading the file, please try again!";
	}
}

echo json_encode($result);