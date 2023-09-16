import { Alchemy, Network,Utils } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { formatEther } from "ethers/utils";
import { Link } from "react-router-dom";
import { Container, Table } from 'react-bootstrap';

const settings = {
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET,
  };
   
export const alchemy = new Alchemy(settings);

export function Home(){
    const [latestBlocks, setLatestBlocks] = useState();
    const [blockNumber, setBlockNumber] = useState();
    const [latestTransactions, setLatestTransactions] = useState();

    useEffect(() => {
        let blockArray = [];
        let transactionArray = [];
        const getLatestBlocks = async () => {
          const blockNumber = await alchemy.core.getBlockNumber()
          setBlockNumber(blockNumber);
          for (let i = 0; i < 15; i++){
            const block = await alchemy.core.getBlock(blockNumber - i);
            blockArray.push(block);
          }
          setLatestBlocks(blockArray);
          console.log("latest block: ", latestBlocks);
        }

        const getLatestTransactions = async () => {
            const lastBlock = await alchemy.core.getBlockWithTransactions(blockNumber);
            for (let i = 0; i < 15; i++){
                transactionArray.push(lastBlock.transactions[i]);
            }
            setLatestTransactions(transactionArray);
            console.log("latest transactions: ", latestTransactions);
        }
    
        getLatestBlocks();
        getLatestTransactions();

    }, []);

    return (
    <div>
        <Container>
        <br/>
        {!latestTransactions || !latestBlocks ? (
            <div> Loading... </div>
        ) : (
            <>
                <Container>
                    <Table striped responsive hover>
                        <thead>
                            <tr>
                                <th colSpan={3}><h3>Latest Blocks</h3></th>
                            </tr>
                            <tr>
                                <th>Block</th>
                                <th>Miner</th>
                                <th>Tx Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(latestBlocks.map((block, i) => {
                            return (
                                <tr key={i}>
                                    <td><Link to={`/block/${block.number}`}>{block.number}</Link> </td>
                                    <td><Link to={`/address/${block.miner}`}>{block.miner.slice(0, 10)}...</Link></td>
                                    <td>{block.transactions.length}</td>
                                </tr>)
                            }))}
                        </tbody>
                    </Table>
                </Container>

                <Container>
                    <Table striped responsive hover>
                        <thead>
                            <tr>
                            <th colSpan={3}><h3>Latest Transactions</h3></th>
                            </tr>
                            <tr>
                                <th>From</th>
                                <th>To</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(latestTransactions.map((transaction, i) => {
                                return (
                                    <tr key={i}>
                                        <td><Link to={`/transaction/${transaction.hash}`}>{transaction.hash.slice(0, 15)}...</Link></td>
                                        <td>
                                            <Link to={`/address/${transaction.from}`}>{transaction.from.slice(0,10)}...</Link> 
                                        </td>
                                        <td>
                                        <Link to={`/address/${transaction.to}`}>{transaction.to.slice(0, 10)}...</Link>
                                        </td>
                                        <td>{Utils.formatEther(transaction.value)} ETH</td>
                                    </tr>)
                                }))}
                        </tbody>
                    </Table>
                </Container>
            </>
        )}
    </Container>
    </div>
    );
}