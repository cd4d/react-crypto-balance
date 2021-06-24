import { React, useState, useEffect } from "react";
import BalanceList from "./balance-list/BalanceList";
import BalanceNews from "./balance-news/BalanceNews";
import BalanceChart from "./balance-chart/BalanceChart";

export default function Balance(props) {
  const DEFAULT_BALANCE = [
    {
      name: "Bitcoin",
      id: "bitcoin",
      symbol: "BTC",
      rate: 30000,
      amount: 0.5,
      subUnit: "Satoshi",
      subUnitToUnit: 100000000,
    },
    {
      name: "Ethereum",
      id: "ethereum",
      symbol: "ETH",
      rate: 2000,
      amount: 3,
      subUnit: "GWei",
      subUnitToUnit: 1000000000,
    },
    {
      name: "Tether",
      id: "tether",
      symbol: "USDT",
      rate: 1,
      amount: 3000,
    },

    {
      name: "Dogecoin",
      id: "dogecoin",
      symbol: "DOGE",
      rate: 1,
      amount: 4000,
    },
    {
      name: "Cardano",
      id: "cardano",
      symbol: "ADA",
      rate: 1,
      amount: 150,
    },
    {
      name: "Ripple",
      id: "ripple",
      symbol: "XRP",
      rate: 1,
      amount: 200,
    },
  ];
  const [balance, setBalance] = useState(DEFAULT_BALANCE);
  const [isUpdated, setIsUpdated] = useState(false)
  let total = 0
  function calculateBalance() {
    let tempBalance = balance;
    // calculate value
    tempBalance.map((coin) =>  {
      if (coin.rate && coin.amount) {
        coin.value = +coin.rate * +coin.amount;
      }
      if (coin.value) {
        total += coin.value;
      }
      // get the weight of each
      if (total && total > 0) {
        if (coin.value) {
          coin.weight = coin.value / total;
        }
      }
    });
    return tempBalance;
  }
 function updateBalance(newBalance){
  setBalance(newBalance)
  setIsUpdated(prevState => !prevState)
  }

  useEffect(() => {
    let tempBalance = calculateBalance();
    const callCalculateBalance = () => {
      setBalance(tempBalance);
    };
    callCalculateBalance();
  });

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <BalanceList
            currency={props.currency}
            balance={balance}
            onUpdateBalance={(newBalance) => updateBalance(newBalance)}
          ></BalanceList>
        </div>
        <div className="col-md-6 col-sm-12 ">
          <BalanceChart
            currency={props.currency}
            balance={balance}
            isUpdated={isUpdated}
          ></BalanceChart>

          <BalanceNews balance={balance}></BalanceNews>
        </div>
      </div>
    </div>
  );
}