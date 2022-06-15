import React, { Component } from 'react'
import firebase from 'firebase'
import firebaseConfig from '../../config'
import Post from './Post'
import './Apotek.css';

class Apotek extends Component {

    constructor(props) {
      super(props);
      this.state = {
        listApotek: []
      }
  
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
    }

    componentDidUpdate(prevProps, prevState) {
      if (prevState !== this.state) {
        console.log(this.state);
      }
    }

    handleHapusApotek = (id) => {
      const { listApotek } = this.state;
      const newState = listApotek.filter(data => {
          return data.id !== id;
      })
      this.setState({
          ...this.state,
          listApotek: newState
      })

      firebase.database().ref("apotek/" + id).remove();
    }

    handleTombolSimpan = () => {            // fungsi untuk meng-handle tombol simpan
      let id = this.refs.id.value;
      let nama = this.refs.nama.value; // this.refs mengacu pada input field (input text, textarea, dll)
      let harga = this.refs.harga.value;
      let gambar = this.refs.gambar.value;   
      let stok = this.refs.stok.value;   

      if (id && nama && harga && gambar && stok) { //cek apakah seua data memiliki nilai (tidak null)
          const {listApotek} = this.state;
          const indeksApotek = listApotek.findIndex(data => {
              return data.id === id;
          });
          listApotek[indeksApotek].nama = nama;
          listApotek[indeksApotek].harga = harga;
          listApotek[indeksApotek].stok = stok;
          listApotek[indeksApotek].gambar = gambar;
          this.setState({listApotek});          
      } else if (nama && harga && stok && gambar) { // jika data belum ada di server
          const id = new Date().getTime().toString();
          const { listApotek } = this.state;
          listApotek.push({id, nama, harga, gambar, stok});
          this.setState({ listApotek });   
          
          firebase.database().ref("apotek/" + id)
            .set({
                id: id,
                nama: nama,
                harga: harga,
                gambar: gambar,
                stok: stok
            });
      }

      this.refs.nama.value = "";
      this.refs.harga.value = "";
      this.refs.stok.value = "";
      this.refs.gambar.value = "";
      this.refs.id.value ="";
    };
  
    render() {
      return (
        <div className="post-apotek">
          <center><h2>Daftar Barang</h2></center>
          <div className="form pb-2 border-bottom">
            <div className="form-group row">
                <label className="col-sm-3 col-form-label">Nama Produk</label>
                <div className="col-sm-7">
                    <input type="text" className="form-control" id="nama" name="nama" ref="nama"/>
                </div>
            </div>
            <div className="form-group row">
                <label className="col-sm-3 col-form-label">Harga</label>
                <div className="col-sm-7">
                <input type="text" className="form-control" id="harga" name="harga" ref="harga"/>
                </div>
            </div>
            <div className="form-group row">
                <label className="col-sm-3 col-form-label">Stok</label>
                <div className="col-sm-7">
                <input type="number" className="form-control" id="stok" name="stok" ref="stok"/>
                </div>
            </div>
            <div className="form-group row">
                <label className="col-sm-3 col-form-label">Link Gambar</label>
                <div className="col-sm-7">
                <input type="text" className="form-control" id="gambar" name="gambar" ref="gambar"/>
                </div>
            </div>
            <input type="hidden" name="id" ref="id"/>
            <button type="submit" className="btn btn-primary" onClick={this.handleTombolSimpan} >Simpan</button>
          </div>
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
                    hapusApotek = {this.handleHapusApotek}
                    />
                )
              })
            }
          </div>
        </div>
      )
    }
  }

export default Apotek;