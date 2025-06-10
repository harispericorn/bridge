import React, { useState } from "react";
import { Buffer } from "buffer";
import { contractAddresses } from "../Constants";
import { Options } from "@layerzerolabs/lz-v2-utilities";
const { ethers } = require("ethers");

const RemoteForm = () => {
  const [remoteAddress, setRemoteAddress] = useState(null);
  const [trustedRemote, setTrustedRemote] = useState(null);
  const [formValues, setFormValues] = useState({
    _remoteAddress: "",
    _aptosBridgeAddress: "",
    _remoteBridgeAddress: "",
    _extra_options: "",
  });
  const chainId = 97;
  const contractAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  const convertToPaddedUint8Array = (str, length) => {
    let value = Uint8Array.from(
      Buffer.from(str.replace(/^0x/i, "").padStart(length, "0"), "hex")
    );
    return Uint8Array.from([
      ...new Uint8Array(length - value.length),
      ...value,
    ]);
  };

  const convertToUint8Array2 = (hexString) => {
    let value = Uint8Array.from(
      Buffer.from(hexString.replace(/^0x/i, ""), "hex")
    );

    return value;
  };

  const input = "0x6BAb46a4454f0aE3247798543eEE85ED9269599c";
  const length = 32;
  const paddedArray = convertToPaddedUint8Array(input, length);

  // Convert back to hex for verification
  const hex = "0x" + Buffer.from(paddedArray).toString("hex");

  console.log(hex);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const remoteCoinAddrBytes = convertToPaddedUint8Array(
      formValues._remoteAddress,
      32
    );
    console.log(Array.from(remoteCoinAddrBytes));
    setRemoteAddress(Array.from(remoteCoinAddrBytes));
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    console.log();
    // Concatenate the byte arrays
    // const concatenated = ethers.concat([
    //   formValues._aptosBridgeAddress,
    //   contractAddress,
    // ]);
    let address = formValues._aptosBridgeAddress.toLowerCase();
    const hex = address.replace("0x", "");
    // Ensure the hex string is exactly 64 chars by padding or truncating
    let paddedHex = hex.length > 64 ? hex.slice(-64) : hex.padStart(64, "0");
    // Encode the concatenated bytes as a hex string
    // const encoded = ethers.hexlify(concatenated);
    // console.log("combined=>", encoded);
    paddedHex = convertToPaddedUint8Array(paddedHex, 32);
    console.log("paddedHex==>", paddedHex);
    setTrustedRemote(paddedHex);
  };

  const handleSubmit3 = async (e) => {
    e.preventDefault();
    const remoteCoinAddrBytes = convertToUint8Array2(
      formValues._remoteBridgeAddress,
      32
    );
    console.log(Array.from(remoteCoinAddrBytes));
    setRemoteAddress(Array.from(remoteCoinAddrBytes));
  };

  const handleSubmit4 = async (e) => {
    e.preventDefault();
    const options = Options.newOptions().addExecutorLzReceiveOption(
      BigInt(formValues._max_fee)
    );
    const extra_options = options.toBytes();
    console.log("extra_options ==>", extra_options);
  };

  const handleSubmit5 = async (e) => {
    e.preventDefault();
    const options = new Options().addExecutorLzReceiveOption(200000, 0);
    const extra_options = options.toBytes();
    console.log("extra_options ==>", extra_options);
    setTrustedRemote(extra_options);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  return (
    <div>
      <div>Convert remote coin address</div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="_remoteAddress">remote Address:</label>
          <input
            type="text"
            id="_remoteAddress"
            name="_remoteAddress"
            value={formValues._toAddress}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Convert!</button>
      </form>
      {remoteAddress ? <p>Converted Address: {remoteAddress}</p> : <div></div>}
      <form onSubmit={handleSubmit2}>
        <div>
          <label htmlFor="_remoteAddress">_aptosBridgeAddress</label>
          <input
            type="text"
            id="_aptosBridgeAddress"
            name="_aptosBridgeAddress"
            value={formValues._aptosBridgeAddress}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Convert!</button>
      </form>
      {trustedRemote ? <p>Trusted remote: {trustedRemote}</p> : <div></div>}
      <div>Convert remote::set address</div>
      <form onSubmit={handleSubmit3}>
        <div>
          <label htmlFor="_remoteAddress">remote Bridge Address:</label>
          <input
            type="text"
            id="_remoteBridgeAddress"
            name="_remoteBridgeAddress"
            value={formValues._remoteBridgeAddress}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Convert!</button>
      </form>

      <form onSubmit={handleSubmit4}>
        <div>
          <label htmlFor="_max_fee">Max fee:</label>
          <input
            type="text"
            id="_max_fee"
            name="_max_fee"
            value={formValues._max_fee}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Convert!</button>
      </form>

      <form onSubmit={handleSubmit5}>
        <div>
          <label htmlFor="_extra_options">_extra_options:</label>
          <input
            type="text"
            id="_extra_options"
            name="_extra_options"
            value={formValues._extra_options}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Convert!</button>
      </form>
      {remoteAddress ? <p>Converted Address: {remoteAddress}</p> : <div></div>}
    </div>
  );
};

export default RemoteForm;
