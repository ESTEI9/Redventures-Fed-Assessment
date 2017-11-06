jQuery(document).ready(function ($) {
    'use strict';
    /***** Inits *****/
    
    function filterResults() {
        let checked = $('[name="certification"]:checked');
        let values = [];
        for (let i=0; i<checked.length; i++) {
            values.push(checked[i].value);
        };
        $.getJSON("dealers.json", function(results){
           let data = results.dealers;
            let htmlBuild = '';
            let dealers = [];
            if (values.length === 0) {
                dealers = data;
            }
            else {
               dealers = data.filter(function(dealer){ //look in certifications, find ones that match the values, return that dealer.
                   let certifications = dealer['data']['certifications'];          
                   return values.every(function(value) {
                       if(certifications.indexOf(value) > -1) {
                           return true;
                       };
                       return false;
                   });
                   
               });
            };
            for (let i=0; i<dealers.length; i++) {
                let dealer = dealers[i]['data'];
                let sat = (dealer.weekHours.sat) ? (dealer.weekHours.sat == 'On Call') ? '- On Call' : dealer.weekHours.sat : '- CLOSED';
                let sun = (dealer.weekHours.sun) ? (dealer.weekHours.sun == 'On Call') ? '- On Call' : dealer.weekHours.sun : '- CLOSED';
                let certifications = dealer.certifications;
                function buildCerts() {
                    let certs = [];
                    for(let i=0; i<certifications.length; i++) {
                        certs.push('<li class="cert-icon" data-cert="'+certifications[i]+'">'+certifications[i]+'</li>');
                    };
                    return certs.join('');
                }
                let mobilePhone = dealer.phone1.replace(/-/g,'.');
                let result = '<div class="result col-sm-6 col-lg-4">';
                result += '<article>';
                result += '<div class="title"><h2>'+dealer.name+'</h2></div>';
                result += '<hr>';
                result += '<div class="hidden-sm hidden-xs">';
                result += '<img class="md-phone-img" src="RV Pool Pro Dev Test Assets/phone-icon-desktop.png" alt="phone" /><span class="md-phone">'+dealer.phone1+'</span>';
                result += '</div>';
                result += '<div class="hidden-md hidden-lg">';
                result += '<div id="mobile-phone">';
                result += '<a class="bg-lt-blue" href="tel:'+dealer.phone1+'"><img class="sm-phone-img" src="RV Pool Pro Dev Test Assets/phone-icon-mobile.png" alt="phone" /><div>Tap to call <span class="sm-phone">'+mobilePhone+'</span></div></a>';
                result += '</div>';
                result += '</div>';
                result += '<p>Can\'t talk now? Click below to send an email.</p>';
                result += '<div class="contact-link"><a href="#"><img src="RV Pool Pro Dev Test Assets/email-icon.png" alt="Email" />Contact this Pro</a></div>';
                result += '<div class="business-hours"><h5>Business Hours</h5>Weekdays '+dealer.weekHours.mon+'<br/>Saturdays '+sat+'<br/>Sundays '+sun+'</div>';
                result += '<div class="certifications"><ul>'+buildCerts()+'</ul></div>';
                result += '</article>';
                result += '</div>';
                htmlBuild += result;
            }
            
            $('#result-count').html('<span>'+dealers.length+' dealers in 28226</span>');
            $('#results').html(htmlBuild);
            
        });
    };
    
    /***** General Functions *****/
    $('#find-a-pool-pro a').hover(function(){
        $('#find-a-pool-pro img').toggleClass('white-out');
    });
    $('#menu-toggle, #mobile-menu .close').click(function(){
        $('#mobile-menu').toggleClass('open');
    });
    $('#filter-toggle .dropdown').click(function(e){
        e.preventDefault();
        $('#filter ul').toggleClass('hideToggle');
        $(this).toggleClass('ss-dropdown');
    });
    
    $('.input-container').click(function(){
        let input = $(this).find('input');
        let checked = $(input).attr('checked');
        if ($(input).attr('type') === 'radio') {
            if (checked === undefined) {
                $(input).attr('checked',true);
                $(this).addClass('checked');
                $(this).siblings().find('input').attr('checked',false);
                $(this).siblings().removeClass('checked');
            };          
        }
        else {
            let status = (checked === 'checked') ? false : 'checked';
            $(this).find('input').attr('checked',status);
            $(this).toggleClass('checked');
            filterResults();
        };
    });
    
    $('#results').on('click','.contact-link a',function(e){
        e.preventDefault();
        let title = $(this).parents('article').find('.title > h2').text();
        $('#modal').addClass('on');
        $('#modal .modal-title').html(title);
        $('body').addClass('modal-on');
    });
    
    $('#modal .close, #modal-toggle').click(function(){
        $('#modal').removeClass('on');
        $('body').removeClass('modal-on');
    });
    
    $('#modal [type="submit"]').click(function(e){
        e.preventDefault();
    })
    
    $('#modal input').change(function(){
        if ($(this).attr('required')) {
            let type=$(this).attr('type');
            let regex = (function(){
                switch(type) {
                    case 'text':
                       return /[a-zA-Z]*\s[a-zA-Z]*/;
                    break;
                    case 'tel':
                       return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
                    break;
                    case 'email':
                       return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                    break;
                    default:
                       return /./;
               };
            })();
            $(this).prev('label').attr('data-validate', regex.test(this.value));
        };
    });
    
    /***** Filter Results *****/
    
    filterResults(); // Needed for initial page render
    
    
});