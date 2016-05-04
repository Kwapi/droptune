

var mb_artistLinksObtained = false;
/**
 *  Populates the category dropdowns (filtering and adding new content)
 *
 *   DOM:        #userLinkedContentAdd-cat-select, #userLinkedContent-cat-filter
 *   Callback:   none
 */
function populateCategoryDropdown(categories) {
    var output = [];
    for (var i = 0; i < categories.length; i++) {
        var categoryName = categories[i];
        output.push('<option value="' + categoryName + '">' + capitalize(categoryName) + '</option>');
    }

    //  add categories to selection when adding new content
    $('#userLinkedContentAdd-cat-select').html(output.join(''));

    //  add categories to content filter (include Display All option as well)
    output.unshift('<option value="all" selected>Display all</option>');
    $('#userLinkedContent-cat-filter').html(output.join(''));


    refreshSelects();
}


/**
 * Refresh selects
 *
 * DOM:     .select-material
 */
function refreshSelects(){
    $('select').material_select('destroy');
    $('.select-material').material_select();
}


function activateMediaLink(domID, url) {
    var linkDiv = $(domID);
    linkDiv.removeClass("disabled");
    linkDiv.addClass("active");
    linkDiv.attr("href", url);
}

function getMoreInfo(){
    dsp_spotifyPlayButton(songInfo.spotifyID);
    lfm_getArtistInfo(artistInfo.name);
    en_getSongInfo(songInfo.spotifyID,songInfo.name,artistInfo.name);
    en_getArtistInfo(artistInfo.spotifyID, artistInfo.name);
    sp_getArtistTopTracks(artistInfo.spotifyID);
    imvdb_getSongOfficialVideo(songInfo.name,artistInfo.name);
    sf_getSongFacts(songInfo.name,artistInfo.name);
    sf_getArtistFacts(songInfo.name,artistInfo.name);
    //youtube is dynamic
}

function findGigsAroundYou(){

    //todo: document callback parameters workaround
    var radius = artistEventSlider.noUiSlider.get();
    if(exists(artistInfo.musicbrainzID)) {
        sk_getArtistEvents(artistInfo.musicbrainzID,sk_prepareRadiusFilter,radius);
    }else{
        console.log("FindGigsAroundYou - no musicbrainzID for the artist");
    }
}


/**==============================EVENT HANDLERS======================**/


    /**
     * Check for validity of URL submitted for User-linked Content
     *
     * Trigger:     input
     * DOM:         #userLinkedContentAdd-link
     * Result:      alert if not valid - reset form
     */
    $('#userLinkedContentAdd-link').on('input', function () {
        var url = $("#userLinkedContentAdd-link").val();
        url = url.trim();

        if (!isUrlValid(url)) {
            alert("The content url is not valid");
            $("#userLinkedContentAdd-link").val("");
            return;
        }

    });

    /**
     * Open helper model telling user to select rating from navbar
     *
     * Trigger: #addReview-btn-second click
     * Result:  open modal
     */
    $('#addReview-btn-second').click(function(){
            $('#addReview-helpCard-modal').openModal();
        });


    /** Find gigs around you**/
    $('#applyFilterEventBTN').click(findGigsAroundYou);


/**==========================UI ELEMENTS INITIALISIATION=========**/

    // material design selects
    $('.select-material').material_select();

    // lightbox for album art and artist photo
    $('.materialboxed').materialbox();

    var contentCategories = ["live", "behind the scenes", "remix", "cover", "article", "review", "other"];
    populateCategoryDropdown(contentCategories);