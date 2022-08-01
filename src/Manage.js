import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");

const truncate = (input, len) =>
    input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const TextArea = styled.textarea`
    padding: 10px;
    border: none;
    background-color: var(--primary);
    font-weight: bold;
    font-size: 15px;
    min-height: 200px;
    max-width: 500px;
    min-width: 500px;
    color: var(--primary-text);
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;
// border: 4px dashed var(--secondary);

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    const [addingAddresses, setaddingAddresses] = useState(false);
    const [feedback, setFeedback] = useState(`PLEASE make Sure You've UPDATED the Addresses List inside Addresses.txt , each address in one line `);
    const [mintAmount, setMintAmount] = useState(1);
    const [copySuccess, setCopySuccess] = useState('');
    const [copy, setCopy] = useState(false);
    const [Whitelisted, setWhitelisted] = useState([]);
    const [whitelistProcess, setwhitelistProcess] = useState(false);
    const [PublicProcess, setPublicProcess] = useState(false);
    const Address = useRef();
    const [CONFIG, SET_CONFIG] = useState({
        CONTRACT_ADDRESS: "",
        NETWORK: {
            NAME: "",
            SYMBOL: "",
            ID: 0,
        },

        SHOW_BACKGROUND: false,
    });

    const [Roothash, setRoothash] = useState("");



    const whitelist = async (state) => {
        console.log(state);
        console.log(data.whitelistEnabled);

        try {
            setwhitelistProcess(true);
            const TX = await blockchain.smartContract
                .setWhitelistEnabled(state)
            setRoothash("Please Wait ...")
            let Res = await TX.wait(1)
            console.log(Res)
            await dispatch(fetchData(blockchain.account, 1));
            setwhitelistProcess(false);
            if (state) {
                setRoothash("Whitelist Mint Enabled , Make Sure You Edited the Addresses.txt file And Set The RootHash");
            } else {
                setRoothash("Whitelist Mint Disabled");
            }

            // .send({
            //     from: blockchain.account,
            //     to: CONFIG.CONTRACT_ADDRESS
            // })
            // .on('transactionHash', function (hash) {
            //     console.log(hash)
            // })
            // .on('confirmation', async (confirmationNumber, receipt) => {

            //     console.log(receipt)
            //     console.log(confirmationNumber)
            //     console.log(window.ethereum._events)
            //     if (confirmationNumber > 0) {
            //         // try {
            //         //     await ethereum.removeAllListeners()
            //         // } catch (err) {
            //         //     console.log(err)
            //         // }

            //         await dispatch(fetchData(blockchain.account,1));
            //         setwhitelistProcess(false);

            //         if (state) {
            //             setRoothash("Whitelist Mint Enabled , Make Sure You Edited the Addresses.txt file And Set The RootHash");
            //         } else {
            //             setRoothash("Whitelist Mint Disabled");
            //         }
            //     }

            // });
        } catch (error) {
            console.log(error);
            setRoothash("Something Went Wrong , Please Try Again.");

        }

    }

    const Public = async (state) => {
        console.log(state);
        try {
            setPublicProcess(true);
            const TX = await blockchain.smartContract
                .setPaused(state)
            setRoothash("Please Wait ...")
            let Res = await TX.wait(1)
            console.log(Res)
            await dispatch(fetchData(blockchain.account, 1));
            setPublicProcess(false);

            if (state) {
                setRoothash("Public Mint Disabled");
            } else {
                setRoothash("Public Mint Enabled , Please Disable Whitelist Mint if Not Disabled");
            }
            // .send({
            //     from: blockchain.account,
            //     to: CONFIG.CONTRACT_ADDRESS
            // })
            // .on('transactionHash', function (hash) {
            //     console.log(hash)
            // })
            // .on('confirmation', async (confirmationNumber, receipt) => {

            //     console.log(receipt)
            //     console.log(confirmationNumber)
            //     if (confirmationNumber > 0) {
            //         try {
            //             await ethereum.removeAllListeners()
            //         } catch (err) {
            //             console.log(err)
            //         }
            //         await dispatch(fetchData(blockchain.account,1));
            //         setPublicProcess(false);

            //         if (state) {
            //             setRoothash("Public Mint Disabled");
            //         } else {
            //             setRoothash("Public Mint Enabled , Please Disable Whitelist Mint if Not Disabled");
            //         }
            //     }

            // });
        } catch (error) {
            console.log(error);
            setRoothash("Something Went Wrong , Please Try Again.");

        }

    }
    const RootHash = async e => {

        const leaf = Whitelisted.map(addr => keccak256(addr));
        const Merkletree = new MerkleTree(leaf, keccak256, { sortPairs: true });

        const rootHash = Merkletree.getRoot().toString('hex');
        const adddd = keccak256(blockchain.account);

        const proof = Merkletree.getHexProof(adddd);
        var hash = "0x" + rootHash;
        setCopy(true)
        if (copy) {
            try {
                let TX = await blockchain.smartContract
                    .setMerkleRoot(hash)
                setRoothash("Please Wait ...")
                let Res = await TX.wait(1)
                console.log(Res)
                setRoothash("Successfully Set Merkle Tree RootHash , You can Enable Whitelist if Not Enabled ")
                // .call(
                //     {
                //         to: CONFIG.CONTRACT_ADDRESS,
                //         from: blockchain.account
                //     }
                // ).then(async (receipt) => {
                //     console.log(receipt);
                //     setRoothash("Please Wait ...")
                //     await blockchain.smartContract
                //         .setMerkleRoot(hash).send(
                //             {
                //                 to: CONFIG.CONTRACT_ADDRESS,
                //                 from: blockchain.account
                //             }
                //         )

                //     setRoothash("Successfully Set Merkle Tree RootHash , You can Enable Whitelist if Not Enabled ")

                // });
            }
            catch (error) {
                console.log(error);
                setRoothash("Something Went Wrong , Please Try Again.");

            }
        } else {
            setRoothash("Root Hash : 0x" + rootHash);
        }

    };



    const getData = () => {
        if (blockchain.account !== "" && blockchain.smartContract !== null) {
            dispatch(fetchData(blockchain.account, 1));
        }
    };

    const getConfig = async () => {
        const configResponse = await fetch("/config/config.json", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        const config = await configResponse.json();
        SET_CONFIG(config);
    };

    const getWhitelistedAddresses = async () => {
        const Data = await fetch("/config/Addresses.txt", {
            headers: {
                "Content-Type": "plain/text",
                Accept: "plain/text",
            },
        });
        var Addresses = await Data.text();
        Addresses = Addresses.split('\n')
        setWhitelisted(Addresses)
    }

    useEffect(() => {
        getConfig();
        getWhitelistedAddresses();
    }, []);

    useEffect(() => {
        getData();
    }, [blockchain.account]);

    return (
        <s.Screen>
            <s.Container
                flex={1}
                ai={"center"}
                style={{ padding: 24, backgroundColor: "var(--primary)" }}
                image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}
            >
                <a href={CONFIG.MARKETPLACE_LINK}>
                    <StyledLogo alt={"logo"} src={"/config/images/logo.png"} />
                </a>
                <s.SpacerSmall />
                <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
                    <s.Container
                        flex={2}
                        jc={"center"}
                        ai={"center"}
                        style={{
                            backgroundColor: "var(--accent)",
                            padding: 24,
                            borderRadius: 24,
                            opacity: 0.8,
                            boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
                        }}
                    >



                        <s.SpacerSmall />

                        <>

                            <s.SpacerXSmall />

                            <s.SpacerSmall />
                            {blockchain.account === "" ||
                                blockchain.smartContract === null ? (
                                <s.Container ai={"center"} jc={"center"}>
                                    <s.TextDescription
                                        style={{ textAlign: "center", color: "var(--accent-text)" }}
                                    >
                                        Please Connect Your Wallet
                                    </s.TextDescription>
                                    <s.SpacerSmall />
                                    <StyledButton
                                        onClick={(e) => {
                                            e.preventDefault();
                                            dispatch(connect());
                                            getData();
                                        }}
                                    >
                                        CONNECT
                                    </StyledButton>
                                    {blockchain.errorMsg !== "" ? (
                                        <>
                                            <s.SpacerSmall />
                                            <s.TextDescription
                                                style={{
                                                    textAlign: "center",
                                                    color: "var(--accent-text)",
                                                }}
                                            >
                                                {blockchain.errorMsg}
                                            </s.TextDescription>
                                        </>
                                    ) : null}
                                </s.Container>
                            ) : (

                                data.owner === blockchain.account ? (
                                    <>
                                        <s.TextDescription
                                            style={{
                                                textAlign: "center",
                                                color: "var(--accent-text)",
                                            }}
                                        >
                                            {feedback}
                                        </s.TextDescription>
                                        <s.SpacerMedium />

                                        <s.Container ai={"center"} jc={"center"} fd={"row"}>
                                            <StyledButton
                                                style={
                                                    { width: "110px" }
                                                }
                                                onClick={(e) => {
                                                    // e.preventDefault();
                                                    RootHash();
                                                }}
                                            >
                                                {copy ? "Confirm" : "SetRootHash"}
                                            </StyledButton>

                                        </s.Container>
                                        <s.SpacerSmall />
                                        <s.TextDescription
                                            style={{
                                                textAlign: "center",
                                                color: "var(--accent-text)",
                                            }}
                                        >
                                            {Roothash}
                                        </s.TextDescription>

                                        <s.SpacerSmall />
                                        <s.Container ai={"center"} jc={"center"} fd={"row"}>
                                            {data.whitelistEnabled ? (

                                                <StyledButton
                                                    style={
                                                        { width: "150px" }
                                                    }
                                                    disabled={whitelistProcess ? 1 : 0}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        whitelist(false);
                                                        getData();
                                                    }}
                                                >
                                                    {whitelistProcess ? "Disabling ..." : "Disable Whitelist"}
                                                </StyledButton>
                                            ) : (
                                                <StyledButton
                                                    style={
                                                        { width: "150px" }
                                                    }
                                                    disabled={whitelistProcess ? 1 : 0}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        whitelist(true);
                                                        getData();
                                                    }}
                                                >
                                                    {whitelistProcess ? "Enabling ..." : "Enable Whitelist"}
                                                </StyledButton>
                                            )}


                                        </s.Container>

                                        <s.SpacerMedium />
                                        <s.Container ai={"center"} jc={"center"} fd={"row"}>
                                            {data.paused ? (
                                                <StyledButton
                                                    style={
                                                        { width: "150px" }
                                                    }
                                                    disabled={PublicProcess ? 1 : 0}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        Public(false);
                                                        getData();
                                                    }}
                                                >
                                                    {PublicProcess ? "Enabling ..." : "Enable Public"}
                                                </StyledButton>

                                            ) : (
                                                <StyledButton
                                                    style={
                                                        { width: "150px" }
                                                    }
                                                    disabled={PublicProcess ? 1 : 0}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        Public(true);
                                                        getData();
                                                    }}
                                                >
                                                    {PublicProcess ? "Disabling ..." : "Disable Public"}
                                                </StyledButton>
                                            )}


                                        </s.Container>


                                    </>
                                ) : (
                                    <>
                                        <s.TextTitle
                                            style={{ textAlign: "center", color: "var(--accent-text)" }}
                                        >
                                            403 : You're Not Authorized To Access This Page
                                        </s.TextTitle>

                                    </>)

                            )}
                        </>
                        <s.SpacerMedium />
                    </s.Container>
                </ResponsiveWrapper>
                <s.SpacerMedium />

            </s.Container>
        </s.Screen>
    );
}

export default App;
