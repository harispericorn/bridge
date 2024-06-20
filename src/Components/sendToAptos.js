import React, { useState } from "react";
import { ethers } from "ethers";
import { abi, contractAddresses } from "../Constants";

const WhitelistForm = ({ data, signer, provider, chainId }) => {
  // State to hold form values
  const [formValues, setFormValues] = useState({
    _token: "",
    _toAddress: "",
    _amountLD: "",
    refundAddress: "",
    zroPaymentAddress: "",
    _adapterParams: "",
  });

  const [transactionHash, setTransactionHash] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!signer) {
      alert("No signer found");
      return;
    }
    console.log("CHAIN", chainId);
    const contractAddress =
      chainId in contractAddresses ? contractAddresses[chainId][0] : null;
    if (!contractAddress) {
      alert("Contract is not in this network");
      return;
    }
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const amountInEther = "0.1"; // Example: 0.1 ETH
    const amountInWei = ethers.parseEther(amountInEther);
    const { refundAddress, zroPaymentAddress } = formValues;
    try {
      const transaction = await contract.sendToAptos(
        formValues._token,
        formValues._toAddress,
        formValues._amountLD,
        {
          refundAddress,
          zroPaymentAddress,
        },
        formValues._adapterParams,
        {
          value: amountInWei,
        }
      );
      setTransactionHash(transaction.hash);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div>
      {data ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="_token">_token:</label>
            <input
              type="text"
              id="_token"
              name="_token"
              value={formValues._token}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="_toAddress">_toAddress:</label>
            <input
              type="text"
              id="_toAddress"
              name="_toAddress"
              value={formValues._toAddress}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="_amountLD">_amountLD:</label>
            <input
              type="text"
              id="_amountLD"
              name="_amountLD"
              value={formValues._amountLD}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="refundAddress">refundAddress:</label>
            <input
              type="text"
              id="refundAddress"
              name="refundAddress"
              value={formValues.refundAddress}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="zroPaymentAddress">zroPaymentAddress:</label>
            <input
              type="text"
              id="zroPaymentAddress"
              name="zroPaymentAddress"
              value={formValues.zroPaymentAddress}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="_adapterParams">_adapterParams:</label>
            <input
              type="text"
              id="_adapterParams"
              name="_adapterParams"
              value={formValues._adapterParams}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      ) : (
        <div> Pls Connect Wallet </div>
      )}
      {transactionHash ? (
        <p>Transaction Hash: {transactionHash}</p>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default WhitelistForm;
