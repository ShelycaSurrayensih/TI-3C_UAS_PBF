import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  // Redirect
} from "react-router-dom";
import foto from './K24.jpg'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import './Apotek.css';
import 'font-awesome/css/font-awesome.min.css';
import { connect } from 'react-redux'
import Login from './component/login/Login'
import Keranjang from './component/keranjang/Keranjang'
import SignUp from './component/login/Signup'
// import BlogPost from "./component/admin/BlogPost.jsx"
import firebase from 'firebase'
import firebaseConfig from './config'
import ExampleCRUD from './component/login/ExampleCRUD'

// var coba = 0;

class App extends Component {
  constructor(props) {
    super(props);

    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    } else {
        firebase.app(); // if already initialized, use that one
    }

    this.state = {
        listKeranjang: [],
        user: {}
    }
  }

  authListener() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            this.setState({
                user
            })

            this.ambilDataDariServerAPI(user.uid);

            console.log("User adalah : " + user.email)
        }
        else {
            this.setState({
                user: null
            })
        }
    })
}

  ambilDataDariServerAPI = (uid) => {
    // this.authListener();
    // console.log("uid: "+this.state.user.uid)
    const userRef = firebase.database().ref('keranjang/' + this.state.user.uid);
    userRef.once('value', (snapshot) => {
        let newUserState = [];
        let coba = 0;
        snapshot.forEach(data => {
            const dataVal = data.val()
            newUserState.push({
                id: data.key,
                nama: dataVal.nama,
                harga: dataVal.harga,
                gambar: dataVal.gambar,
                stok: dataVal.stok,
                qty: dataVal.qty
            })
            coba += dataVal.qty
            console.log('Coba : '+ coba)
            this.props.handleKeranjang(coba)
        })
        this.setState({
            listKeranjang: newUserState
        })
        console.log(this.state);
    })
  }

  componentDidMount() {
    this.authListener();
    this.ambilDataDariServerAPI();
  }

  render() {
    console.log(this.state)
    return (
      <Router>
        <div>
  
          <ul className="menu">
            <img src="https://www.k24klik.com/blog/wp-content/uploads/2018/03/Logo-k24klik-hijau-tulisan-new-01-01.png" alt="Gambar" />
            <li>
              <Link to="/login" ><i className="fa fa-user-circle"></i></Link>
            </li>
            <li>
              <Link to="/keranjang" ><i className="fa fa-shopping-cart"></i><span id="cart">{this.props.tOrder}</span></Link>
            </li>
            <li>
              <Link to="/about" ><span>About</span></Link>
            </li>
            <li>
              <Link to="/" ><span>Home</span></Link>
            </li>
          </ul>
  
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/keranjang">
              <Keranjangs />
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/signup">
              <SignUp />
            </Route>
            <Route path="/example">
              <ExampleCRUD />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}


// function App() {
//   // console.log(this.props)
  
// }

function Home() {
  return (
    <div className="carousel-apotek">
    </div>
  );
}

const About = () => {
  return (
    <div className="About">
      {/* <center><h2>Biodata</h2></center> */}
      <br></br>
        <img src={foto}  width="250" height="300"/>
         <p>
       </p>
    <p>
  </p>
      <div id="bio">
        <p id="p-4">K24Klik.com, Aplikasi Beli Obat Online Paling Komplit - Obat Asli Kapanpun!</p>
        <p id="p-4">K24Klik.com yang memiliki slogan “Asli, Komplit, Cepat” hadir sebagai Apotek Online pertama di Indonesia yang "benar-benar" buka 24 Jam non Stop dan terlengkap di Indonesia. Hal ini memudahkan masyarakat Indonesia mendapatkan obat kapan saja, di mana saja dengan cepat. Obat diantar oleh Apotek terdekat ke lokasi pasien. Ya, secara otomatis sistem menentukan Apotek terdekat untuk mengantar obat ke rumah/kantor/lokasi pasien.</p>
        <p id="p-5">Selain KOMPLIT ragam obatnya, K24Klik menjamin semua produk yang dibeli pada situs K24Klik adalah 100% ASLI. Pesanan pun langsung dapat dikirim dengan CEPAT karena dilayani oleh Apotek Mitra K24Klik dan Apotek K-24 terdekat dengan alamat tujuan.</p>
      </div>
     
      {/* <img src={foto} alt="gambar" />
      <div id="kotak" /> */}
    </div>
  );
}

function Keranjangs() {
  return (
    <div>
      <Keranjang />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    tOrder: state.totalOrder
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleKeranjang: (cek) => dispatch({type: 'ADD_ORDER', newValue: cek})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);