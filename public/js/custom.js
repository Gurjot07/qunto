$(function(){
    $('#search').on('keyup', function(e){

        let parameters = { search: $(this).val() };
        $.get( '/search',parameters, function(data) {
            console.log(data)
            let html ="";
            let _idd ="";
            for(i=0;i<data.length;i++){

                if(i%2==0){
                    _idd = data[i];
                }
                else{
                    if(data[i].length>40){
                        data[i]= data[i].slice(0,40)+"...";
                    }
                    html = html +`<li><a href='/question/`+ _idd +" '>"+  data[i] +"</a> </li><hr style='color:#CED4DA'>";
                }
            }
            if(!html){
                html="<h5>no result found</h5>"
            }
        $('#result-list').html(html);
        });

    });
    $('#search2').on('keyup', function(e){

        let parameters = { search: $(this).val() };
        $.get( '/search',parameters, function(data) {
            console.log(data)
            let html ="";
            let _idd ="";
            for(i=0;i<data.length;i++){

                if(i%2==0){
                    _idd = data[i];
                }
                else{
                    if(data[i].length>40){
                        data[i]= data[i].slice(0,40)+"...";
                    }
                    html = html +`<li><a href='/question/`+ _idd +" '>"+  data[i] +"</a> </li><hr style='color:#CED4DA'>";
                }
            }
            if(!html){
                html="<h5>no result found</h5>"
            }
        $('#result-list2').html(html);
        });

    });

    /*$('#validationCustomUsername').on('keyup',function (e) {
        let parameters = { username: $(this).val() };

        $.get( '/username',parameters, function(data) {
            console.log(data)
            $('#check-username').html(data);
        })
    })*/
    
    $('#search').on('focus',function () {
        $('#results').show()
    })
    $('.container').click(function(){

        $('#results').hide();

    });
    $('#search2').on('focus',function () {
        $('#results2').show()
    })
    $('.container').click(function(){

        $('#results2').hide();

    });

});