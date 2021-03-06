import React, { Component } from 'react'
import firebase from 'firebase'
import firebaseConfig from '../../config'
import PostKeranjang from './PostKeranjang'
import { connect } from 'react-redux'

// var coba = 0;

class Keranjang extends Component {

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

        this.authListener();

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
            })
            this.setState({
                listKeranjang: newUserState
            })
            // console.log(this.state);
        })
    }

    // simpanDataKeServerAPI = () => {
    //     // 
    // }

    // componentWillMount() {
    //   this.authListener();
    // }

    componentDidMount() {
        // this.authListener();
        this.ambilDataDariServerAPI();
    }

    componentDidUpdate(prevProps, prevState) {
        // if(prevState !== this.state){
        //     this.simpanDataKeServerAPI();
        // }
    }

    handleHapusApotek = (idProduk) => {
        const { listKeranjang } = this.state;
        const newState = listKeranjang.filter(data => {
            return data.id !== idProduk;
        })
        this.setState({
            ...this.state,
            listKeranjang: newState
        })

        firebase.database().ref("keranjang/" + this.state.user.uid + "/" + idProduk).remove();
    }

    handleUpdateApotek = (idProduk, name, price, imageUrl, stock, counter) => {
        
        if (counter<=stock){
            firebase.database().ref("keranjang/" + this.state.user.uid + "/" + idProduk)
            .set({
                id: idProduk,
                nama: name,
                harga: price,
                gambar: imageUrl,
                stok: stock,
                qty: counter 
            });
        } else {
            return window.alert('Permintaan melebihi stok, harap ulangi kembali!!')
        }
    }

    render() {
        console.log(this.state);
        var no = 0;
        var total = 0;
        var totalQty = 0;
        return (
            <div className="post-apotek">
                {
                  /* <div className="form pb-2 border-bottom">
                      <button type="submit" className="btn btn-primary" onClick={this.handleTombolSimpan}>Simpan</button>
                  </div> */}
                <center><h2>Keranjang</h2></center>
                <div className="tgh">
                    <table border="1" cellPadding="5" width="100%">
                        <tr>
                            <th align="center">No</th>
                            {/* <th align="center">ID Produk</th> */}
                            <th align="left">Nama</th>
                            <th align="center">Gambar</th>
                            <th align="center">Harga</th>
                            <th align="center">Qty</th>
                            <th align="center">Subtotal</th>
                            <th align="center">Opsi</th>
                        </tr>
                        {
                            this.state.listKeranjang.map(apotek => {
                                no += 1;
                                total += apotek.harga * apotek.qty
                                totalQty += apotek.qty
                                this.props.handleKeranjang(totalQty)
                                return (
                                    <PostKeranjang
                                        no={no}
                                        key={apotek.id}
                                        id={apotek.id}
                                        nama={apotek.nama}
                                        harga={apotek.harga}
                                        gambar={apotek.gambar}
                                        stok={apotek.stok}
                                        qty={apotek.qty}
                                        tambahApotek={this.handleGetApotek}
                                        updateApotek={this.handleUpdateApotek}
                                        hapusApotek={this.handleHapusApotek} />
                                )
                            })
                        }
                        {/* {this.props.handleKeranjang()} */}
                        <tr>
                            <td colSpan="6" align="right">Total : </td>
                            <td align="center">{total}</td>
                        </tr>
                    </table>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        tOrder: state.totalOrder
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        handleKeranjang: (cek) => dispatch({ type: 'ADD_ORDER', newValue: cek })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Keranjang);