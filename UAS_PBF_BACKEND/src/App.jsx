import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  // Redirect
} from "react-router-dom";
import foto from './polinema.jpg'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import './Apotek.css';
import 'font-awesome/css/font-awesome.min.css';
import { connect } from 'react-redux'
import Login from './component/login/Login'
import Apotek from './component/apotek/Apotek'
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
              <Link to="/about" ><span>About</span></Link>
            </li>
            <li>
              <Link to="/list-product" ><span>List Produk</span></Link>
            </li>
            <li>
              <Link to="/" ><span>Home</span></Link>
            </li>
          </ul>
  
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/list-product">
              <Products />
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
      {/* <img src={apple} id="img-bg" /> */}
      <Carousel showStatus={false} showIndicators={true} showThumbs={false} infiniteLoop={true} autoPlay={true}>
        <div>
          <img src="https://png.pngtree.com/template/20220421/ourmid/pngtree-online-medicine-horizontal-banner-composition-with-slider-more-button-editable-text-image_1115085.jpg" alt="gambar" />
          {/* <p className="legend">Macbook Pro 2020</p> */}
        </div>
        <div>
          <img src="http://adapotek.com/themes/farmacy/img/logo/slider3.jpg" alt="gambar" />
          {/* <p className="legend">Macbook Pro 2019</p> */}
        </div>
        <div>
          <img src="http://assets.kompasiana.com/items/album/2018/08/01/thumb-1528485442-5b61deb5bde575558357d802.jpg" alt="gambar" />
          {/* <p className="legend">Macbook Pro 2018</p> */}
        </div>
      </Carousel>
      <center><p id="promo-t1">PROMO TERBARU</p></center>
      <center><p id="promo-t2">Dapatkan info promo terbaru disini</p></center>

      <div className="promo-content">
        <div className="column">
          <div className="img-promo">
            <img src="https://www.k24klik.com/blog/wp-content/uploads/2017/10/Newsletter-HUT-K24.jpg" alt="gambar" />
          </div>
          <center><p className="nama-promo">Kode Promo : 15HUTAPOTEK</p></center>
        </div>
        <div className="column">
          <div className="img-promo">
            <img src="https://pbs.twimg.com/media/Emm364MXIAMbbuN.jpg:large" alt="gambar" />
          </div>
          <center><p className="nama-promo">Kode Promo : ROYALTY FREE</p></center>
        </div>
        <div className="column">
          <div className="img-promo">
            <img src="https://nos.jkt-1.neo.id/serverless-image-op-0/3b9a8ddb91209dd4c8072136edc66103" alt="gambar" />
          </div>
          <center><p className="nama-promo">Kode Promo : MATA SEHAT</p></center>
        </div>
      </div>
    </div>
  );
}

const About = () => {
  return (
    <div className="About">
      {/* <center><h2>Biodata</h2></center> */}
      <div id="bio">
        <p id="p-1">Hello, We're</p>
        <p id="p-2">Nadia Layra</p>
        <p id="p-2">Shelyca Surrayensih</p>
        <p id="p-2">Tita Wijayanti</p>
        <p id="p-3">Teknik <p id="p-3-2">Informatika</p></p>
        <p id="p-4">kelas TI-3C</p>
        <p id="p-5">We're a student majoring in Information Technology from the Malang State Polytechnic campus who has the ambition to create my own startup.</p>
      </div>
      <img src={foto} alt="gambar" />
      <div id="kotak" />
    </div>
  );
}

function Products() {
  return (
    <div>
      <Apotek />
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