/**
 * Created by BAngujo on 12/3/2014.
 */

(function($) {
	$.fn.maneUploader = function(options) {

		var $parent = $(this),
			defaults = {
				url        : '',
				maxSize    : 500, //In Kb
				extensions : ['jpeg', 'png', 'jpg', 'gif'],
				onSuccess  : function(res) {
					alert('Successfully uploaded!\nCheck log!');
					console.log(res);
				},
				onError    : function(jxghr, res, err) {
					alert('Error Encountered!\nCheck log!');
					console.log(res);
				},
				button     : 'uploadBtn',
				file       : 'uploadFile',
				error      : 'uploadError',
				preview    : 'preview',
				width      : 400,
				name       : 'myFile'
			},
			fileData = false,
			fileName = '',
			fileUploaded = false;

		options = $.extend(defaults, options);
		options.width = options.width < 350 ? 350 : options.width;
		options.maxSize = options.maxSize * 1024;

		$parent.css({width : options.width + 'px'});

		var $button = $('#' + options.button, $parent).length ?
				$('#' + options.button, $parent) : $('.' + options.button, $parent),
			$file = $('#' + options.file, $parent).length ?
				$('#' + options.file, $parent) : $('.' + options.file, $parent),
			$preview = $('#' + options.preview, $parent).length ?
				$('#' + options.preview, $parent) : $('.' + options.preview, $parent),
			$error = $('#' + options.error, $parent).length ?
				$('#' + options.error, $parent) : $('.' + options.error, $parent),
			formData = new FormData();
		if($button.length) {
			$button.change(function(e) {
				setError();
				fileName = $button.val();
				fileUploaded = (this.files && this.files[0]) ? this.files[0] : false;
				if(isValidFile()) {
					$file.val(fileName);
					imgPreview(this);
				}
				else {
					console.error('Invalid File Type!');
				}
			});
		}
		else {
			console.error('Button not set!');
		}

		function submit() {
			if(fileUploaded && options.url) {
				formData.append(options.name, fileUploaded);
				$.ajax({
					url         : options.url,
					dataType    : 'json',
					cache       : false,
					contentType : false,
					processData : false,
					data        : formData, // Setting the data attribute of ajax with file_data
					type        : 'post',
					success     : function(jxghr, res, status) {
						if(options.onSuccess && (typeof options.onSuccess == "function")) {
							options.onSuccess(res);
						}
					},
					error       : function(jxghr, res, status) {
						if(options.onError && (typeof options.onError == "function")) {
							options.onError(res);
						}
					}
				});
				formData = new FormData();
			}
			else {
				console.error('Upload File and URL not set!');
			}
		}

		function imgPreview(input) {
			if(input.files && input.files[0]) {
				$preview.html('');
				var reader = new FileReader();

				reader.onload = function(e) {
					var img_holder = $('<div>', {class : 'img-holder horizontal-left'}),
						img = $('<img src="' + e.target.result + '">'),
						details = $('<div>', {class : 'prev-details vertical-middle'}),
						name = $('<span>'),
						cl_btn = $('<a>', {
							href  : 'javascript:void(0);',
							style : 'font-size:18px;text-decoration:none;font-weight: bold;'
						});
					$preview.prepend(
						img_holder.prepend(img)
							.append(details
								.prepend(name.html($(input).val()))
								.prepend(cl_btn.html('Cancel'))));
					cl_btn.click(function(e) {
						var temp = $(this).parent().parent().fadeOut('slow', function() {
							temp.remove();
							clearUpload();
						});
					});
				};

				reader.readAsDataURL(input.files[0]);
			}
		}

		function clearUpload() {
			$preview.fadeOut('slow', function() {
				$preview.html('').fadeIn();
			});
			fileData = false;
			$button.val('');
			$file.val('');
			formData = new FormData();
		}

		function isValidFile() {
			var extension = fileName.replace(/^.*\./, '');
			if(extension == fileName) {
				extension = '';
			}
			else {
				extension = extension.toLowerCase();
			}
			if(-1 == $.inArray(extension, options.extensions)) {
				setError('[' + extension + '] is an invalid File Extension.<br>' +
				'Allowed extensions are; ' + options.extensions.join(', '));
				return false;
			}
			if(fileUploaded.size > options.maxSize) {
				setError('File size is larger than recommended size of ' + bytesToSize(options.maxSize) +
				'<br> Your current upload size is ' + bytesToSize(fileUploaded.size));
				return false;
			}
			return true;
		}

		function setError(msg) {
			msg = msg || false;
			if(!msg) {
				$error.removeClass('the-error').html('');
				return;
			}
			$error.addClass('the-error').html(msg);
		}

		function bytesToSize(bytes, precision) {
			precision = precision || 1;
			var kilobyte = 1024;
			var megabyte = kilobyte * 1024;
			var gigabyte = megabyte * 1024;
			var terabyte = gigabyte * 1024;

			if((bytes >= 0) && (bytes < kilobyte)) {
				return bytes + ' B';

			}
			else if((bytes >= kilobyte) && (bytes < megabyte)) {
				return (bytes / kilobyte).toFixed(precision) + ' KB';

			}
			else if((bytes >= megabyte) && (bytes < gigabyte)) {
				return (bytes / megabyte).toFixed(precision) + ' MB';

			}
			else if((bytes >= gigabyte) && (bytes < terabyte)) {
				return (bytes / gigabyte).toFixed(precision) + ' GB';

			}
			else if(bytes >= terabyte) {
				return (bytes / terabyte).toFixed(precision) + ' TB';

			}
			else {
				return bytes + ' B';
			}
		}

		return {
			submit  : submit,
			inject  : function(data) {
				$.each(data, function(index, element) {
					formData.append(index, element);
				});
			},
			fileSet : function() {
				return fileUploaded && fileName;
			}
		};
	}
})(jQuery);