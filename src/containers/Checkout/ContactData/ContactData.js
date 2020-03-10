import React, { Component } from "react";
import { connect } from 'react-redux'
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import orderForm from '../../../assets/OrderForm/OrderForm'
import axios from "../../../axios-orders";
import classes from "./ContactData.css";

class ContactData extends Component {
  state = {
    orderForm: orderForm,
    formIsValid: false,
    loading: false
  };

  orderHandler = event => {
    event.preventDefault();
    const formData = {};
    for (const formElementIndentifier in this.state.orderForm) {
      formData[formElementIndentifier] = this.state.orderForm[
        formElementIndentifier
      ].value;
    }
    this.setState({ loading: true });
    const order = {
      orderData: formData,
      ingredients: this.props.ingredients,
      price: this.props.price
    };

    axios
      .post("/orders.json", order)
      .then(r => {
        this.setState({ loading: false });
        this.props.history.push("/");
      })
      .catch(err => {
        this.setState({ loading: false });
      });
  };

  checkValidity(value, rules) {
    let isValid = true;
    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }
    if(rules.minLength) {
      isValid = value.length >= rules.minLength && isValid
    }

    if(rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid
    }
    return isValid;
  }

  inputChangedHandler = (event, inputIdentifier) => {
    const updatedOrderForm = {
      ...this.state.orderForm
    };
    const updatedOrderElement = {
      ...updatedOrderForm[inputIdentifier]
    };
    updatedOrderElement.value = event.target.value;
    updatedOrderElement.valid = this.checkValidity(
      updatedOrderElement.value,
      updatedOrderElement.validation
    );
    updatedOrderElement.touched = true
    updatedOrderForm[inputIdentifier] = updatedOrderElement;

    let formIsValid = true
    for (const inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid
    }
    this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
  };

  render() {
    const formElementsArray = [];
    for (const key in this.state.orderForm) {
      formElementsArray.push({
        id: key,
        config: this.state.orderForm[key]
      });
    }
    let form = (
      <form onSubmit={this.orderHandler}>
        {formElementsArray.map(formElement => {
          return (
            <Input
              key={formElement.id}
              elementType={formElement.config.elementType}
              elementConfig={formElement.config.elementConfig}
              value={formElement.config.value}
              shouldValidate={formElement.config.validation}
              touched={formElement.config.touched}
              invalid={!formElement.config.valid}
              changed={event => this.inputChangedHandler(event, formElement.id)}
            />
          );
        })}
        <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
      </form>
    );
    if (this.state.loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        {form}
        <h4>Enter your contact data</h4>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.ingredients,
    price: state.totalPrice
  }
}

export default connect(mapStateToProps)(ContactData) 
