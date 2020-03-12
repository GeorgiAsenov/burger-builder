import React, { Component } from "react";
import { connect } from "react-redux";
import Aux from "../../hoc/Aux/Aux";
import axios from "../../axios-orders";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../store/actions/index";

class BurgerBuilder extends Component {
  state = {
    purchassing: false,
    loading: false,
    error: false
  };

  componentDidMount() {
    this.props.onInitIngredients();
  }

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((arr, el) => {
        return arr + el;
      }, 0);
    return sum > 0;
  }

  purchaseHandler = () => {
    this.setState({ purchassing: true });
  };

  purchaseCancelHandler = () => {
    this.setState({ purchassing: false });
  };

  purchaseContinueHandler = () => {
    this.props.onInitPurchase()
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

    let burger = this.props.error ? (
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
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: igName => dispatch(actions.addIngredient(igName)),
    onIngredientRemoved: igName => dispatch(actions.removeIngredient(igName)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchase: () => dispatch(actions.purchaseInit())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
