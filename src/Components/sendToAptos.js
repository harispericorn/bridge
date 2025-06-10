import React, { useState } from "react";
import { ethers } from "ethers";
import { abi, contractAddresses } from "../Constants";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import { ErrorDecoder } from "ethers-decode-error";
const errorDecoder = ErrorDecoder.create([abi]);

const WhitelistForm = ({ data, signer, provider, chainId }) => {
  // State to hold form values
  const [formValues, setFormValues] = useState({
    _dstEid: "",
    _toAddress: "",
    _amountLD: "",
    _minAmountLD: "",
    _nativeFee: "",
    _lzTokenFee: "",
    refundAddress: "",
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
    const amountInWei = ethers.parseEther(formValues._nativeFee);

    let options = Options.newOptions()
      .addExecutorLzReceiveOption(65000, 0)
      .toBytes();
    let dstEid = formValues._dstEid;
    let toAddress = formValues._toAddress;
    let amountLD = formValues._amountLD;
    let zero = "0x";

    console.log("zero=>", zero);
    let minAmountLD = formValues._minAmountLD;
    const sendParam = {
      dstEid: dstEid,
      to: toAddress,
      amountLD: amountLD,
      minAmountLD: minAmountLD,
      extraOptions: options,
      composeMsg: zero,
      oftCmd: zero,
    };
    console.log("sendParam", sendParam);
    const feeQuote = await contract.quoteSend(sendParam, false);
    console.log(feeQuote);
    const nativeFee = feeQuote.nativeFee;

    try {
      const transaction = await contract.send(
        sendParam,
        { nativeFee: nativeFee, lzTokenFee: 0 },
        formValues.refundAddress,
        {
          value: nativeFee,
        }
      );
      setTransactionHash(transaction.hash);
    } catch (error) {
      const decodedError = await errorDecoder.decode(error);
      console.log(decodedError);
      // Prints "Invalid swap with token contract address 0xabcd."
    }
  };

  return (
    <div>
      {data ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="_dstEid">_dstEid:</label>
            <input
              type="text"
              id="_dstEid"
              name="_dstEid"
              value={formValues._dstEid}
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
            <label htmlFor="_minAmountLD">_minAmountLD:</label>
            <input
              type="text"
              id="_minAmountLD"
              name="_minAmountLD"
              value={formValues._minAmountLD}
              onChange={handleChange}
            />
          </div>
          <div>
            <div>
              <label htmlFor="_nativeFee">_nativeFee:</label>
              <input
                type="text"
                id="_nativeFee"
                name="_nativeFee"
                value={formValues._nativeFee}
                onChange={handleChange}
              />
              <div>
                <label htmlFor="_lzTokenFee">_lzTokenFee:</label>
                <input
                  type="text"
                  id="_lzTokenFee"
                  name="_lzTokenFee"
                  value={formValues._lzTokenFee}
                  onChange={handleChange}
                />
              </div>
            </div>
            <label htmlFor="refundAddress">refundAddress:</label>
            <input
              type="text"
              id="refundAddress"
              name="refundAddress"
              value={formValues.refundAddress}
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
