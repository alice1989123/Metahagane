import axios from "axios";
import { addressToBech32, signTx_, submitTx } from "./wallet";

const serverApi = process.env.NEXT_PUBLIC_SERVER_API;

const apiEndPoints = {
  burningTokens: "",
  buyCards: "/api/buy_cards",
  forgeWeapon: "/api/forge-weapon",
};

export async function burningTokens() {
  const address = await addressToBech32();
  const response = await axios.post(
    `${serverApi}${apiEndPoints.burningTokens}`,
    {
      address: address,
    }
  );
  console.log(response);
}

export async function buyCards(buyOption) {
  const address = await addressToBech32();
  const balance = await window.cardano.getBalance();
  const utxos = await window.cardano.getUtxos();

  const response = await axios.post(`${serverApi}${apiEndPoints.buyCards}`, {
    address: address,
    balance: balance,
    utxos: utxos,
    buyOption: buyOption,
  });
  console.log(response.data);
  const signedTx = await signTx_(response.data);
  const txHash = await submitTx(signedTx);

  console.log(`transaction submited with txHash ${txHash}`);
}

export async function forgeWeapon(tokensToBurn) {
  const address = await addressToBech32();
  const balance = await window.cardano.getBalance();
  const utxos = await window.cardano.getUtxos();

  const response = await axios.post(`${serverApi}${apiEndPoints.forgeWeapon}`, {
    address: address,
    balance: balance,
    utxos: utxos,
    tokensToBurn: tokensToBurn,
  });
  console.log(tokensToBurn);
  const signedTx = await signTx_(response.data);
  const txHash = await submitTx(signedTx);

  console.log(`transaction submited with txHash ${txHash}`);
}
