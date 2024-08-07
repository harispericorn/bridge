import logo from "./logo.svg";
import "./App.css";
import WhitelistForm from "./Components/sendToAptos.js";
import RemoteForm from "./Components/setRemoteCoin.js";
import { useState } from "react";
import { ethers } from "ethers";

function App() {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [chainId, setChainId] = useState(null);

  async function connectWallet() {
    if (!connected) {
      // Connect the wallet using ethers.js
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      let chainId = (await provider.getNetwork()).chainId;
      console.log(parseInt(chainId, 10));
      setChainId(parseInt(chainId, 10));
      setSigner(signer);
      setProvider(provider);
      const _walletAddress = await signer.getAddress();
      setConnected(true);
      setWalletAddress(_walletAddress);
    } else {
      // Disconnect the wallet
      window.ethereum.selectedAddress = null;
      setConnected(false);
      setWalletAddress("");
    }
  }

  return (
    <div className="App">
      <div className="app">
        <div className="main">
          <div className="content">
            <button className="btn" onClick={connectWallet}>
              {connected ? "Disconnect Wallet" : "Connect Wallet"}
            </button>
            <h3>Address</h3>
            <h4 className="wal-add">{walletAddress}</h4>
          </div>
        </div>
      </div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Test project</h1>
        <WhitelistForm
          data={connected}
          signer={signer}
          provider={provider}
          chainId={chainId}
        />
        <RemoteForm />
      </header>
    </div>
  );
}

export default App;
