import "./Home.css";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, CircularProgress, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import * as anchor from "@project-serum/anchor";

import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { WalletDialogButton } from "@solana/wallet-adapter-material-ui";

import {
  //CandyMachine,
  //getCandyMachineState,
  shortenAddress,
} from "./candy-machine";
import { getTotalNfts, postMint, postNoNftLottery } from "./back-services";

const ConnectButton = styled(WalletDialogButton)``;

//const CounterText = styled.span``; // add your styles here

const MintContainer = styled.div``; // add your styles here

const MintButton = styled(Button)``; // add your styles here

export interface HomeProps {
  candyMachineId: anchor.web3.PublicKey;
  config: anchor.web3.PublicKey;
  connection: anchor.web3.Connection;
  startDate: number;
  treasury: anchor.web3.PublicKey;
  txTimeout: number;
}

const Home = (props: HomeProps) => {
  const [balance, setBalance] = useState<number>();
  //const [isActive, setIsActive] = useState(false); // true when countdown completes
  //const [isSoldOut, setIsSoldOut] = useState(false); // true when items remaining is zero
  const [isMinting, setIsMinting] = useState(false); // true when user got to press MINT
  const [isNoNftLottery, setIsNoNftLottery] = useState(false); // true when user is pressing NO NFT LOTTERY
  const [isOneNftLottery, setIsOneNftLottery] = useState(false); // true when user is pressing ONE OR MORE NFT LOTTERY

  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: "",
    severity: undefined,
  });

  //const [startDate, setStartDate] = useState(new Date(props.startDate));

  const wallet = useAnchorWallet();
  //const [candyMachine, setCandyMachine] = useState<CandyMachine>();

  const onMint = async () => {
    setIsMinting(true);
    try{
      if(wallet){
        const totalNfts = await getTotalNfts();
        if(totalNfts <= 0){
          setAlertState({
            open: true,
            message: "NFTs Sold Out!",
            severity: "error"
          });
          return;
        }
        const transaction = new anchor.web3.Transaction({
          feePayer: wallet.publicKey,
        }).add(
          anchor.web3.SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: new PublicKey(
              "36yegJUQjRjqyGvVtWyBFFSWPG1RFmETdKb75wux2qGp"
            ), // lottery address
            lamports: anchor.web3.LAMPORTS_PER_SOL * /*2*/ 1, // IMPORTANTE PONER 2 AQUI
          })
        );
        const blkHashObj = await props.connection.getRecentBlockhash();
        transaction.recentBlockhash = blkHashObj.blockhash;

        const signature = await wallet.signTransaction(transaction); // signature of sender
        const txSignature = await props.connection.sendRawTransaction(
          signature.serialize()
        ); // send the transaction signed
        const confirmed = await props.connection.confirmTransaction(
          txSignature
        );
        if(confirmed.value.err != null){
          setAlertState({
            open: true,
            message: "Mint's transaction couldn't be confirmed",
            severity: "error"
          });
        }else{
          postMint(txSignature)
          .then(res => {
            console.log(res);
          })
        }
      }else{
        setAlertState({
          open: true,
          message: "Wallet is not connected!",
          severity: "error"
        });
      }
    }catch(error: any){
      console.log(error);
      setAlertState({
        open: true,
        message: "Error in the connection",
        severity: "error"
      });
    }finally{
      setIsMinting(false);
    }
    /* try {
      setIsMinting(true);
      if (wallet && candyMachine?.program) {
        const mintTxId = await mintOneToken(
          candyMachine,
          props.config,
          wallet.publicKey,
          props.treasury
        );

        const status = await awaitTransactionSignatureConfirmation(
          mintTxId,
          props.txTimeout,
          props.connection,
          "singleGossip",
          false
        );

        if (!status?.err) {
          setAlertState({
            open: true,
            message: "Congratulations! Mint succeeded!",
            severity: "success",
          });
        } else {
          setAlertState({
            open: true,
            message: "Mint failed! Please try again!",
            severity: "error",
          });
        }
      }
    } catch (error: any) {
      // TODO: blech:
      let message = error.msg || "Minting failed! Please try again!";
      if (!error.msg) {
        if (error.message.indexOf("0x138")) {
        } else if (error.message.indexOf("0x137")) {
          message = `SOLD OUT!`;
        } else if (error.message.indexOf("0x135")) {
          message = `Insufficient funds to mint. Please fund your wallet.`;
        }
      } else {
        if (error.code === 311) {
          message = `SOLD OUT!`;
          setIsSoldOut(true);
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`;
        }
      }

      setAlertState({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      if (wallet) {
        const balance = await props.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
      setIsMinting(false);
    } */

  };

  const onNftLottery = async (noNft: boolean) => {
    try {
      noNft? setIsNoNftLottery(true) : setIsOneNftLottery(false);
      if (wallet) {
        const transaction = new anchor.web3.Transaction({
          feePayer: wallet.publicKey,
        }).add(
          anchor.web3.SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: new PublicKey(
              "HkkTZqLJ6VEDKgpc1tQgrxfUzr5vQoLL6sHozpkeBdC4"
            ), // lottery address
            lamports: anchor.web3.LAMPORTS_PER_SOL * (noNft ? 0.2 : 0), // transfer of 0.2 sols
          })
        );
        const blkHashObj = await props.connection.getRecentBlockhash();
        transaction.recentBlockhash = blkHashObj.blockhash;

        const signature = await wallet.signTransaction(transaction); // signature of sender
        const txSignature = await props.connection.sendRawTransaction(
          signature.serialize()
        ); // send the transaction signed
        const confirmed = await props.connection.confirmTransaction(
          txSignature
        );
        if(confirmed.value.err != null){
          setAlertState({
            open: true,
            message: "Transaction couldn't be confirmed",
            severity: "error"
          });
        }else{
          postNoNftLottery(txSignature)
          .then(res => {
            const numberLottery = res.number;
            setAlertState({
              open:true,
              message: `#${numberLottery} Ticket created!`,
              severity: "success"
            })
          })
          .catch(err => {
            console.log(err);
          })
        }
      }
    } catch (error: any) {
      console.log(error);
      setAlertState({
        open: true,
        message: "Something went wrong",
        severity: "error",
      });
    } finally {
      if (wallet) {
        const balance = await props.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
      noNft? setIsNoNftLottery(false) : setIsOneNftLottery(false);
    }
  };
  useEffect(() => {
    (async () => {
      if (wallet) {
        const balance = await props.connection.getBalance(wallet.publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      }
    })();
  }, [wallet, props.connection]);

  /* useEffect(() => {
    (async () => {
      if (!wallet) return;

      const { candyMachine, goLiveDate, itemsRemaining } =
        await getCandyMachineState(
          wallet as anchor.Wallet,
          props.candyMachineId,
          props.connection
        );

      setIsSoldOut(itemsRemaining === 0);
      setStartDate(goLiveDate);
      setCandyMachine(candyMachine);
    })();
  }, [wallet, props.candyMachineId, props.connection]); */

  return (
    <main>
      {wallet && (
        <p className="stats">
          Address: {shortenAddress(wallet.publicKey.toBase58() || "")}
        </p>
      )}

      {wallet && (
        <p className="stats">Balance: {(balance || 0).toLocaleString()} SOL</p>
      )}

      <MintContainer className="mint">
        {!wallet ? (
          <ConnectButton className="btn">Connect Wallet</ConnectButton>
        ) : (
          <MintButton
            className="btn"
            disabled={isMinting}
            onClick={onMint}
            variant="contained"
          >
            {isMinting? <CircularProgress/> : "¥  MINT  ¥"}
          </MintButton>
        )}
      </MintContainer>
      {wallet && (
        <button
          id="no-nfts"
          onClick={() => {
            onNftLottery(true);
          }}
        >
          {" "}
          {!isNoNftLottery ? "¥  NO NFT LOTTERY  ¥" : <CircularProgress />}{" "}
        </button>
      )}
      {wallet && (
        <button
          id="one-nft"
          onClick={() => {
            onNftLottery(false);
          }}
        >
          {" "}
          {!isOneNftLottery ? (
            "¥  MINTED NFT LOTTERY  ¥"
          ) : (
            <CircularProgress />
          )}{" "}
        </button>
      )}

      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={() => setAlertState({ ...alertState, open: false })}
      >
        <Alert
          onClose={() => setAlertState({ ...alertState, open: false })}
          severity={alertState.severity}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </main>
  );
};

interface AlertState {
  open: boolean;
  message: string;
  severity: "success" | "info" | "warning" | "error" | undefined;
}

/* const renderCounter = ({ days, hours, minutes, seconds, completed }: any) => {
  return (
    <CounterText>
      {hours} hours, {minutes} minutes, {seconds} seconds
    </CounterText>
  );
}; */

export default Home;
