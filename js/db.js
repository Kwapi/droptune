function db_getSongReviews(songSpotifyID){
    var args = {
        spotifyId:songSpotifyID
    };

    $.getJSON("db/getReview.php",args,
        function(data){
            dsp_db_songReviews(data);
            console.log("DB - getSongReviews - success");
        },
        function(data){
            alert("DB doesn't work");
        })

}

function dsp_db_songReviews(reviews){
    var $songReviewsList = $('#songReviewsList');

    //clear first
    $songReviewsList.html("");

    if(reviews.length==0){
        $songReviewsList.html("No reviews available");
    }

    var reviewRatings = [];

    for (var i=0; i< reviews.length; i++){
        var review = reviews[i];

        //show only the reviews that contain text
        if(review.text!="") {
            var template = $('#songReviewTemplate').html();
            var output;

            output = Mustache.render(template, review);

            $songReviewsList.append(output);




            reviewRatings.push(review.rating);




        }
    }

    $('.reviewRating').barrating('show', {
            theme: 'bars-square',
            showValues: true,
            showSelectedRating: false,
            readonly: true,
        }
    );

    // have to be set after barrating is initialised
    for(var k = 0 ; k<reviewRatings.length; k++){
        var rating = reviewRatings[k];
        var selector = '.reviewRating:eq('+k+')';
        //todo consider better way
        //$(selector) select").val(reviewRatings[k]);
        $(selector).barrating('set',rating);
    }
    refreshContentReviewMouseover();
}

function db_addSongReview(spotifyID,text,rating){

    var args = {
        spotifyId:spotifyID,
        review: text,
        rating: rating
    };

    $.getJSON("db/addReview.php",args,
        function(){
            db_getSongReviews(songInfo.spotifyID);
            //db_getAverageSongRating(songInfo.spotifyID);
        },
        function(data){
            alert("DB doesn't work");
        })
}

function db_getAverageSongRating(spotifyID){
    var args = {
        spotifyId: spotifyID
    };



    $.getJSON("db/getAverageReviewRating.php",args,
        function(data){
            dsp_db_averageSongRating(data);
        },
        function(data){
            alert("average rating fetch failed");
        });
}

function dsp_db_averageSongRating(averageSongRating){
    var avg = data[0].averageRating;
    var reviewCount = data[0].count; // todo: use

    if(avg==null){
        $('#review-average-rating').html("No reviews yet");
    }else {
        $('#review-average-rating').html(avg + "<small> out of " + reviewCount + " reviews");
    }
}