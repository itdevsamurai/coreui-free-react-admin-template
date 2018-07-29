import React, { Component } from 'react';
import { Button, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Row } from 'reactstrap';
import { Badge, Card, CardBody, CardHeader, Pagination, PaginationItem, PaginationLink, Table, Form, FormGroup} from 'reactstrap';
import { config, global } from '../../../constants';

const CATEGORIES = [
      {name: 'Sporting Goods', price: '$49.99', stocked: true, desc: 'Football'},
      {name: 'Sporting Goods', price: '$9.99', stocked: true, desc: 'Baseball'},
      {name: 'Sporting Goods', price: '$29.99', stocked: false, desc: 'Basketball'},
      {name: 'Electronics', price: '$99.99', stocked: true, desc: 'iPod Touch'},
      {name: 'Electronics', price: '$399.99', stocked: false, desc: 'iPhone 5'},
      {name: 'Electronics', price: '$199.99', stocked: true, desc: 'Nexus 7'}
    ];

class Category extends Component {

  constructor(props) {
    super(props);
    this.state = {
      _CURRENT_PAGE: 1,
      _PAGE_NUM: 0,
      _COUNT: 0,
      categoryList: CATEGORIES,
    };

    this.handleChange = this.handleChange.bind(this);
    this.getPageNum = this.getPageNum.bind(this);
    this.loadCategories = this.loadCategories.bind(this);
  }

  componentDidMount() {
    this. getPageNum();

    this.loadCategories();
  }


  getPageNum() {
    const token = localStorage.getItem('token') ;

    fetch( config.baseURI + '/category/count', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.json() )
    .catch(error => console.error('Error:', error))
    .then( res => {
      // console.log( res );
      this.setState({ 
        _COUNT: parseInt(res),
        _PAGE_NUM: Math.ceil( parseInt(res) / global.ITEMS_PER_PAGE ),
      });
      // console.log( this.state._PAGE_NUM ); 
    });
  }


  loadCategories() {
    const token = localStorage.getItem('token') ;
    // console.log( 'Bearer ' + token );

    let url = config.baseURI + 
              '/category?_start=' + ( (this.state._CURRENT_PAGE - 1) * global.ITEMS_PER_PAGE )  +
              '&_limit=' + global.ITEMS_PER_PAGE

    fetch( url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.json() )
    .catch(error => console.error('Error:', error))
    .then( res => {
      // console.log( res );
      this.setState({ categoryList: res });
    });
  }


  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }


  render() {

    const { categoryList, _COUNT} = this.state;

    const trs = categoryList.map( (category, i) => {
      return (
        <tr>
          <td>{category.name}</td>
          <td>{category.desc}</td>
          <td>{category.price}</td>
          <td>
            <FormGroup check className="checkbox">
            <Input type="checkbox" />
            </FormGroup>
          </td>
        </tr>
      );
    });


    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col xs="12" lg="12">
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Striped Table
                </CardHeader>
                <CardBody>
                  <Table responsive striped>
                    <thead>
                    <tr>
                      <th>Name</th>
                      <th>Desc</th>
                      <th>Price</th>
                      <th>
                        {'Add/Delete'}
                        <FormGroup check className="checkbox">
                        <Input type="checkbox"/>
                        </FormGroup>
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <Input type="text" id="name-input" name="category-input" placeholder="" />
                        </td>
                        <td>
                          <Input type="text" id="desc-input" name="name-input" placeholder="" />
                        </td>
                         <td>
                          <Input type="text" id="price-input" name="name-input" placeholder="00.00" />
                        </td>
                        <td>
                          <Button type="button" color="primary">Add</Button>
                        </td>
                      </tr>

                      {trs}
                    </tbody>
                  </Table>
                  <p className="text-muted">{'Total of item: ' + _COUNT}</p>

                  <Pagination>
                    <PaginationItem disabled><PaginationLink previous tag="button">Prev</PaginationLink></PaginationItem>
                    <PaginationItem active>
                      <PaginationLink tag="button">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem><PaginationLink tag="button">2</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
                  </Pagination>

                </CardBody>
              </Card>
            </Col>
          </Row>




        </Container>
      </div>
    );
  }
}

export default Category;

