import * as React from "react";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";
import './App.css'

export default function App() {
  const [currAccount, setCurrentAccount] = React.useState("")
  
  const [message, setMessage] = React.useState("")
  const contractAddress = "0x22D8A46318917F0211cE1565b9394D029731F4E8"
  const contractABI = abi.abi
  
  const CheckIfWlletIsConected = () => {
//make sure you have access to windows.ethereum
    const {ethereum} = window;
    if (!ethereum) {
      console.log("make sure you have ethereum");
      return
    } else{
      console.log(" we have the ethereum object", ethereum)
    }

  ethereum.request({method: "eth_accounts"})
  .then(accounts => {
    console.log(accounts)
    if(accounts.lenght !==0){
    const account = accounts[0];
    console.log("found an authorized account", account)
    setCurrentAccount(account);
         getAllWaves();
   }else{
     console.log("Account not authorized")
   }
  })

  }
  
  const connectWallet = () => {
    const { ethereum } = window;
    if (!ethereum) {
    alert("Get metamask!")
  }

  ethereum.request({method: "eth_requestAccounts" })
  .then(accounts => {
    console.log('connected', accounts[0])
    setCurrentAccount(accounts[0])
    getAllWaves()
  })
  .catch(err => console.log(err));
  }

  const wave = async ( ) => {
    if (message.length === 0) {
      alert("Hey, how about writing me a message too? 🤩")
      return
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner();
    const waveportalContract = new ethers.Contract(contractAddress, contractABI, signer);

    let count = await waveportalContract.getTotalWaves()
    console.log("retreat total hug...", count.toNumber())

    setMessage("")

    const waveTxn = await waveportalContract.wave(message, {gasLimit: 300000})
    console.log("mining..🤞👷‍♂️👷‍♀️⚒️⛏️🛠️", waveTxn.hash)
    await waveTxn.wait()
    console.log("Minting --- 😍🤩👏👏", waveTxn.hash)

    count = await waveportalContract.getTotalWaves()
    console.log("Retrieve total hug count", count.toNumber())
  }

  const [allWaves, setAllWaves] = React.useState([])
  async function getAllWaves() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner()
            const waveportalContract = new ethers.Contract(contractAddress, contractABI, signer);

            let waves = await waveportalContract.getAllWaves()    

            let wavesCleaned = []
            waves.forEach( wave =>{ 
              console.log("wave", wave)
              wavesCleaned.push({
                address: wave.waver,
                timestamp: new Date(wave.timestamp * 1000),
                message: wave.massage
              })
            })
            wavesCleaned = wavesCleaned.sort((a, b) => b.timestamp - a.timestamp);

            console.log("cleaned", wavesCleaned)
            setAllWaves(wavesCleaned)

            waveportalContract.on("NewWave", (from, timestamp, message) =>{
              console.log("NewWave event", from, timestamp, message) 
              setAllWaves(oldArray => [{
                address: from,
                timestamp: new Date(timestamp * 1000),
                message:message
              }, ...oldArray ])
            })

  }

 

  React.useEffect(() => {
    CheckIfWlletIsConected ()
  },)
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
       <span> 🤗 </span>Hi send a hug! 
        </div>
        
        <div className="bio">
        I am ebuka, am 24 and I will love to hug 5 billion persons before i turn 50, Connect your Etheruem wallet and send a hug! Is free.
        </div>

        <textarea
          className="textbox"
          value={message}
          onChange={event => setMessage(event.target.value)}
           
        />

        

        <button className="waveButton" onClick={wave}>
          Send Hug
        </button>

        {currAccount ? null : (
          <button className="connectButton" onClick={connectWallet}  > 👉 Connect Wallet 👈  
          </button>
        )}

        {allWaves.map((wave, ndex) =>{
          return (
            <div style={{background: "OLdlace", marginTop:"16px", padding:"18px"}}>
            <div> Address:{wave.address}</div>
            <div> Time:{wave.timestamp.toString()}</div>
            <div> message:{wave.message}</div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
