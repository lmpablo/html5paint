$(document).ready(function(){
    var canvas, ctx,
        PENCIL_TOOL = 1, BRUSH_TOOL = 2, LINE_TOOL = 3, RECTANGLE_TOOL = 4, 
        CIRCLE_TOOL = 5, ERASER_TOOL = 10;
    var activeTool = 0;

    // Clears the temporary canvas
    function clrScreen(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // since we use drawImage to the base canvas, fillRect isn't just gonna cut it
    function wipeCanvas(){
        baseCtx.fillStyle = "white";
        clrScreen();
        baseCtx.fillRect(0,0, baseCanvas.width, baseCanvas.height);
    }

    function getStrokeWidth(){
        var stroke = $("#outline-choose-slider").slider("value");
        return stroke;
    }

    function getStrokeColor(){
        var strokeColor = $("#stroke-swatch").css("background-color");
        return strokeColor;
    }

    function getFillColor(){
        var fillColor = $("#fill-swatch").css("background-color");
        return fillColor;
    }

    // given rgb values, convert them to hex
    function hexFromRGB(red, green, blue){
        var hex = [
            red.toString(16),
            green.toString(16),
            blue.toString(16)
        ];

        $.each(hex, function(nr, val){
            if (val.length === 1){
                hex[nr] = "0" + val;
            }
        });
        return hex.join("").toUpperCase();
    }

    function refreshStrokeSwatch(){
        var red = $("#stroke-red").slider("value"),
            green = $("#stroke-green").slider("value"),
            blue = $("#stroke-blue").slider("value");

        // convert to hex
        var hex = hexFromRGB(red, green, blue);
        $("#stroke-swatch").css("background", "#" + hex);
    }

    function refreshFillSwatch(){
        var red = $("#fill-red").slider("value"),
            green = $("#fill-green").slider("value"),
            blue = $("#fill-blue").slider("value");

        // convert to hex
        var hex = hexFromRGB(red, green, blue);
        $("#fill-swatch").css("background", "#" + hex);
    }

    function canvasDraw(e){
        if (e.type === 'mousedown'){
            x = e.pageX;
            y = e.pageY;

            if (activeTool === LINE_TOOL || activeTool === PENCIL_TOOL ||
                activeTool === CIRCLE_TOOL || activeTool === BRUSH_TOOL){
                ctx.beginPath();    
            }
            else if (activeTool === RECTANGLE_TOOL){
                ctx.fillRect(x,y,0,0);
            }
            canvas.addEventListener('mousemove', canvasDraw, false);
        }
        else if (e.type === 'mouseup'){
            // stop the drawing and transfer to the background
            canvas.removeEventListener('mousemove', canvasDraw, false);
            baseCtx.drawImage(canvas, 0, 0);

            // TODO -- allow resizing before transferring to the background
        }
        else if (e.type === 'mousemove'){
            clrScreen();

            x2 = e.pageX;
            y2 = e.pageY;

            // get the properties based on the sliders and/or swatches
            ctx.lineWidth = getStrokeWidth();
            ctx.fillStyle = getFillColor();
            ctx.strokeStyle = getStrokeColor();
            
            if (activeTool === PENCIL_TOOL){
                ctx.moveTo(x, y);
                ctx.lineTo(x2, y2);
                ctx.lineWidth = 1;
                ctx.stroke();
                x = e.pageX;
                y = e.pageY;
            }
            else if (activeTool === BRUSH_TOOL){
                ctx.moveTo(x, y);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                x = e.pageX;
                y = e.pageY;
            }
            else if (activeTool === LINE_TOOL){
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x2, y2);
                
                ctx.stroke();
            }
            else if (activeTool === RECTANGLE_TOOL){
                ctx.strokeRect(x,y, (x2-x), (y2-y));
                ctx.fillRect(x,y, (x2-x), (y2-y));
            }
            else if (activeTool === CIRCLE_TOOL){
                ctx.beginPath();
                if (x2 > x){
                    ctx.arc(x,y,x2-x,0,2*Math.PI);
                }
                else{
                    ctx.arc(x,y,x-x2,0,2*Math.PI);
                }
                ctx.fill();
                ctx.stroke();
            }
        }
    }

    function setActiveTool(tool){
        if (activeTool === 0 && tool >= 1 && tool <= 5){
            canvas.addEventListener('mousedown', canvasDraw, false);
            canvas.addEventListener('mouseup', canvasDraw, false);
        }
        activeTool = tool;        
    }

    // TOOL DECLARATIONS
    $(".tool").click(function(){
        $(".tool").css("background", "#555");
        var id = parseInt($(this).attr("data-tid"));
        setActiveTool(id);
        $(this).css("background", "#34495e");
    });


    // --JQUERY-UI STUFF--
    $("#outline-choose").click(function(){
        $("#stroke-width").slideToggle('50');
    });

    $("#outline-color-choose").click(function(){
        $("#stroke-color").slideToggle('50');
        if($("#fill-color").is(":visible")){
            $("#fill-color").toggle();
        }
    });

    $("#fill-color-choose").click(function(){
        $("#fill-color").slideToggle('50');
        if($("#stroke-color").is(":visible")){
            $("#stroke-color").toggle();
        }
    });

    // sliders for width and color swatch
    $("#outline-choose-slider").slider({
        orientation: "vertical",
        range: "min",
        min: 0,
        max: 15,
        value: 1,
        slide: function( event, ui ) {
                $( "#stroke-val").html( ui.value );
            }
    });

    $( "#stroke-red, #stroke-green, #stroke-blue" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 255,
      value: 127,
      slide: refreshStrokeSwatch,
      change: refreshStrokeSwatch
    });

    $( "#fill-red, #fill-green, #fill-blue" ).slider({
      orientation: "horizontal",
      range: "min",
      max: 255,
      value: 127,
      slide: refreshFillSwatch,
      change: refreshFillSwatch
    });
    $( ".red, .blue, .green" ).slider( "value", 50 );

    $("#clear").click(function(){
        wipeCanvas();
    });

    canvas = document.getElementById("canvas");
    baseCanvas = document.getElementById("baseCanvas");
    ctx = canvas.getContext("2d");
    baseCtx = baseCanvas.getContext("2d");
    
    baseCanvas.height = window.innerHeight;
    baseCanvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    var x, y, x2, y2;

     $("#stroke-width, #fill-color, #stroke-color").hide();

});