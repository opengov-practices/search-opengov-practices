import * as React from 'react';
import * as ReactDOM from 'react-dom';
var Datamap = require('datamaps/dist/datamaps.world.hires.min');
var d3 = require('d3');
var objectAssign = require('object-assign');
require('topojson/build/topojson.min');

export default class DataMap extends React.Component<any, any>  {

  private datamap;
  props;

  constructor(props){
    super(props);
    this.datamap = null;
  }

  //Aggregates the values in the array with search results per country, using D3 nest.
  countryTotals(){
  	const countryTotals = d3.nest()
	  .key(function(d) { return d._source.CountryCodeA3; })
	  .rollup(function(v) { return d3.sum(v, function(d) { return 1; }); })
	  .entries(this.props.hits);
	return countryTotals;
  }
  
  //Creates a colour range.
  linearPalleteScale(value){
    const dataValues = this.countryTotals().map(function(data) { return data.values });
    const minVal = Math.min(...dataValues);
    const maxVal = Math.max(...dataValues);	
    return d3.scale.linear().domain([minVal, maxVal]).range(["#EFEFFF","#02386F"])(value);
  }

  //Aggregates the search results per country and adds colour ranges to the data.
  reducedData(){
    const newData = this.countryTotals().reduce((object, data) => {
      object[data.key] = { value: data.values, fillColor: this.linearPalleteScale(data.values) };
      return object;
    }, {});
    return objectAssign({}, countryDefaults, newData);
  }
  renderMap(){
    return new Datamap({
      element: ReactDOM.findDOMNode(this),
      scope: 'world',
      setProjection: function(element, options) {
        var projection = d3.geo.mercator()
          .center([10, 56])
          .scale(500)
          .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
        var path = d3.geo.path()
          .projection(projection);
        return {path: path, projection: projection};
      },
      fills: { defaultFill: '#FFFFFF'},	  
      data: this.reducedData(),
      geographyConfig: {
        borderWidth: 0.5,
        highlightFillColor: '#284F75',
        popupTemplate: function(geography, data) {
          if (data && data.value) {
            return '<div class="hoverinfo"><strong>' + geography.properties.name + ', ' + data.value + '</strong></div>';
          } else {
            return '<div class="hoverinfo"><strong>' + geography.properties.name + '</strong></div>';
          }
        }
      }
    });
  }
  
  currentScreenWidth(){
    return window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
  }
  componentDidMount(){
    const mapContainer = d3.select('#datamap-container');
    const initialScreenWidth = this.currentScreenWidth();
    const containerWidth = (initialScreenWidth < 600) ?
      { width: initialScreenWidth + 'px',  height: (initialScreenWidth * 0.5625) + 'px' } :
      { width: '800px', height: '600px' }
    mapContainer.style(containerWidth);
    this.datamap = this.renderMap();
    window.addEventListener('resize', () => {
      const currentScreenWidth = this.currentScreenWidth();
      const mapContainerWidth = mapContainer.style('width');
      if (this.currentScreenWidth() > 600 && mapContainerWidth !== '600px') {
        d3.select('svg').remove();
        mapContainer.style({
          width: '800px',
          height: '600px'
        });
        this.datamap = this.renderMap();
      }
      else if (this.currentScreenWidth() <= 600) {
        d3.select('svg').remove();
        mapContainer.style({
          width: currentScreenWidth + 'px',
          height: (currentScreenWidth * 0.5625) + 'px'
        });
        this.datamap = this.renderMap();
      }
    });
  }
  componentDidUpdate(){
    this.datamap.updateChoropleth(this.reducedData());
  }
  componentWillUnmount(){
    d3.select('svg').remove();
  }
  render() {
    return (
      <div id="datamap-container"></div>
    );
  }
}

//initial values
const defaultFill = '#f2f2f2';
const countryDefaults = {
	'AUT': {fillColor: defaultFill, value: ''},
	'BEL': {fillColor: defaultFill, value: ''},
	'BGR': {fillColor: defaultFill, value: ''},
	'CAN': {fillColor: defaultFill, value: ''},
	'CHE': {fillColor: defaultFill, value: ''},
	'CYP': {fillColor: defaultFill, value: ''},
	'CZE': {fillColor: defaultFill, value: ''},
	'DEU': {fillColor: defaultFill, value: ''},
	'DNK': {fillColor: defaultFill, value: ''},
	'EST': {fillColor: defaultFill, value: ''},
	'ESP': {fillColor: defaultFill, value: ''},
	'EUR': {fillColor: defaultFill, value: ''},
	'FIN': {fillColor: defaultFill, value: ''},
	'FRA': {fillColor: defaultFill, value: ''},
	'GBR': {fillColor: defaultFill, value: ''},
	'GRC': {fillColor: defaultFill, value: ''},
	'HRV': {fillColor: defaultFill, value: ''},
	'HUN': {fillColor: defaultFill, value: ''},
	'IRL': {fillColor: defaultFill, value: ''},
	'IND': {fillColor: defaultFill, value: ''},
	'ISL': {fillColor: defaultFill, value: ''},
	'ITA': {fillColor: defaultFill, value: ''},
	'LTU': {fillColor: defaultFill, value: ''},
	'LUX': {fillColor: defaultFill, value: ''},
	'LVA': {fillColor: defaultFill, value: ''},
	'MLT': {fillColor: defaultFill, value: ''},
	'NLD': {fillColor: defaultFill, value: ''},
	'NOR': {fillColor: defaultFill, value: ''},
	'POL': {fillColor: defaultFill, value: ''},
	'PRT': {fillColor: defaultFill, value: ''},
	'ROU': {fillColor: defaultFill, value: ''},
	'SWE': {fillColor: defaultFill, value: ''},
	'SGP': {fillColor: defaultFill, value: ''},
	'SVN': {fillColor: defaultFill, value: ''},
	'SVK': {fillColor: defaultFill, value: ''}
    }