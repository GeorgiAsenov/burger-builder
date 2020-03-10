import React, { Component } from "react";
import { connect } from "react-redux";
import Aux from "../../hoc/Aux/Aux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as actionTypes from "../../store/actions";

class BurgerBuilder extends Component {
  state = {
    purchassing: false,
    loading: false,
    error: false
  };

  componentDidMount() {
    // axios
    // .get("/ingredients.json")
    // .then(response => {
    //   this.setState({ ingredients: response.data });
    // })
    // .catch(err => {
    //   this.setState({error: true})
    // });
  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((arr, el) => {
        return arr + el;
      }, 0);
    return sum > 0
  }

  purchaseHandler = () => {
    this.setState({ purchassing: true });
  };

  purchaseCancelHandler = () => {
    this.setState({ purchassing: false });
  };

  purchaseContinueHandler = () => {
    this.props.history.push("/checkout");
  };

  render() {
    const disabledIngredients = {
      ...this.props.ings
    };
    for (let key in disabledIngredients) {
      disabledIngredients[key] = disabledIngredients[key] <= 0;
    }
    let orderSummary = null;

    let burger = this.state.error ? (
      <p style={{ textAlign: "center" }}>Something went wrong</p>
    ) : (
      <Spinner />
    );
    if (this.props.ings) {
      burger = (
        <Aux>
          <Burger ingredients={this.props.ings} />
          <BuildControls
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disabledIngredients}
            purchasable={this.updatePurchaseState(this.props.ings)}
            price={this.props.price}
            ordered={this.purchaseHandler}
          />
        </Aux>
      );
      orderSummary = (
        <OrderSummary
          ingredients={this.props.ings}
          purchaseCancelled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
          price={this.props.price}
        />
      );
    }
    if (this.state.loading) {
      orderSummary = <Spinner />;
    }

    return (
      <Aux>
        <Modal
          show={this.state.purchassing}
          clicked={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.ingredients,
    price: state.totalPrice
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (igName) => dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName: igName }),
    onIngredientRemoved: (igName) =>  dispatch({ type: actionTypes.REMOVE_INGREDIENT, ingredientName: igName })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
