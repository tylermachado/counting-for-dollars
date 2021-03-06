import React, { Component } from 'react'
import '../App.css'
import { csv } from 'd3-fetch'
import DataTable from '../components/Table'
import StateMap from '../components/StateMap'
import ReactTooltip from 'react-tooltip'
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { ChartHeader, ChartFooter } from '../components/ChartMeta'




class Post3Map extends Component {
  constructor(props){
     super(props)
     this.filterData = this.filterData.bind(this)
     this.onResize = this.onResize.bind(this)
     this.handleClick = this.handleClick.bind(this);
     this.state = {
       screenWidth: window.innerWidth,
       screenHeight: 700,
       slice: "cost_low",
       data: [],
       filtereddata: [],
       program: "",
       programlist: [],
       accessor: ""
     }
  }

  filterData(slice = "cost_low") {
   const allowed = ['State', slice];
   const newarray = [];

   let accessor = ""
   if (slice === "cost_low") {
      accessor = "Low Risk"
   } else if (slice === "cost_med") {
      accessor = "Medium Risk"
   } else if (slice === "cost_high") {
      accessor = "High Risk"
   }

    for (let i=0; i<this.state.data.length; i++) {
      const filtered = Object.keys(this.state.data[i])
        .filter(key => allowed.includes(key))
        .reduce((obj, key) => {
          if (key === slice) {
            obj[accessor] = this.state.data[i][key];
          } else {
            obj[key] = this.state.data[i][key];
          }
          return obj;
        }, {});
      newarray.push(filtered);
    }

    newarray.columns = ['State', accessor];

    this.setState({
      accessor: accessor,
      filtereddata: newarray,
      slice: slice
    })
  }

  onResize() {
    this.setState({ screenWidth: window.innerWidth  })
  }

  // onHover(d) {
  //   this.setState({ hover: d.id })
  // }

  componentWillMount() {
    csv("datasets/losses_undercount.csv")
   .then(dataset => {
      dataset.forEach(d => {
         d["cost_low"] = +d["cost_low"]
         d["cost_med"] = +d["cost_med"]
         d["cost_high"] = +d["cost_high"]
      })

      this.setState({
         data: dataset
      })

      this.filterData("cost_low")
   })
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize, false)
    this.onResize()
  }

  componentDidUpdate() {
    ReactTooltip.rebuild()
  }

  handleClick(e) {
    var actives = document.getElementsByClassName("active");
    for(var i = 0; i < actives.length; i++)
    {
        actives[i].classList.add("inactive");
        actives[i].classList.remove("active");
    }
    document.getElementById("button_" + e).classList.add("active");
    this.filterData(e)
  }

  render() {
    return (
      <div className="App">
        <ChartHeader title="How a miscount in the 2020 census would skew federal funding for Medicaid" subhed="Medicaid reimbursements states might gain or lose under 2020 low-, medium- and high-risk miscount scenarios projected by the Urban Institute" />
        <ButtonGroup id="toggles" aria-label="outlined button group">
          <Button id={"button_" + "cost_low"} className="active" onClick={this.handleClick.bind(this, "cost_low")}>Low Risk</Button>
          <Button id={"button_" + "cost_med"} className="inactive" onClick={this.handleClick.bind(this, "cost_med")}>Medium Risk</Button>
          <Button id={"button_" + "cost_high"} className="inactive" onClick={this.handleClick.bind(this, "cost_high")}>High Risk</Button>
        </ButtonGroup>
        <div>
          <ReactTooltip className='tooltip-width' />
          <StateMap
            data={this.state.filtereddata}
            size={[this.state.screenWidth, this.state.screenHeight-175]}
            fill={this.state.accessor}
            slice={this.state.slice}
         />
        </div>
        <ChartFooter credit={<span>Sources: <a href="https://gwipp.gwu.edu/counting-dollars-2020-role-decennial-census-geographic-distribution-federal-funds">“Counting for Dollars 2020: The Role of the Decennial Census in the Geographic Distribution of Federal Funds,”</a> <a href="https://www.urban.org/research/publication/assessing-miscounts-2020-census">“Assessing Miscounts in the 2020 Census.”</a></span>} downloaddata={this.state.filtereddata} downloadfilename={this.state.accessor} key={this.state.accessor}  />
      </div>
    )
  }
}

export default Post3Map
