import "./Lottery.css";
import * as anchor from "@project-serum/anchor";
import styled from "styled-components";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";
import { Transaction } from "@solana/web3.js";

const ConnectButton = styled(WalletDialogButton)``;

export interface LotteryProps {
  connection: anchor.web3.Connection;
}
const Lottery = (props: LotteryProps) => {
  const connection = props.connection;
  const wallet = useAnchorWallet();
  const noNftTransaction = () => {
    console.log('no-nft');
    const transaction = new Transaction();
    wallet?.signTransaction(transaction);
  }
  const oneNftTransaction = () => {
      console.log('one nft');
  }
  return (
    <div>
      {!wallet ? (
        <ConnectButton id="connect"></ConnectButton>
      ) : (
        <div>
          <button id="no-nfts" onClick={noNftTransaction}> 0.2 SOL </button>
          <button id="one-nft" onClick={oneNftTransaction}> 0 SOL </button>
        </div>
      )}
    </div>
  );
};

export default Lottery;
