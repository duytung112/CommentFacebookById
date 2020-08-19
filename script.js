var counter = 0;
		$("#start-spam").click(e => {
			let comments = $('#spam-message').val().split('|');
            let targets = $('#spam-target').val().split(',');
            let timer = $('#timer').val()*1000;
			targets.forEach(target => {
				$.get("https://graph.facebook.com/" + target, {
					access_token: $('#access-token').val()
				}).then(userData => {
					$.get("https://graph.facebook.com/fql", {
						access_token: $('#access-token').val(),
						q: "SELECT post_id, actor_id, target_id, message, created_time FROM stream WHERE source_id=" + userData.id + " LIMIT " + $('#spam-limit').val()
					}).then(feed => {
						console.log(feed);
						feed.data.forEach(post => {
							counter ++;
							setTimeout(() => {
								let cmt = comments[~~(Math.random() * comments.length)];
								$.post('https://graph.facebook.com/' + post.post_id + '/comments', {
									access_token: $('#access-token').val(),
									message: cmt,
									attachment_url: $('#spam-attachment').val()
								}).then(() => {
									$('#logText').append('<span style="color: green;">Commented on ' + post.post_id + '</span><br/>');
								}).fail(() => {
									$('#logText').append('<span style="color: red;">Failed to comment on ' + post.post_id + '</span><br/>');
								});
							}, counter * timer);
						});
					});
				});
			});
		});