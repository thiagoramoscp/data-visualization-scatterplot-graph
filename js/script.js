fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
  .then(response => response.json())
  .then((dataset) => {
  dataset.unshift({Time: "36:47"});
  dataset.forEach(obj => {
    
    const parseTime = d3.timeParse("%M:%S");
    obj.Time = parseTime(obj.Time);
  })
  
  
const WIDTH = 900;
const HEIGHT = 550;
const PADDING_TOP = 105;
const PADDING_BOTTOM = 85;
const PADDING_LEFT = 105;
const PADDING_RIGHT = 85;
  
const DOPING_COLOR = '#bd2d28';
const NO_DOPING_COLOR = '#0f8c79';

const tooltipXOffset = 10;
const tooltipYOffset = -50;
  
const xValue = d => d.Year;
const yValue = d => d.Time;

  
const svg = d3.select('svg');

svg.attr('width', WIDTH)
   .attr('height', HEIGHT)
   .attr('font-family', '"Lato", sans-serif');
  
        /* --TEXT-- */

svg.append('text')
     .attr('id', 'title')
     .text('Doping in Professional Bicycle Racing')
     .attr('x', WIDTH / 2)
     .attr('text-anchor', 'middle')
     .attr('y', PADDING_TOP - 60)
     .attr('font-size', '2.3em')
     .attr('fill', "#222");
  
 svg.append('text')
     .text("35 Fastest times up Alpe d'Huez")
     .attr('x', WIDTH / 2)
     .attr('text-anchor', 'middle')
     .attr('y', PADDING_TOP - 25 )
     .attr('font-size', '1.5em')
     .attr('fill', "#222");

  svg.append('text')
     .text('Minutes')
     .attr('x', PADDING_LEFT - 50)
     .attr('y', PADDING_TOP - 12)
     .attr('font-size', '.8em');

  const legendG = svg.append('g')
    .attr('id', 'legend')
    .attr('font-size', '.9em')
    .attr('fill', '#444');
  legendG.append('circle')
    .attr('r', '8')
    .attr('cx', WIDTH - PADDING_RIGHT)
    .attr('cy', HEIGHT - PADDING_BOTTOM + 55)
    .attr('fill', DOPING_COLOR);
  legendG.append('circle')
    .attr('r', '8')
    .attr('cx', WIDTH - PADDING_RIGHT)
    .attr('cy', HEIGHT - PADDING_BOTTOM + 35)
    .attr('fill', NO_DOPING_COLOR);
  
  legendG.append('text')
    .attr('text-anchor', 'end')
    .append('tspan')
    .text('Riders with doping allegations')
    .attr('x', WIDTH - (PADDING_RIGHT + 10))
    .attr('y', HEIGHT - PADDING_BOTTOM + 59)
    .append('tspan')
    .text('No doping allegations')
    .attr('x', WIDTH - (PADDING_RIGHT + 10))
    .attr('y', HEIGHT - PADDING_BOTTOM + 39);
     
  
    /* --SCALES-- */
  
const yScale = d3.scaleTime()
  .domain([d3.max(dataset, yValue), d3.min(dataset, yValue)])
  .range([HEIGHT - PADDING_BOTTOM, PADDING_TOP])
  .nice();
  
  // somar e subtrair 1 ao d.Year deixa o gráfico mais bonito
const xScale = d3.scaleLinear()
  .domain([d3.min(dataset, d => d.Year), d3.max(dataset, d => d.Year)])
  .range([PADDING_LEFT, WIDTH - PADDING_RIGHT])
  .nice();
  

  
    /* --AXES-- */
  
    const xAxis = d3.axisBottom(xScale)
      .ticks(21, "")
      .tickSize(-HEIGHT +PADDING_TOP + PADDING_BOTTOM)
      .tickPadding(8);
  
  svg.append('g')
     .attr('id', 'x-axis')
     .attr('transform', `translate(0, ${HEIGHT - PADDING_BOTTOM })`)
     .call(xAxis);
  
  
  const yAxis = d3.axisLeft(yScale)
    .ticks(d3.timeSecond.every(15))
    .tickFormat(d3.timeFormat("%M:%S"))
    .tickSize(PADDING_TOP + PADDING_BOTTOM - WIDTH)
    .tickPadding(7);
  
  svg.append('g')
     .attr('id', 'y-axis')
     .attr('transform', `translate(${PADDING_LEFT } , 0)`)
     .call(yAxis);

 
    /* --DATA RENDERING-- */
  
svg.selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('data-xvalue', xValue)
    .attr('data-yvalue', yValue)
    .attr('r', '5')
    .attr('cx', d => xScale(xValue(d)))
    .attr('cy', d => yScale(yValue(d)))
    .attr('fill', d => d.Doping? DOPING_COLOR : NO_DOPING_COLOR)
    .on('mouseover', (d) => {
      tooltip.select('rect')       
        .attr('data-year', d.Year);
      tooltip.style('visibility', 'visible')
        .append('text')
        .attr('font-size', '1em')
        .attr('font-weight', '600')
        .attr('transform', `translate(10, 15)`)
          .append('tspan')
          .text(`${d.Name}: ${d.Nationality}`)
          .attr('x', '.5em')
          .attr('dy', '.4em')
          .append('tspan')
          .attr('dy', '1.3em')
          .attr('x', '.5em')
          .text(`Year: ${d.Year}, Time: ${d.Time.getMinutes()}:${d.Time.getSeconds()}`)
          .append('tspan')
          .attr('dy', '2.3em')
          .attr('x', '.5em')
          .text(`${d.Doping}`);
      })
    .on('mouseout', () => {      
      tooltip.style('visibility', 'hidden');
      tooltip.select('rect')       
        .attr('data-year', '');
      tooltip.select('text').remove();
      })
    .on('mousemove', (d) => {
        let mousePosition = d3.mouse(d3.event.currentTarget);
        let xPosition = mousePosition[0];
        let yPosition = mousePosition[1];
        tooltip.attr('transform', `translate(${xPosition + tooltipXOffset}, ${yPosition + tooltipYOffset})`)
        .attr('data-year', `${d.Year}`);
      });  
    
    /* --TOOLTIP-- */
  
    let tooltip = svg.append('g')
      .attr('id', 'tooltip');
      
      tooltip.append('rect')
      .attr('visibility', 'hidden')
      .attr('class', 'tooltip')
      .attr('width', '0')
      .attr('height', '0')
      .attr('rx', '.5em')
      .attr('ry', '.4em');

});