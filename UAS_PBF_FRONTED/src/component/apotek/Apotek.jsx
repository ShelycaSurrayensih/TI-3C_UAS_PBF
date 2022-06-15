import React, { Component } from 'react'
import firebase from 'firebase'
import firebaseConfig from '../../config'
import Post from './Post'
import './Apotek.css';

class Apotek extends Component {

    constructor(props) {
      super(props);

      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      } else {
        firebase.app(); // if already initialized, use that one
      }

      this.state = {
        listApotek: []
      }
  
    }

    authListener() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.setState({
            user
          })
          console.log("User adalah : " + user.email)
        }
        else {
          this.setState({
            user: null
          })
        }
      })
    }
  
    ambilDataDariServerAPI = () => {
      const userRef = firebase.database().ref('apotek');
      userRef.on('value', (snapshot) => {
        let newUserState = [];
        snapshot.forEach(data => {
          const dataVal = data.val()
          newUserState.push({
            id: data.key,
            nama: dataVal.nama,
            harga: dataVal.harga,
            gambar: dataVal.gambar,
            stok: dataVal.stok
          })
        })
        this.setState({
          listApotek: newUserState
        })
        console.log(this.state);
      })
    }

    simpanDataKeServerAPI = () => {
        firebase.database()
        .ref("/")
        .set(this.state);
    }
  
    componentDidMount() {
      this.ambilDataDariServerAPI();
      this.authListener();
      console.log(this.state)
    }

    componentDidUpdate(prevProps, prevState) {
      console.log(this.state);
    }

    getDatabyId = userId => {
      const Ref = firebase.database().ref('apotek/' + userId);

      Ref.on('value', (snapshot) => {
        const data = snapshot.val();
        this.writeData(data.id, data.nama, data.harga, data.gambar, data.stok);
        console.log(data);
      })
    }

    writeData = (userId, name, price, imageUrl, stock) => {
  
      var counter=0;
      // var counter2;
      let uid = this.state.user.uid;
  
      const userRef = firebase.database().ref('keranjang/'+uid+"/"+userId);
      userRef.on('value', function(snapshot) {
          if (snapshot.exists()) {
              const data = snapshot.val();
              counter = data.qty;
              console.log("qty:"+counter);
              // alert(counter);
          }
      })

      firebase.database().ref('keranjang/' + uid +"/"+ userId).set({
        id: userId,
        nama: name,
        harga: price,
        gambar: imageUrl,
        stok: stock,
        qty: counter + 1
      });
    }
  
    render() {
      return (
        <div className="post-apotek">
          <center><h2>Daftar Barang</h2></center>
          <div className="tgh">
            {
              this.state.listApotek.map(apotek => {
                return (
                  <Post
                    key={apotek.id}
                    id={apotek.id}
                    nama={apotek.nama}
                    harga={apotek.harga}
                    gambar={apotek.gambar}
                    stok={apotek.stok}
                    tambahApotek={this.getDatabyId}
                    users={this.state.user ? this.state.user.email : null} />
                )
              })
            }
          </div>
        </div>
      )
    }
  }

export default Apotek;