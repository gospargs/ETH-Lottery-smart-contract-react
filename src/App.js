
import "./App.css";
import React from "react";
import web3 from "./web3";
import lottery from "./lottery";

class App extends React.Component {
  state = {
    // Constructor
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",
  };

  async componentDidMount() {
    // will be called once when the appcomponent is placed on screen

    const manager = await lottery.methods.manager().call(); // when using the metamask provider we dont need to specify the from proprety
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address); // lottery.options.address is an object - Big number js

    this.setState({ manager, players, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts(); // we will asume the first account is the one thats sending the transaction

    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });

    this.setState({ message: "You have been entered!" });
    document.location.reload();
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Waiting on transaction success...'});
    console.log(this.state.balance);
    await lottery.methods.pickWinner().send({
     from: accounts[0] 
    });

    const winner = await lottery.methods.getWinner().call();
    this.setState({message: winner +' has won ' + web3.utils.fromWei(this.state.balance, "ether") + ' ether.'});
    document.location.reload();
  };

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by <strong>{this.state.manager}</strong>. <br/>
           There are currently{" "}
          <strong>{this.state.players.length}</strong> people entered competing to win{" "}
          <strong>{web3.utils.fromWei(this.state.balance, "ether")}</strong> ether!
        </p>
        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>Want to try yout luck?</h4>
          <div>
            <label>Amount of ether to enter </label>
            <input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>
        <hr />
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a winner!</button>
        <hr />

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}
export default App;
