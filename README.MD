
## What is this?
This is a [ReactJS](https://facebook.github.io/react/) Web app that allow exploring practices of open government.
It has  the following features:
- Faceted search using [SearchKit](http://searchkit.co/), [ElasticSearch](https://www.elastic.co/) and [flag-icon-css](http://lipis.github.io/flag-icon-css/).
- Modal window to display search results using [react-bootstrap](https://react-bootstrap.github.io/).
- Coloured map view of per-country results (choropleth) using [datamaps 0.5.5](http://datamaps.github.io/) and [D3](https://d3js.org/).

[<img src="./data/facetted-search-searchkit.png" width="500" />](http://opengov.testproject.eu/)
[<img src="./data/map-search-datamaps.png" width="500" />](http://opengov.testproject.eu/?view=map)

## Live demo
[http://opengov.testproject.eu/](http://opengov.testproject.eu/ "Search open gov practices".)


## Getting started
- npm install
- manually copy [flag-icon-css](http://lipis.github.io/flag-icon-css/) and [datamaps 0.5.5](http://datamaps.github.io/) into your nodes_modules folder.
- npm start

## Dataset
The [dataset](https://docs.google.com/spreadsheets/d/1-4r3p7DE7GaGes4K4pjLR3YU0WPk9YT5SiwMD3IqhZ0/pub?gid=611383747&single=true&output=csv) was collected in the context of study '[SMART 2015/0041](https://ec.europa.eu/digital-agenda/en/egovernment-studies) Towards faster implementation and take-up of open government'.
Taxonomies created in the context of study '[SMART 2014/0066](https://joinup.ec.europa.eu/community/opengov/og_page/ogs-study) "Analysis of the value of new generation of eGovernment services'. 
