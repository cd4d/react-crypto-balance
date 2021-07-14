import { React, useState, useEffect, useContext } from "react";
import { Chart } from "primereact/chart";
import { formatCurrency } from "../../../utils/utils";
import CurrencyContext from "../../../store/currency-context";

export default function BalanceChart(props) {
  const initialChartData = {
    labels: ["a", "b", "c"],
    datasets: [
      {
        data: ["1000", "2000", "3000"],
        backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726"],
        hoverBackgroundColor: ["#64B5F6", "#81C784", "#FFB74D"],
      },
    ],
  };
  const [formattedData, setFormattedData] = useState(initialChartData);
  const currencyCtx = useContext(CurrencyContext);

  //const [isChartLoading, setIsChartLoading] = useState(false);
  //console.log(props);

  useEffect(() => {
    function formatData() {
      let tempData = { coinNames: [], coinValues: [] };
      props.balance.map((coin) => {
        tempData.coinNames.push(coin.name);
        tempData.coinValues.push(coin.value);
        return coin;
      });
      // https://stackoverflow.com/questions/28121272/whats-the-best-way-to-update-an-object-in-an-array-in-reactjs
      // console.log(tempData);
      setFormattedData((prevState) => ({
        ...prevState,
        labels: tempData.coinNames,
        datasets: prevState.datasets.map((el) =>
          el.data ? { ...el, data: tempData.coinValues } : { ...el }
        ),
      }));
    }
    formatData();
  }, [props.balance, props.isUpdated]);

  const chartOptions = {
    responsive: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#495057",
        },
      },
    },
  };
  return (
    <>
      {/* {props.isBalanceLoading && (
        <div>
          <i className="pi pi-spin pi-spinner" style={{ fontSize: "2rem" }}></i>
        </div>
      )} */}

      <div className="">
        <h4>Total: {formatCurrency(props.total, currencyCtx)}</h4>
        <Chart
          type="doughnut"
          data={formattedData}
          options={chartOptions}
          style={props.isBalanceLoading ? { display: "none" } : {}}

          // style={{ minWidth:"20vw",maxWidth:"23vw"}}
          // style={{position: "relative", height:"45vh", width:"23vw"}}
        />
      </div>
    </>
  );
}
