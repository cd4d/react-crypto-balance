import { React, useState, useEffect, useRef } from "react";
import { Chart } from "primereact/chart";
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
  const chartRef = useRef(null);

  //console.log(props);


  useEffect(() => {
    function formatData() {
      //console.log("formatting data");
      let tempData = { coinNames: [], coinValues: [] };
      props.balance.map((coin) => {
        tempData.coinNames.push(coin.name);
        tempData.coinValues.push(coin.value);
        return coin;
      });
      // https://stackoverflow.com/questions/28121272/whats-the-best-way-to-update-an-object-in-an-array-in-reactjs
      setFormattedData((prevState) => ({
        ...prevState,
        labels: tempData.coinNames,
        datasets: prevState.datasets.map((el) =>
          el.data ? {...el, data:tempData.coinValues} : {...el}
        )
       
      }));
      //console.log("formattedData after change: ", formattedData);
    }
    formatData();
  }, [props.balance]);

  const lightOptions = {
    plugins: {
      legend: {
        labels: {
          color: "#495057",
        },
      },
    },
  };
  return (
    <div className="card p-d-flex p-jc-center">
      <Chart
        type="doughnut"
        data={formattedData}
        options={lightOptions}
        style={{ position: "relative", width: "40%" }}
        ref={chartRef}
      />
    </div>
  );
}
