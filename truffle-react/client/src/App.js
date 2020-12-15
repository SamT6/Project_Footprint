import React, {useState} from 'react';
import Web3 from "web3";
import { MetaMaskButton } from 'rimble-ui';
import "./App.css";

import {footprint_obj} from "./contracts/abi.js"
import {dex_obj} from "./contracts/abi.js"
import {chg_obj} from "./contracts/abi.js"


const web3 = new Web3(Web3.givenProvider);

const footprintContract = new web3.eth.Contract(footprint_obj.abi, footprint_obj.address);
const dexContract = new web3.eth.Contract(dex_obj.abi, dex_obj.address);
const chgContract = new web3.eth.Contract(chg_obj.abi, chg_obj.address);


const DeX = ({ethAccount}) => {
  const [buyAmount, setBuyAmount] = useState(0);
  const [sellAmount, setSellAmount] = useState(0);

  const buy = async (t) => {
    t.preventDefault()
    const tx = await dexContract.methods.buy().send({
      from: ethAccount,
      value: web3.utils.toWei(buyAmount, "ether")
    })
  }

  const sell = async (t) => {
    t.preventDefault()
    const tx = await dexContract.methods.sell(sellAmount).send({
      from: ethAccount,
    })
  }
  return(
    <div className="card">
      <h2>Decentralized Exchange for <br/> CHG token</h2>
      <form className="form" onSubmit={buy}>
            <label for="buy">Buy:</label>
            <input type="text" id="buy" onChange={(t)=>{setBuyAmount(t.target.value)}}/>
            <button className="button">submit</button>
      </form>
      <form className="form" onSubmit={sell}>
            <label for="sell">Sell:</label>
            <input type="text" id="sell" onChange={(t)=>{setSellAmount(t.target.value)}}/>
            <button className="button">submit</button>
      </form>
    </div>
  )
}

const Footprint = ({ethAccount}) => {
  const [proposeProjectTopic, setProposeProjectTopic] = useState("");
  const [proposeProjectName, setProposeProjectName] = useState("");
  const [fundProjectID, setFundProjectID] = useState(0);
  const [fundProjectAmount, setFundProjectAmount] = useState(0);
  const [getProjectID, setGetProjectID] = useState(0);
  //Project info
  const [owner, setOwner] = useState("");
  const [topic, setTopic] = useState("");
  const [name, setName] = useState("");
  const [valuation, setValuation] = useState("");

  const propse_project = async (t) => {
    t.preventDefault();
    console.log('topic: ', proposeProjectTopic);
    console.log('name: ', proposeProjectName);

    const tx = await footprintContract.methods.proposeProject(proposeProjectTopic, proposeProjectName).send({
      from: ethAccount,
    })
  }

  const fund_project = async (t) => {
    t.preventDefault();
    const tx = await footprintContract.methods.fundProject(fundProjectID, fundProjectAmount).send({
      from: ethAccount,
    })
  }

  const get_project = async (t) => {
    t.preventDefault();
    const tx = await footprintContract.methods.getProject(getProjectID).call();
    console.log(tx);
    setOwner(tx[0]);
    setTopic(tx[1]);
    setName(tx[2]);
    setValuation(tx[3]);
  }

  return(
      <div className="card">
          <h2>Project Proposal</h2>
          <form className="form" onSubmit={propse_project}>
            <label for="topic">Topic:</label>
            <input type="text" id="topic" onChange={(t)=>{setProposeProjectTopic(t.target.value)}}/>
            <br/>
            <label for="name">Name:</label>
            <input type="text" id="name" onChange={(t)=>{setProposeProjectName(t.target.value)}}/>
            <br/>
            <button className="button">submit</button>
          </form>

          <h2>Funder Management</h2>
          <form className="form" onSubmit={fund_project}>
            <label for="project-id">Project ID:</label>
            <input type="text" id="project-id" onChange={(t)=>{setFundProjectID(t.target.value)}}/>
            <br/>
            <label for="funding-amount">Funding amount: <br/> (1 ETH = 1 CHG)</label>
            <input type="text" id="funding-amount" onChange={(t)=>{setFundProjectAmount(t.target.value)}}/>
            <br/>
            <button className="button">submit</button>
          </form>

          <h2>Project</h2>
          <form className="form" onSubmit={get_project}>
            <label for="project-id">Project ID:</label>
            <input type="text" id="project-id" onChange={(t)=>{setGetProjectID(t.target.value)}}/>
            <br/>
            <button className="button">submit</button>
          </form>
          <div>
            <h3>{topic} {name} {valuation}</h3>
            <p>{owner}</p>
          </div>
      </div>
  )
}

const CHGToken = ({ethAccount}) => {
  const [chgAmount, setChgAmount] = useState("");
  const [transferAddress, setTransferAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState(0);
  const [approveAddress, setApproveAddress] = useState("");
  const [approveAmount, setApproveAmount] = useState(0);
  const [allowanceAddress, setAllowanceAddress] = useState("");
  const [allowanceAmount, setAllowanceAmount] = useState("");

  const get_chg_amount = async (t) => {
    t.preventDefault()
    const tx = await chgContract.methods.balanceOf(ethAccount).call();
    setChgAmount(tx);
  }

  const transfer = async (t) => {
    t.preventDefault()
    const tx = await chgContract.methods.transfer(transferAddress, transferAmount).send({
      from: ethAccount,
    })
  }

  const approve = async (t) => {
    t.preventDefault()
    const tx = await chgContract.methods.approve(approveAddress, approveAmount).send({
      from: ethAccount,
    })
  }

  const get_allowance = async (t) => {
    t.preventDefault()
    const tx = await chgContract.methods.allowance(ethAccount, allowanceAddress).call();
    setAllowanceAmount(tx);
  }

  return(
    <div className="card">
      <h2>CHG Token</h2>
      <p>my balance: {chgAmount}</p>
      <button className="button" onClick={get_chg_amount}>get CHG amount</button>
      <br/>
      <form className="form" onSubmit={transfer}>
        <h3>Transfer</h3>
        <label for="to">To:</label>
        <input type="text" id="to" onChange={(t)=>{setTransferAddress(t.target.value)}}/>
        <br/>
        <label for="amount">Amount:</label>
        <input type="text" id="amount" onChange={(t)=>{setTransferAmount(t.target.value)}}/>
        <br/>
        <button className="button">submit</button>
      </form>
      <br/>
      <br/>
      <form className="form" onSubmit={approve}>
        <h3>Approve</h3>
        <label for="to">To:</label>
        <input type="text" id="to" onChange={(t)=>{setApproveAddress(t.target.value)}}/>
        <br/>
        <label for="amount">Amount:</label>
        <input type="text" id="amount" onChange={(t)=>{setApproveAmount(t.target.value)}}/>
        <br/>
        <button className="button">submit</button>
      </form>
      <br/>
      <br/>
      <form className="form" onSubmit={get_allowance}>
        <h3>Allowance</h3>
        <label for="to">To:</label>
        <input type="text" id="to" onChange={(t)=>{setAllowanceAddress(t.target.value)}}/>
        <button className="button">submit</button>
      </form>
      <p>allowance: {allowanceAmount}</p>
    </div>
  )
}

const App = () => {
  const [ethAccount, setEthAccount] = useState("");

  const connect_metamask = async () => {
    const accounts = await window.ethereum.enable();
    setEthAccount(accounts[0]);
  } 

  return(
    <div className="main">
      <div className="card">
          <h1>Project Footprint</h1>
          <h2>General Info</h2>
          <p>address: {ethAccount}</p>
          <MetaMaskButton.Outline onClick={connect_metamask}>Connect with MetaMask</MetaMaskButton.Outline>
          <p>CHG address: {chg_obj.address}</p>
          <p>DeX address: {dex_obj.address}</p>
          <p>Footprint address: {footprint_obj.address}</p>
      </div>
      <CHGToken ethAccount={ethAccount}/>
      <DeX ethAccount={ethAccount}/>
      <Footprint ethAccount={ethAccount}/>
    </div>
  );

}


export default App;