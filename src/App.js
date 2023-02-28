import React from 'react';
import {Form, Input, Typography, List, Button, Checkbox} from 'antd';
import './App.css';
import { SmileOutlined } from '@ant-design/icons';


/***  1. Create input that will enter items               */
/***  2. Item that will show in the table                 */
/***  3. A main checkbox that will select all the items   */
/***  4. A checkbox and delete in every items             */
/***  5. Text that will show of how many items left       */
/***  6. Filter: All, Active, and Completed               */
/***  7. Button that will clear all the completed items   */

const { Title , Text} = Typography;

const App = () => {
  
  const [ item, setItems ] = React.useState(); 

  const [ todoItems, setTodoItems ] = React.useState(
    JSON.parse(window.localStorage.getItem('todoItems')) || []
  );

  React.useEffect(() => {
    window.localStorage.setItem('todoItems', JSON.stringify(todoItems));
  }, [todoItems]);
  

  const handleAdd = () => {
    setTodoItems(todoItems.concat({
      id: ID(),
      value: `${item}`,
      isDone: false
    }));

    form.resetFields();
  }

  const [ filters, setFilters] = React.useState('All');
  const [form] = Form.useForm();

  const handleChange = ( event ) => {
    setItems(event.target.value);
  }

  const handleCheckBox = (event, key) => {
    let eventValue = event.target.checked;
    setTodoItems(todoItems.map( todoitem => (todoitem.id===key ? {...todoitem, isDone: eventValue} : todoitem)))
  }

  const autoUnchecked = () => {
      const left = todoItems.filter(todoitem => todoitem.isDone === false);
      if (left.length>0){
        return false;
      }return true;
  }

  const handleSelectAllCheckBox = (e) => {
    let eventValue = e.target.checked;
    setTodoItems(todoItems.map( todoitem => (todoitem.id ? {...todoitem, isDone: eventValue} : todoitem)))
  }

  const hasTodoItem = () => {
    if(!disableElement()){
    return todoItems.length > 0;
    }
  }

  const removeItem = (key) => {
    setTodoItems(todoItems.filter(todoitem => todoitem.id === key ? false : true))
  }

  var ID = function () {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  

  const disableText = (z) => {
     return z === true;
  }

  const itemsLeft = () => {
    const left = todoItems.filter(items => items.isDone === false );
    if(left.length === 0){
      return 'Yey! There are no task. '
    }
    return left.length + ' tasks left';
  }

  const clearCompletedButton = () => {
    const cond = todoItems.filter(items => items.isDone === true);
    if(cond.length>0){
      return (
       <Button disabled={disableElement()} onClick={onClickClear} type="primary">Clear Completed</Button>
      )
    }
      return;
  }

  function onClickClear() {
    setTodoItems(todoItems.filter(todoitem => todoitem.isDone === true ? false : true))
  }

  /************************************/
  /****    Creating Edit States    ****/
  /************************************/

  const [editState, setEditState] = React.useState('');
  const [inputState, setInputState] = React.useState(Boolean);

   const handleDouble = (foo, key) => {
    setInputState(foo);
    setEditState(key);
  }


  const handleEditText = (key, value) => {
    const newValue = value.target.value;
    setTodoItems(todoItems.map( todoitem => (todoitem.id === key ? {...todoitem, value: newValue} : todoitem)));
    setEditState('');
    setInputState(false)
  }

  const disableElement = () => {
    if(inputState === true){
      return true
    }
  }

  const cancelEditText = () => {
    setInputState(false);
    setEditState('')
  };

  
  /************************************/
  /**** Creating Filters for Todo  ****/ 
  /************************************/
  
  const FilterList = () => {
    let filteredItems = [];

    switch (filters) {

      case 'Active':
        filteredItems =  todoItems.filter(todoitem => todoitem.isDone === false);
      break;
      case 'Completed':
        filteredItems =  todoItems.filter(todoitem => todoitem.isDone === true);
      break;
      case 'All':
        filteredItems = todoItems.map(item => item)
      break;
      default: 
      break;
    }
    return (
    filteredItems.map(item => ( 
      
        <li key={item.id}>
          <Checkbox disabled={disableElement()} checked={item.isDone} onChange={ (event) => handleCheckBox(event, item.id)}></Checkbox>
          <Text  onDoubleClick={() => handleDouble(true, item.id)} delete={disableText(item.isDone)}>{item.value}</Text>
          <Button disabled={disableElement()} danger onClick={() => removeItem(item.id)}>x</Button>
          {editState === item.id ? 
            <div>
              <Input  id="warning" prefix={<SmileOutlined />} allowClear
                      onPressEnter={(e) => handleEditText(item.id,e)} 
                      placeholder={'Edit something here ....    ' + item.value} /> 
              <Button type='primary' onClick={() => cancelEditText()}>Cancel Edit</Button>
            </div>
          : ''}
        </li>
        )
      )
    )

  }
  return (
  <>
    <div className="container">
      <div className="header">
         <Title>Todo List</Title>
        <Form form={form} onFinish={handleAdd}>
          <Form.Item 
            name="itemInput"
          >
            <Input disabled={disableElement()} placeholder="What are you going to do?" onChange={handleChange}/>
          </Form.Item>
          <Form.Item>
            <Checkbox checked={autoUnchecked()} disabled={!hasTodoItem()} onChange={handleSelectAllCheckBox}></Checkbox>
            <span>{itemsLeft()}</span>
            <div className="filters">
              <Button disabled={disableElement()} onClick={ () => setFilters('All')}>All</Button>
              <Button disabled={disableElement()} onClick={ () => setFilters('Active')}>Active</Button>
              <Button disabled={disableElement()} onClick={ () => setFilters('Completed')}>Completed</Button>
            </div>
          </Form.Item>
          <Form.Item validateStatus="warning">
            <List>
             <FilterList />
            </List>
          </Form.Item>
        </Form>
      </div>
      <div>
          {clearCompletedButton()}
      </div>
    </div>
  </>
 )
  
};

export default App;
