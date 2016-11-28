HTMLWidgets.widget({

  name: 'treeWeightD3',

  type: 'output',

  factory: function(el, width, height) {

    // TODO: define shared variables for this instance

    return {

      renderValue: function(x) {

        // TODO: code to render the widget, e.g.
        
        

        // initialise the page 
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }   
        var conditions;

        // if one condition
        if(x.numberConditions == 1){
            alert("numberConditions == 1");
            conditions =new Array (x.conditions);
        }
        else{
            conditions = x.conditions;
        }

        // Create Condition Menu
        var menu = document.createElement("div");
        menu.setAttribute("class","bp-navBar");
        menu.setAttribute("style","left: 20px; visibility: visible;");
        menu.id ="menu";

        // Navigation bar        
        var ul = document.createElement("ul");        
        ul.setAttribute("class","bp-navigation clearfix");
        ul.setAttribute("style","list-style-type:none");

        for (var i = 0; i < conditions.length; i++) {
                console.log(conditions[i]);
                var li = document.createElement("li");
                if(i ==0){
                    li.setAttribute("class","button selected");
                }
                else{
                    li.setAttribute("class","button");
                }
                li.id = conditions[i]+"Button";
                li.index =i;
                li.innerText =conditions[i];
                ul.appendChild(li);       
        }
        menu.appendChild(ul);

        var body = document.createElement("div");
        //nouveauDiv.innerHTML = "<h1>Salutations !</h1>";background-color:pink;
        body.id = "body";
        //body.setAttribute( "style","width:"+width+";height:"+height);


        body.appendChild(menu);

        var tooltip = document.createElement("div");        
        tooltip.id = "toolTip";
        tooltip.setAttribute("class", "tooltip" );
        
        //tooltip.setAttribute("style","width: 1000px");
        tooltip.setAttribute("style","opacity:0;");

        var head = document.createElement("div");  
        head.id="head";
        head.setAttribute("class", "header" );
        var header1 = document.createElement("div");
        header1.id="header1";  
        header1.setAttribute("class", "header1" );
        var header2 = document.createElement("div"); 
        header2.setAttribute("class", "header2" );
        header2.id="header2";
        var header3 = document.createElement("div");  
        header3.setAttribute("class", "header2" );
        header3.id="header3";

        tooltip.appendChild(head);  
        tooltip.appendChild(header1); 
        tooltip.appendChild(header2); 
        tooltip.appendChild(header3); 

        var cadre = document.createElement("div");        
        cadre.setAttribute("style","position:absolute; left:10px");

        var left =0;
        for (var i = 0; i < conditions.length; i++) {
                console.log(conditions[i]);
                var federalTip = document.createElement("div");  
                federalTip.id=conditions[i]+"Tip";
                federalTip.setAttribute("class", "tip" );
                //federalTip.setAttribute("style", "width:135px; left:"+left+"px; top:10px; position: absolute;" );
                federalTip.setAttribute("style", "width:135px; left:10px; top:"+left+"px; position: absolute;" );
                var fTp = document.createElement("div");  
                //fTp.id="fedSpend";
                fTp.id= conditions[i]+"Spend";
                fTp.setAttribute("class", "header4" );
                var fedText = document.createElement("div");  
                fedText.setAttribute("class","header3");
                fedText.innerHTML ="<br>"+conditions[i]+"</br>"
                var divheader  = document.createElement("div");  
                divheader.setAttribute("class","header-rule");
                federalTip.appendChild(fedText);
                federalTip.appendChild(divheader);
                federalTip.appendChild(fTp);

                cadre.appendChild(federalTip);
                left +=80;
        }
        
      
        /*var divtf  = document.createElement("div"); 
        divtf.setAttribute("class","tooltipTail");*/

       

        tooltip.appendChild(cadre);
        //tooltip.appendChild(divtf);

        body.appendChild(tooltip);

        el.appendChild(body);
        
        
        
        
        main(HTMLWidgets.dataframeToD3(x.message),conditions,x.levels,x.nodeFind,width,height);
       // main(x);
        //el.innerText = x.message;
        
      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size
           
       }

    };
  }
});
