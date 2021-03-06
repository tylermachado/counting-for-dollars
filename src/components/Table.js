import React, { Component } from 'react'
import '../App.css'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ArrowDropDownSharpIcon from '@material-ui/icons/ArrowDropDownSharp'
import ArrowDropUpSharpIcon from '@material-ui/icons/ArrowDropUpSharp'
import usStateNames from './USStateNames'
import formatMoney from './FormatMoney'
import { scaleOrdinal } from 'd3-scale'

function colFormat(column) {
  const scale = scaleOrdinal()
    .domain([
      "population",
      "medicaid_reimbursement_lost_per_capita",
      "cost_low",
      "cost_med",
      "cost_high",
      "risk_low",
      "risk_med",
      "risk_high",
      "undercount_low",
      "undercount_med",
      "undercount_high",
      "pop_2017",
      "pop_2018",
      "pop_change"
    ])
    .range([
      "2015 Population",
      "Medicaid reimbursement per capita lost",
      "Cost of low undercount",
      "Cost of medium undercount",
      "Cost of high undercount",
      "Low risk scenario",
      "Medium risk scenario",
      "High risk scenario",
      "Low population miscount",
      "Medium population miscount",
      "High population miscount",
      "2017 Population",
      "2018 Population",
      "Population Change"
    ]);

  if (scale.domain().indexOf(column) > -1) {
    return scale(column);
  } else {
    return column;
  }
}

function cellFormatter(row, column) {
   if ((column.indexOf("Total") > -1) || (column.indexOf("Funding Per Child") > -1) || (column.indexOf("Per Capita") > -1) || (column.indexOf("FY2017 Funding") > -1) || (column.indexOf("medicaid_reimbursement_lost_per_capita") > -1)) {
      return formatMoney(row[column])

   } else if ((column.indexOf("cost_low") > -1) || (column.indexOf("cost_med") > -1) || (column.indexOf("cost_high") > -1)) {
      return formatMoney(row[column], "posneg")
   } else if (column.indexOf("pop_change") > -1) {
      return formatMoney(row[column], "addpercent")
   } else if ((column.indexOf("population") > -1) || (column.indexOf("pop_") > -1) || (column.indexOf("Child Population") > -1) || (column.indexOf("undercount") > -1) ) {
      return row[column].toLocaleString('en-US')

   } else if (column.indexOf("Funding as % of State's Income") > -1) {
     return formatMoney(row[column], "income")

   } else if ((column == "Program") && (row.URL !== "NA") && (row.URL !== "")) {
      return (
         <a target="_blank" href=
            {row.URL}
         >
            {row[column]}
         </a>

      )
   } else {
      return row[column]
   }
}

function compareValues(key, order = 'asc') {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    );
  };
}


class DataTable extends Component {
    constructor(props){
      super(props)
      this.handleClick = this.handleClick.bind(this);
      this.state = {
        data: this.props.data,
        sort: this.props.sort,
        sortorder: this.props.sortorder
      }
    }

    handleClick(e) {
      this.setState({
        sort: e.target.getAttribute("value"),
        sortorder: (this.state.sortorder === "desc" ? "asc" : "desc"),
        data: this.state.data.sort(compareValues(this.state.sort, this.state.sortorder))
      })
    }

    addArrow(c) {
      if (c == this.state.sort && this.state.sortorder == "asc") {
         return <ArrowDropUpSharpIcon style={{verticalAlign:"bottom"}} />
      } else if (c == this.state.sort && this.state.sortorder == "desc") {
         return <ArrowDropDownSharpIcon style={{verticalAlign:"bottom"}} />
      } else {
         return "";
      }
   }

    render() {
      let data = this.props.data;

      data = data.sort(compareValues(this.state.sort, this.state.sortorder))

        if (data.length > 0) {
          return(
            <TableContainer component={Paper}>
              <Table stickyHeader size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    {data.columns.map(column => (
                      <TableCell
                      key={column}
                      onClick={this.handleClick.bind(this)}
                      value={column}
                      data-sortstatus={this.state.sortorder}>
                        {colFormat(column)}
                        {this.addArrow(column)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row,i) => (
                    <TableRow key={i}>
                      {data.columns.map(column => (
                        <TableCell key={column}>
                          { cellFormatter(row, column, this.state.sort) }
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
        } else {
          return <span></span>;
        }

    }


}

export default DataTable
