import React, { Component } from 'react'
import '../App.css'
import { csv, json } from 'd3-fetch'
import { ChartHeader, ChartFooter } from '../components/ChartMeta'
import DataTable from '../components/Table'




class Post4Table extends Component {
  constructor(props){
    super(props)
    this.onResize = this.onResize.bind(this)
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      screenWidth: window.innerWidth,
      screenHeight: 700,
      hover: "none",
      data: [],
      slice: "total",
      program: "Title I Grants to Local Education Agencies"
    }

  }

  onResize() {
    this.setState({ screenWidth: window.innerWidth  })
  }

  // onHover(d) {
  //   this.setState({ hover: d.id })
  // }

  componentWillMount() {
    csv("datasets/map-and-table-title-i-grants-per-state-per-child.csv").then(data => {
      data.map(item => (
        Object.keys(item).filter(d => (d !== "State")).map(key => (
          item[key] = +item[key]
        ))
      ))

      this.setState({data: data});
    });

  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize, false)
    this.onResize()
  }

  componentDidUpdate() {
    // ReactTooltip.rebuild()
  }

  handleClick(e) {
    this.setState({slice: e})
  }

  render() {
    console.log(this.state.data)
    return (
      <div className="App">
        <div className="header-grid">
          <div className="grid-3">
            <ChartHeader title={"Title I funding per low-income child in 2016 by state"} />
          </div>
        </div>
        <div className="App-header">
          <h2></h2>
        </div>
        <div>
          <DataTable data={this.state.data}  />
        </div>
        <ChartFooter credit={"Sources: U.S. Census Bureau’s SAIPE; Dept. of Education"} downloaddata={this.state.data} downloadfilename={"Title I funding per low-income child in 2016 by state"} />
      </div>
    )
  }
}

export default Post4Table
