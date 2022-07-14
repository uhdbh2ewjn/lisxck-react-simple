// おまじない
/** @type {import("react")} */
var React = window.React;
/** @type {import("axios")} */
var axios = window.axios;

/** @type {React.FC<{ productName: string }>} */
const Modal = ({ productName, children }) => {
  return (
    <div className="modal">
      <div className="modal-box relative">
        <label for="my-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
        <h3 className="text-lg font-bold">{productName}アカウント</h3>
        <div>
          {children}
        </div>
      </div>
    </div>
  )
}

/** @type {React.FC<{ product: string, placeholder: string, wrong(): boolean, state: string, setState: React.Dispatch<React.SetStateAction<string>>, highlight: string }>} */
const TextField = React.memo(({ product, placeholder, wrong, state, setState, highlight }) => {
  const cb = React.useCallback((e) => setState(e.target.value), [setState]);
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">{product}を入力してください</span>
      </label>
      <input type="text" placeholder={placeholder} className="input input-bordered w-full max-w-xs"
        value={state} onChange={cb} />
      <label className="label">
        <span className="label-text-alt text-red-400" style={wrong() ? { display: "block" } : { display: "none" }}>{highlight}を入力してください</span>
      </label>
    </div>
  )
});

/** @type {React.FC} */
const Navbar = () => {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-none">
        <button className="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            className="inline-block w-5 h-5 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16">
            </path>
          </svg>
        </button>
      </div>
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">自動販売機</a>
      </div>
      <div className="flex-none">
        <button className="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            className="inline-block w-5 h-5 stroke-current">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z">
            </path>
          </svg>
        </button>
      </div>
    </div>
  )
}

/** @type {React.FC} */
const App = () => {
  const [product, setProduct] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [paypayurl, setPaypayurl] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [mail, setMail] = React.useState("");

  const [amounts, setAmounts] = React.useState({});
  const [stocks, setStocks] = React.useState({});

  React.useEffect(() => {
    console.log("load");
    axios.get("https://api.lisxck.fyi/stock")
      .then((res) => {
        setAmounts({
          amount1: res.data.stock1.amount
        });
        setStocks({
          stock1: res.data.stock1.stock
        });
      })
      .catch(() => location.href = "/500/500.html");

  }, []);

  function susumu(pn) {
    setProduct(pn);
  }

  const buy = () => {
    axios.post('https://api.lisxck.fyi/vending',
      {
        productname: product,
        amount: amount,
        paypayurl: paypayurl,
        password: password,
        mailaddress: mail
      },
      {
        validateStatus: () => true,
      }
    )
      .then(response => {
        if (response.status === 200) {
          localStorage.setItem('accounts', response.data.stock);
          location.href = "./vending/success.html";
        }
        if (response.status === 400 || response.status === 403) {
          alert("誤った情報が入力されています");
          return;
        }
        if (response.status >= 500) {
          alert("不明なエラーです")
          return;
        }
      })
  };
  return (
    <>
      <div className="payment" id="payment">
        <input type={"checkbox"} id="my-modal" className="modal-toggle" />
        <Modal productName="old">
          <TextField product="個数" placeholder="1" wrong={() => !amount || amount.length === 4}
            state={amount} setState={setAmount} highlight="個数" />
          <TextField product="paypayURL" placeholder="https://pay.paypay.ne.jp/qxkiJGhA" wrong={() => !paypayurl.match(/^https:\/\/pay\.paypay\.ne\.jp\/[a-zA-Z0-9]{8}$/)}
            state={paypayurl} setState={setPaypayurl} highlight="正しいPayPayURL" />
          <TextField product="パスワード" placeholder="1234" wrong={() => password && !password.match(/^\d{4}$/)}
            state={password} setState={setPassword} highlight="パスワードがある場合、正しいパスワード4桁" />
          <TextField product="購入後にアカウントが送信されるメールアドレス" placeholder="info@lisxck.fyi" wrong={() => !mail}
            state={mail} setState={setMail} highlight="正しいメールアドレス" />
          <div className="buy-button">
            <button className="btn btn-success" id="buy-button" onClick={() => buy()}>購入</button>
          </div>
        </Modal>
      </div>
      <Navbar />
      <div className="products">
        <div className="card w-96 bg-base-100 shadow-xl" id="product">
          <figure>
            <img src="https://lisxck.fyi/Twitter.jpg" alt="Shoes" />
          </figure>
          <div className="card-body">
            <h2 className="card-title">TwitterOLDアカウント</h2>
            <p>
              TwitterのOLDアカウントです。作成年が古いので凍結されにくい効果があります！
              <br />
              <br />
              1アカウント : {amounts.amount1}円
              <br />
              在庫 : {stocks.stock1}
            </p>
            <div className="card-actions justify-end" onClick={() => susumu("old")}>
              <label for="my-modal" className="btn modal-button">購入に進む</label>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <div>
          <p>Created by せんちゃん</p>
        </div>
      </footer>
    </>
  )
}

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(<App />)