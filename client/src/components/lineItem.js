import React from "react";
import LineItemInput from './line-item-input';

const url = 'http://localhost:5000/'

class LineItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newName: '',
      productBoxes: [],
      products:"",
      hideModal:true,
      hideLineItem: false,
      whatsChecked:[],
    }
  }
  handleChange = (e) => {
    this.setState({ newName: e.target.value })
  }

  async serverFunc(urlEnder, data = {}, method) {
    const response = await fetch(url + urlEnder, {
      method: method,
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrer: "no-referrer",
      body: JSON.stringify(data),
    });
    const json = await response.json();
    return json;
  }

  async delete(urlEnder) {
    const response = await fetch(url+'/farmers/' + urlEnder, {
      method: "DELETE",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrer: "no-referrer",
      // body: JSON.stringify(data),
    });
    const json = await response.json(); // parses JSON response into native JavaScript objects
    // json.status = response.status;
    // json.statusText = response.statusText;
    this.setState({hideLineItem: true})
    return json;
    
  }

  updateName = () => {
    this.serverFunc("farmers/put", { id: this.props.id, name: this.state.newName }, "PUT")
    this.setState({ newName: "" })
  }

  handleEditProductsClick = () => {
    let arr1 = []
    const size = this.props.productList.length;
    let productsArr= this.props.products.map(({name})=>name  )
    for (let i = 0; i < size; i++) {
      if (productsArr.includes(this.props.productList[i].name)) {
        arr1.push(<LineItemInput key={i} checked={true} name={this.props.productList[i].name} farmerID={this.props.id} productID={this.props.productList[i].id}/>)
      } else {
        arr1.push(<LineItemInput key={i} checked={false} name={this.props.productList[i].name} farmerID={this.props.id} productID={this.props.productList[i].id} init={this.props.products}/>)
      }
    }
    this.setState({ productBoxes: arr1,
      hideModal: false })
    // this.setState({ })
  }



  close = () => {
    this.setState({ hideModal: true})
  }

  componentDidMount(){
    let str ="";
    const size = this.props.products.length
    let tempArr= []
    for (let i=0;i<size;i++){
      str =str + this.props.products[i].name +", "
      tempArr.push(this.props.products[i].name)
    }
    this.setState({products:str, whatsChecked: tempArr})

    
  }
  

  render() {
    return (
      <div className={`clLineItem ${this.state.hideLineItem? 'hide':''}` } >
        <span>id:{this.props.id}, {" "} Name: {this.props.name}</span>
        <input type="text" placeholder="new name here" onChange={this.handleChange} value={this.state.newName} />
        <button onClick={this.updateName}>Update Name</button>
        {/* <input/>  */}
        <button onClick={this.handleEditProductsClick}>Edit Products</button>
               Products: {this.state.products}
        <button id="idDeleteFarmer" onClick={() => this.delete(this.props.id)}>Delete</button>

        <div id="myModal" className={`modal ${this.state.hideModal? '':'show'}`}>
          <div className="modal-content">
            <span onClick={this.close} className="close">&times;</span>
            <div className="clModalIn">{this.state.productBoxes}</div>
            {/* <button onClick={()=>this.saveItems()}>Save</button> */}
          </div>
        </div>

      </div>
    )
  }
}

export default LineItem;