import {
  React,
  useEffect,
  useRef,
  useState,
  useCallback,
  useContext,
} from "react";
import { InputText } from "primereact/inputtext";

// coins list for adding coin search function
import coinsList from "../../../../coins-list-sorted.json";
import { fetchRates } from "../../../../API/API-calls";
import CurrencyContext from "../../../../store/currency-context";

export default function AddCoin({ balance, onUpdateBalance,addCoinInputDisplayed,setAddCoinInputDisplayed }) {
  const inputRef = useRef(null);
  const [searchInput, setSearchInput] = useState("");
  // the temporary list of coins matching search
  const [resultSearch, setResultSearch] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState({ id: "", amount: 0 });
  const currencyCtx = useContext(CurrencyContext);

  //format currency: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString
  const formatCurrency = (value, inputCurrency) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      currency: inputCurrency ? inputCurrency : "USD",
    });
  };

  const searchCoin = useCallback((enteredInput) => {
    // console.log("searchCoin input: ", enteredInput);
    let result = [];
    if (!enteredInput.trim()) {
      return [];
    }
    coinsList.map((coin) => {
      if (coin && enteredInput.trim().length > 1) {
        if (coin.id && coin.id.includes(enteredInput.toLowerCase())) {
          result.push(coin);
        }
        if (coin.symbol && coin.symbol.includes(enteredInput.toLowerCase())) {
          result.push(coin);
        }
      }
      return null;
    });
    console.log(result);
    return result;
  }, []);

  // searching coin name from local coin list
  // debounce hook
  useEffect(() => {
    const timer = setTimeout(() => {
      // executes search function only every 500ms
      const results = searchCoin(searchInput);
      setResultSearch(results);
    }, 500);
    return () => {
      // resets the timer, only last timer active (debouncing)
      clearTimeout(timer);
    };
  }, [searchInput, searchCoin]);

  // fetching rate of new coin
  useEffect(() => {
    async function getRates() {
      let currentRate = 1;
      const response = await fetchRates([selectedCoin.id], currencyCtx);
      //ex. {"cardano": {"usd": 1.31 }}
      // TODO add error message
      if (response.status >= 200 && response.status <= 299) {
        const formattedResponse = await response.json();
        currentRate = await formattedResponse[selectedCoin.id][currencyCtx];
      }
      inputCoin(+currentRate, "rate");
    }
    // prevents launching at first render
    if (selectedCoin.id) {
      getRates();
    }
  }, [selectedCoin.id, currencyCtx]);

  function toggleAddCoin() {
    setAddCoinInputDisplayed((prevState) => !prevState);
  }

  function addCoin(coin) {
    if (coin && coin.id && coin.amount) {
      // Need to destructure balance to update list
      const updatedBalance = [...balance, coin];
      console.log("updating balance: ", updatedBalance);
      onUpdateBalance(updatedBalance);
      closeInput();
    }
  }

  function setSearchCoin(e) {
    setSearchInput(e);
  }
  function closeInput() {
    setSearchInput("");
    setSelectedCoin({ id: "", amount: 0 });
    toggleAddCoin();
  }

  function inputCoin(input, property) {
    // convert id to lowercase and update input field
    if (property === "id") {
      // filling the input with selected value using ref so debounce hook not triggered
      inputRef.current.value = input.id;
      setSelectedCoin(input);
      // empty result array
      setResultSearch([]);
    } else {
      setSelectedCoin((prevState) => ({
        ...prevState,
        [property]: input,
      }));
    }
  }

  return (
    <>
      {addCoinInputDisplayed ? (
        <div className="row mt-2 mb-2">
          <h6>
            Add coin: {selectedCoin.name}{" "}
            {selectedCoin.amount > 0 &&
              selectedCoin.rate &&
              formatCurrency(selectedCoin.rate * +selectedCoin.amount)}
          </h6>
          <div className="col">
            <div>
              {/* Add coin id input */}
              <InputText
                ref={inputRef}
                id="search-box"
                placeholder="Coin name"
                onChange={(e) => {
                  setSearchCoin(e.target.value);
                }}
              />
              {/* List of matching coins */}
              {resultSearch && resultSearch.length > 0 && (
                <ul className="list-group">
                  {resultSearch.map((coin, idx) => (
                    <li
                      key={idx}
                      className="list-group-item list-group-item-action"
                    >
                      {/* omitting arrow notation causes render bug */}
                      <span onClick={() => inputCoin(coin, "id")}>
                        {coin.id}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {/* Input amount of coin, disabled if no coin selected */}
          <div className="col ps-0">
            <div>
              <InputText
                disabled={!selectedCoin.id}
                type="number"
                min={0}
                id="add-coin-input-amount"
                placeholder="Coin amount"
                onChange={(e) => inputCoin(e.target.value, "amount")}
              />
            </div>
          </div>

          <div className="col pt-2">
            {/* confirm and add coin */}
            {selectedCoin.id && selectedCoin.amount && (
              <span
                style={{ cursor: "pointer" }}
                onClick={() => addCoin(selectedCoin)}
              >
                <span className="pi pi-check"></span>
              </span>
            )}
            {/* close and cancel */}
            <span style={{ cursor: "pointer" }} onClick={closeInput}>
              <span className="pi pi-times"></span>
            </span>
          </div>
        </div>
      ) : (
        <button
          // label="Add coin"
          onClick={toggleAddCoin}
          type="button"
          className="btn btn-primary mt-1 mb-2 btn-sm"
        ><i className="pi pi-plus" aria-hidden="true"></i>
            <span className="d-sm-none d-lg-inline"> Add coin</span></button>
      )}
    </>
  );
}
