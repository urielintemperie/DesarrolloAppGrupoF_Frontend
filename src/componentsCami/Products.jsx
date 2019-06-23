import React, {Component} from 'react'

class Products extends Component {

  constructor(props) {
    super(props);
    
    this.state = {};
    this.state.filterText = "";
    this.state.products = props.value;

  }
  handleUserInput(filterText) {
    this.setState({filterText: filterText});
  };
  handleRowDel(product) {
    var index = this.state.products.indexOf(product);
    this.state.products.splice(index, 1);
    this.setState(this.state.products);
  };

  handleAddEvent(evt) {
    var id = (+ new Date() + Math.floor(Math.random() * 999999)).toString(36);
    var product = {
      id: id,
      name: "",
      price: "",
      category: "",
      qty: 0
    }
    this.state.products.push(product);
    this.setState(this.state.products);
    this.addProduct(this.state.products)
    }

    addProduct(value){
      this.props.onChange('products',value)
    }

  handleProductTable(evt) {
    var item = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value
    };
var products = this.state.products.slice();
  var newProducts = products.map(function(product) {

    for (var key in product) {
      if (key === item.name && product.id === item.id) {
        product[key] = item.value;

      }
    }
    return product;
  });
    this.setState({products:newProducts});
  //  console.log(this.state.products);
  };
  render() {
    return (
      <div>
        <h2>Productos a comprar:</h2>
        <br/>
        <ProductTable prodNumber={this.state.products.length} onProductTableUpdate={this.handleProductTable.bind(this)} onRowAdd={this.handleAddEvent.bind(this)} onRowDel={this.handleRowDel.bind(this)} products={this.state.products} filterText={this.state.filterText}/>
      </div>
    );

  }

}

class ProductTable extends Component {

  render() {
    var onProductTableUpdate = this.props.onProductTableUpdate;
    var rowDel = this.props.onRowDel;
    var filterText = this.props.filterText;
    var product = this.props.products.map(function(product) {
      if (product.name.indexOf(filterText) === -1) {
        // eslint-disable-next-line
        return;
      }
      return (<ProductRow onProductTableUpdate={onProductTableUpdate} product={product} onDelEvent={rowDel.bind(this)} key={product.id}/>)
    });

    if(this.props.prodNumber !== 0){
      return (
      
        <div>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Precio por unidad</th>
                <th>Cantidad por persona</th>
              </tr>
            </thead>
  
            <tbody>
              {product}
  
            </tbody>
  
          </table>
          <button type="button" onClick={this.props.onRowAdd} className="btn btn-success pull-right">Agregar Producto</button>
        </div>
      );
      }
      else{
        return(<button type="button" onClick={this.props.onRowAdd} className="btn btn-success pull-right">Agregar Producto</button>)
    }
    
  }

}

class ProductRow extends Component {
  onDelEvent() {
    this.props.onDelEvent(this.props.product);

  }
  render() {

    return (
      <tr className="eachRow">
        <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
          type: "name",
          value: this.props.product.name,
          id: this.props.product.id,
          inputType: 'text'
        }}/>
        <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
          type: "price",
          value: this.props.product.price,
          id: this.props.product.id,
          inputType: 'number'
        }}/>
        <EditableCell onProductTableUpdate={this.props.onProductTableUpdate} cellData={{
          type: "qty",
          value: this.props.product.qty,
          id: this.props.product.id,
          inputType: "number"
        }}/>
        <td className="del-cell">
          <input type="button" onClick={this.onDelEvent.bind(this)} value="X" className="del-btn"/>
        </td>
      </tr>
    );

  }

}
class EditableCell extends Component {

  render() {
    return (
      <td>
        <input type={this.props.inputType} name={this.props.cellData.type} id={this.props.cellData.id} value={this.props.cellData.value} onChange={this.props.onProductTableUpdate}/>
      </td>
    );

  }

}

export default Products

//<SearchBar filterText={this.state.filterText} onUserInput={this.handleUserInput.bind(this)}/>

// class SearchBar extends Component {
//   handleChange() {
//     this.props.onUserInput(this.refs.filterTextInput.value);
//   }
//   render() {
//     return (
//       <div>

//         <input type="text" placeholder="Search..." value={this.props.filterText} ref="filterTextInput" onChange={this.handleChange.bind(this)}/>

//       </div>

//     );
//   }

//}
