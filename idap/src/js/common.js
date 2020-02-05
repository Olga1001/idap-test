$(document).ready(function () {
    let selected,
        selected2;
    $("select").mousedown( function(){
        if( $( this ).val() != selected ) {
            selected = $( this ).val();
            selected2=null;
            $(".select-arrow").addClass('active');
        } else {
            selected=null;
            $(".select-arrow").removeClass('active');
        }
    }).blur(function(){
        if (selected2==selected) {
            selected=null;
            selected2=null;
            $(".select-arrow").removeClass('active');
        }
    }).mouseup(function(){
        if( $(this).val() != selected || $(this).val() == selected2 ) {
            selected=null;
            selected2=null;
            $(".select-arrow").removeClass('active');
        }
        else {
            selected2=$( this ).val();
            $(".select-arrow").addClass('active');
        }
    });

    $(".tabs-list").click(function () {
        $(this).addClass('active').siblings().removeClass('active');
    });

    $(".btn-drop").click(function (e) {
        e.preventDefault();
        $(this).closest(".card").find(".card-drop").slideToggle(300).closest(".card").siblings().find(".card-drop").slideUp(300);
        $(this).toggleClass('active').closest(".card").siblings().find(".btn-drop").removeClass('active');
    });
    $(".burger").click(function (e) {
        e.preventDefault();
        $(this).toggleClass('active');
        $(".header-mob").toggleClass('active');
        if ($(".burger").hasClass('active')){
            $.scrollLock(true);
        } else {
            $.scrollLock(false);
        }

    });

    if (window.matchMedia("(max-width: 767px)").matches) {
        let heightTopPanel = $(".top").height();
        let heightHeader = $(".header").css("height", heightTopPanel + 15 + "px");
    }
});
