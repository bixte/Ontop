document.addEventListener('DOMContentLoaded', ()=>{
    let graphNav = document.querySelector ('.analytic-date__navigation');
    let grathBtns = document.querySelectorAll('[data-graph]')
    console.log(graphNav);
    graphNav.addEventListener ('click', function showGraph(){
        grathBtns.forEach(grathBtn => {
        });
    })

    let progressChart = {
        type: "bar",
        series: [{
            
        values: [87,70,116,20],
        'border-radius': "9px",
        styles: [ "#F0AD00", "#F09000", "#5BBF38", "#F06500"] 
        }   
           
        ],
          scaleX: {
            values: ['Неделя 1', 'Неделя 2', 'Неделя 3', 'Неделя 4'],
        }
   }
   
   zingchart.render({
       id : 'myChart',
       data : progressChart,
       height: 400,
       width: '100%',
       modules: "toolbar-zoom"
   });

})