import React, { Component } from 'react'
import '../App.css'
import { csv, json } from 'd3-fetch'
import DataTable from '../components/Table'




class Post3Table extends Component {
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
    csv("datasets/losses_undercount.csv").then(data => {
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
        <div className="App-header">
          <h2>How the census guides Medicaid and how an undercount can cost states millions in reimbursements</h2>
        </div>
        <div>
          <DataTable data={this.state.data}  />
        </div>
        <ChartFooter credit={<span>Sources: <a href="https://gwipp.gwu.edu/counting-dollars-2020-role-decennial-census-geographic-distribution-federal-funds">“Counting for Dollars 2020: The Role of the Decennial Census in the Geographic Distribution of Federal Funds,”</a> Federal Funds Information for States.</span>} />
      </div>
    )
  }
}

export default Post3Table
