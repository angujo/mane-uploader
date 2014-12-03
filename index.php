<!DOCTYPE html>
<html>
<head lang="en">
	<meta charset="UTF-8">
	<title></title>
	<link rel="stylesheet" type="text/css" href="jquery.uploader.css">
	<script language="JavaScript" src="jquery.js"></script>
	<script language="JavaScript" src="jquery.uploader.js"></script>
</head>
<body>
<div id="mane-upload" class="upload-holder">
	<div class="fileUpload">
		<div class="horizontal-spaced">
			<input id="uploadFile" placeholder="Choose File" disabled="disabled"/>

			<div class="button">
				<span>Upload</span>
				<input id="uploadBtn" type="file" class="upload"/>
			</div>
		</div>
	</div>
	<div class="uploadError"></div>
	<div id="preview" class="vertical-down preview">

	</div>
</div>
<button id="upload">Try Upload</button>
<script>
	$(function(){
		var uploader=$('#mane-upload').maneUploader({url:'uploader.php'});
		$('button#upload').click(function(e){
			e.preventDefault();
			uploader.inject({my:'oh','tell':'me'});
			uploader.submit();
		})
	})
</script>
</body>
</html>