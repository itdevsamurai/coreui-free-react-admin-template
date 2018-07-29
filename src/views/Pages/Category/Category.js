import React, { Component } from 'react';
import { Button, Col, Container, Input, Row, Label } from 'reactstrap';
import { Card, CardBody, CardHeader, CardFooter, Pagination, PaginationItem, PaginationLink, Table, Form, FormGroup} from 'reactstrap';
import { config, global } from '../../../constants';

const CATEGORIES = [
      // {name: 'Sporting Goods', price: '$49.99', stocked: true, desc: 'Football'},
      // {name: 'Sporting Goods', price: '$9.99', stocked: true, desc: 'Baseball'},
      // {name: 'Sporting Goods', price: '$29.99', stocked: false, desc: 'Basketball'},
      // {name: 'Electronics', price: '$99.99', stocked: true, desc: 'iPod Touch'},
      // {name: 'Electronics', price: '$399.99', stocked: false, desc: 'iPhone 5'},
      // {name: 'Electronics', price: '$199.99', stocked: true, desc: 'Nexus 7'}
    ];

class Category extends Component {

  constructor(props) {
    super(props);
    this.state = {
      _CURRENT_PAGE: 1,
      _PAGE_NUM: 0,
      _COUNT: 0,
      editMode: false,
      categoryList: CATEGORIES,
    };

    this.handleChange = this.handleChange.bind(this);
    this.getPageNum = this.getPageNum.bind(this);
    this.loadCategories = this.loadCategories.bind(this);
    this.showPage = this.showPage.bind(this);
    this.addCategory = this.addCategory.bind(this);
    this.editCategory = this.editCategory.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
    this.saveCategory = this.saveCategory.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
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
              '/category?_sort=name:desc&_start=' + ( (this.state._CURRENT_PAGE - 1) * global.ITEMS_PER_PAGE )  +
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

  showPage(page) {
    this.setState({ _CURRENT_PAGE: page });

    this. getPageNum();
    this.loadCategories();
  }


  addCategory() {
    const token = localStorage.getItem('token') ;
    const { newCatName, newCatDesc } = this.state;

    fetch( config.baseURI + '/category', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        name: newCatName,
        desc: newCatDesc,
      }),
    })
    .then( res => {
      // console.log( res );
      this.setState({ 
        newCatName: '',
        newCatDesc: '',
      });
      this. getPageNum();
      this.loadCategories();

    });
  }

  deleteCategory(id) {
    const token = localStorage.getItem('token') ;

    fetch( config.baseURI + '/category/' + id, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then( res => {
      // console.log( res );
      this.getPageNum();
      this.loadCategories();
    });
  }

  editCategory(category) {
    this.setState({ 
        editMode: true,
        editCatID: category.id,
        editCatName: category.name,
        editCatDesc: category.desc,
    });
  }


  saveCategory() {
    const { editCatID, editCatName, editCatDesc} = this.state;
    const token = localStorage.getItem('token') ;

    fetch( config.baseURI + '/category/' + editCatID, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        name: editCatName,
        desc: editCatDesc,
      }),
    })
    .then( res => {
      // console.log( res );
      this.setState({ 
        editMode: false
      });

      this.getPageNum();
      this.loadCategories();
    });
  }

  cancelEdit() {
    this.setState({ 
        editMode: false,
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

    const { categoryList, _COUNT, newCatName, newCatDesc, editMode, editCatName, editCatDesc, _CURRENT_PAGE, _PAGE_NUM } = this.state;

    if ( editMode === true ) {
      return (
        <div className="app flex-row">
          <Container>
            <Row className="justify-content-center">
              <Col xs="12" lg="12">
                <Card>
                <CardHeader>
                  <strong>Category Edit</strong>
                </CardHeader>
                <CardBody>
                  <Form action="" method="post" className="form-horizontal">
                    <FormGroup row>
                      <Label sm="5" htmlFor="input-normal">Name</Label>
                      <Col sm="6">
                        <Input type="text" id="name-input" name="editCatName" placeholder="Category Name ..." value={editCatName} onChange={this.handleChange}/>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label sm="5" htmlFor="input-normal">Description</Label>
                      <Col sm="6">
                        <Input type="text" id="name-input" name="editCatDesc" placeholder="Category Description ..." value={editCatDesc} onChange={this.handleChange}/>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label sm="5" htmlFor="input-normal">Price</Label>
                      <Col sm="6">
                        <Input type="text" id="input-price" name="input-price" placeholder="00.00" />
                      </Col>
                    </FormGroup>

                  </Form>
                </CardBody>
                <CardFooter>
                  <Button type="submit" size="sm" color="success" onClick={this.saveCategory}><i className="fa fa-floppy-o" ></i> Save</Button>
                  <Button type="reset" size="sm" color="secondary" onClick={this.cancelEdit}><i className="fa fa-reply" ></i> Cancel</Button>
                </CardFooter>
              </Card>

              </Col>
            </Row>
          </Container>
        </div>
      );
    }

    const trs = categoryList.map( (category, i) => {
      return (
        <tr>
          <td>{category.name}</td>
          <td>{category.desc}</td>
          <td>{category.price}</td>
          <td>
            <Row>
              <Col xs="6">
                <i className="fa fa-pencil" aria-hidden="true" 
                  onClick={() => this.editCategory({
                    id: category._id,
                    name: category.name,
                    desc: category.desc,
                    price: category.price,
                  })} ></i>
              </Col>
              <Col xs="6">
                <i className="fa fa-trash" aria-hidden="true" onClick={() => this.deleteCategory(category._id)} ></i>
              </Col>
            </Row>
          </td>
        </tr>
      );
    });

    let prevItem = _CURRENT_PAGE < 2?
                  <PaginationItem disabled><PaginationLink previous tag="button">Prev</PaginationLink></PaginationItem>
                  :
                  <PaginationItem onClick={() => this.showPage(_CURRENT_PAGE - 1)}><PaginationLink previous tag="button">Prev</PaginationLink></PaginationItem>;

    let nextItem = _CURRENT_PAGE >= _PAGE_NUM?
                  <PaginationItem disabled><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
                  :
                  <PaginationItem onClick={() => this.showPage(_CURRENT_PAGE + 1)}><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>;

    let pageItem = [];
    for (let i = 0; i < _PAGE_NUM; i++) {
      pageItem.push(
        (i + 1) === _CURRENT_PAGE?
        <PaginationItem active><PaginationLink tag="button" > {i + 1} </PaginationLink></PaginationItem>
        :
        <PaginationItem onClick={() => this.showPage(i + 1)}><PaginationLink tag="button"> {i + 1} </PaginationLink></PaginationItem>
      );
    }

    let pagination = 
      <Pagination>
        {prevItem}
        {pageItem}
        {nextItem}
      </Pagination>;


    return (
      <div className="app flex-row">
        <Container>
          <Row className="justify-content-center">
            <Col xs="12" lg="12">
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i> Category Setting
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
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <Input type="text" id="name-input" name="newCatName" placeholder="" value={newCatName} onChange={this.handleChange}/>
                        </td>
                        <td>
                          <Input type="text" id="desc-input" name="newCatDesc" placeholder="" value={newCatDesc} onChange={this.handleChange}/>
                        </td>
                         <td>
                          <Input type="text" id="price-input" name="price-input" placeholder="00.00" />
                        </td>
                        <td>
                          <Button type="button" color="primary" onClick={this.addCategory} >Add</Button>
                        </td>
                      </tr>

                      {trs}
                    </tbody>
                  </Table>
                  <p className="text-muted">{'Total of item: ' + _COUNT}</p>

                  {pagination}

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

