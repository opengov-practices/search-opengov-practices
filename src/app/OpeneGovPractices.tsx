import * as React from "react";
import * as _ from "lodash";
import {Modal, ButtonToolbar, Button, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import {
  SearchBox,
  Hits,
  HitsStats,
  HitsProps,
  RefinementListFilter,
  Pagination,
  ResetFilters,
  MenuFilter,
  SelectedFilters,
  HierarchicalMenuFilter,
  NumericRefinementListFilter,
  SortingSelector,
  SearchkitComponent,
  SearchkitProvider,
  SearchkitManager,
  NoHits,
  InitialLoader,
  ViewSwitcherToggle,
  ViewSwitcherHits  
} from "searchkit";
import DataMap from './DataMap';

import "./styles/index.scss";
import "searchkit/theming/theme.scss";
import "flag-icon-css-master/css/flag-icon.min.css";



const PracticeHitsGridItem = (props)=> {
	const {bemBlocks, result} = props
	let url = result._source.Link
	let shortDesc = result._source.Description
	if(shortDesc.length > 250) shortDesc = shortDesc.substring(0,250) + " ..."  
	const source:any = _.extend({}, result._source, result.highlight)
	return (
		<div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
			<a href={url} target="_blank">				
				<div data-qa="flag" className={bemBlocks.item("flag")}> 
					<h1 className={"flag-icon flag-icon-" + result._source.CountryCode}></h1>
				</div>
				<div data-qa="Title" className={bemBlocks.item("Title")} dangerouslySetInnerHTML={{__html:source.Title}}>
				</div>
			</a>
		</div>
	)
	}

const PracticeHitsListItem = (props)=> {
	const {bemBlocks, result} = props
	let url = result._source.Link
	const source:any = _.extend({}, result._source, result.highlight)
	return (
		<div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
		  <div className={bemBlocks.item("flag")}>
				<div data-qa="flag" className={bemBlocks.item("flag")}> 
					<h1 className={"flag-icon flag-icon-" + result._source.CountryCode}></h1>
				</div>
		  </div>
		  <div className={bemBlocks.item("details")}>
			<a href={url} target="_blank"><h2 className={bemBlocks.item("Title")} dangerouslySetInnerHTML={{__html:source.Title}}></h2></a>
			<h3 className={bemBlocks.item("subtitle")}>{source.Aspect}</h3>			
			<div className={bemBlocks.item("text")} dangerouslySetInnerHTML={{__html:source.Description}}></div>
            <PracticeHit result={result}/>
		  </div>
		</div>
	)
	}

//This is used to display the search results on a map, using the DataMap component
const PracticeHitsMap = (props)=> {
	return (
		<div style={{width: '100%', boxSizing: 'border-box', padding: 8}}>
			<DataMap hits={props.hits}/>
		</div>
	)
	}

//This component is used to display an individual hit as a modal window.
class PracticeHit extends React.Component<any, any> {
	constructor(props){
		super(props);
		this.state = {show: false};
		this.showModal = this.showModal.bind(this);
		this.hideModal = this.hideModal.bind(this);
	}

	showModal() {
		this.setState({show: true});
	}

	hideModal() {
		this.setState({show: false});
	}

	render() {

		return (
			<ButtonToolbar>
				<Button bsStyle="primary" onClick={this.showModal}>
					More info
				</Button>

				<Modal
					show={this.state.show}
					onHide={this.hideModal}
					dialogClassName="custom-modal"
				>
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title-lg"><span className={"flag-icon flag-icon-" + this.props.result._source.CountryCode}></span> {this.props.result._source.Title}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<p><b>Link: </b><a href={this.props.result._source.Link}>{this.props.result._source.Link}</a></p>
						<p><b>Aspect(s): </b>{this.props.result._source.Aspect.toString().replace(/_/g," ")}</p>
						<p><b>Stakeholder(s): </b>{this.props.result._source.Stakeholder}</p>
						<p><b>Description: </b>{this.props.result._source.Description}</p>
						<p><b>Object: </b>{this.props.result._source.Object.toString().replace(/_/g," ")}</p>
						<p><b>Lifecycle: </b>{this.props.result._source.Lifecycle.toString().replace(/_/g," ")}</p>
						<p><b>Organisation type: </b>{this.props.result._source.StakeholderType.toString().replace(/_/g," ")}</p>
						<p><b>Power of government: </b>{this.props.result._source.GovernmentPower.toString().replace(/_/g," ")}</p>
						<p><b>Theme: </b>{this.props.result._source.Theme.toString().replace(/_/g," ")}</p>
						<p><b>Country: </b>{this.props.result._source.Country}</p>

					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.hideModal}>Close</Button>
					</Modal.Footer>
				</Modal>
			</ButtonToolbar>
		)
	}
}

export class OpeneGovPractices extends React.Component<any, any> {

  searchkit:SearchkitManager

  constructor() {
    super()
    this.searchkit = new SearchkitManager("/")
    this.searchkit.translateFunction = (key)=> {
      return {"pagination.next":"Next Page"}[key]
    }
  }


  render(){
    return (
    <div className="page">
		<div className="page__search-section">
			<div className="page__search-section__search-area">
				<SearchkitProvider searchkit={this.searchkit}>
					  <div>
						<div className="sk-layout sk-layout__size-l">
							<div className="sk-layout__top-bar sk-top-bar">
								<div className="sk-top-bar__content">
								  <div className="my-logo"></div>
								  <SearchBox translations={{"searchbox.placeholder":"search practices of open government"}} prefixQueryFields={["Title", "Description", "Stakeholder"]} queryFields={["Title", "Description", "Stakeholder", "Link"]} queryOptions={{"minimum_should_match":"80%"}} autofocus={true} searchOnChange={true} />
								</div>
							</div>
							<div className="sk-layout__body">
								<div className="sk-layout__filters">
									<RefinementListFilter id="country" title="country" field="CountryCodeA3" operator="OR" size={7}/>
									<RefinementListFilter id="aspect" title="Open Gov aspect" field="Aspect" operator="OR" size={7}/>
									<RefinementListFilter id="lifecycle" title="Lifecycle" field="Lifecycle" operator="OR" size={7}/>
									<RefinementListFilter id="power" title="Power of government" field="GovernmentPower" operator="OR" size={7}/>
									<RefinementListFilter id="object" title="Object" field="Object" operator="OR" size={7}/>
									<RefinementListFilter id="actor" title="Organisation type" field="StakeholderType" operator="OR" size={7}/>
									<RefinementListFilter id="theme" title="Theme" field="Theme" operator="OR" size={7}/>
								</div>
								
								<div className="sk-layout__results sk-results-list">
									<div className="sk-results-list__action-bar sk-action-bar">							
										<div className="sk-action-bar__info">
												<HitsStats translations={{
											"hitstats.results_found":"{hitCount} results found"
										  }}/>
												<ViewSwitcherToggle/>
												<SortingSelector options={[
													{label:"Relevance", field:"_score", order:"desc",defaultOption:true},
													{label:"Title Z-A", field:"Title", order:"desc"},
													{label:"Title A-Z", field:"Title", order:"asc"}
												]}/>
										</div>
									<div className="sk-action-bar__filters">
									  <SelectedFilters/>
									  <ResetFilters/>
									</div>						
								</div>	
								<ViewSwitcherHits
										hitsPerPage={400} highlightFields={["Title","Description"]}
								  sourceFilter={["Title","Description","CountryCode", "CountryCodeA3", "Country", "Aspect", "Object", "Lifecycle", "Link", "Stakeholder", "StakeholderType", "GovernmentPower", "Theme"]}
								  hitComponents = {[
									{key:"grid", title:"Grid", itemComponent:PracticeHitsGridItem},
									{key:"list", title:"List", itemComponent:PracticeHitsListItem, defaultOption:true},
									{key:"map", title:"Map", listComponent:PracticeHitsMap}
								  ]}
								  scrollTo="body"
								/>								
								<NoHits suggestionsField={"Title"}/>
								<InitialLoader/>
								<Pagination showNumbers={true}/>
							</div>
						</div>
						<a className="view-src-link" href="https://ec.europa.eu/digital-agenda/en/egovernment-studies">View EU eGovernment studies»
						</a>
						</div>
					</div>
				</SearchkitProvider>						
			</div>
        </div>
        <div className="page__footer">
          <p>Data collected in the context of study 'SMART 2015/0041 Towards faster implementation and take-up of open government'. Copyright PwC EU Services, 2016. <br></br>
            <a href="http://www.makingspeechestalk.com/ch/OpenGovernmentServices/">Taxonomies</a> created in the context of study '<a href="https://joinup.ec.europa.eu/community/opengov/og_page/ogs-study">SMART 2014/0066</a> "Analysis of the value of new generation of eGovernment services'. </p>
        </div>
    </div>
    )}
}
