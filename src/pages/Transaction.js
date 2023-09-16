import { Utils } from 'alchemy-sdk';
import { Link } from "react-router-dom";
import { Container, Table,Badge } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { alchemy } from "./Home";

export function Transaction(){
    const { id } = useParams();
    const [transaction, setTransaction] = useState();
    const [timestamp, setTimestamp] = useState();
    const [value, setValue] = useState();

    useEffect(() => {
        const getTransaction = async () => {
            const transaction = await alchemy.core.getTransactionReceipt(id);
            setTransaction(transaction);
            console.log(transaction);

            const block = await alchemy.core.getBlockWithTransactions(transaction.blockNumber)
            const timestamp = block.timestamp;
            setTimestamp(timestamp);

            let value;
            for (let i = 0; i < block.transactions.length; i++) {
                if(transaction.transactionHash === block.transactions[i].hash){
                    value = Utils.formatEther(block.transactions[i].value);
                    setValue(value);
                }
            }
        }
        getTransaction();
    }, [id])


    return (
    <div>
        <Container>
        <br/>
        {!transaction ? (
            <div>Loading...</div>
        ) : (
            <>
                <h3>Transaction #{transaction.transactionHash.slice(0,12)}...</h3>
                <Table responsive>
                    <thead></thead>
                    <tbody>
                        <tr>
                            <td>Transaction Hash: </td>
                            <td>{transaction.transactionHash}</td>
                        </tr>
                        <tr>
                            <td>Block Number: </td>
                            <td><Link to={`/block/${transaction.blockNumber}`}>{transaction.blockNumber}</Link> <Badge bg="secondary">{transaction.confirmations} Block Confirmations</Badge></td>
                        </tr>
                        <tr>
                            <td>Timestamp: </td>
                            <td>{timestamp}</td>
                        </tr>
                        <tr>
                            <td>
                                From:
                                <br/>
                                To:
                            </td>
                            <td>
                                <Link to={`/address/${transaction.from}`}>{transaction.from}</Link>
                                <br/>
                                <Link to={`/address/${transaction.to}`}>{transaction.to}</Link>
                            </td>
                        </tr>
                        <tr>
                            <td>Value: </td>
                            <td>{value} ETH</td>
                        </tr>
                        <tr>
                            <td>Gas Used: </td>
                            <td>{Utils.formatEther(transaction.gasUsed)} ETH</td>
                        </tr>
                        <tr>
                            <td>Gas Price: </td>
                            <td>{Utils.formatEther(transaction.effectiveGasPrice)} ETH</td>
                        </tr>
                    </tbody>
                </Table>
            </>
        )
        }
        </Container>
    </div>
    )
}