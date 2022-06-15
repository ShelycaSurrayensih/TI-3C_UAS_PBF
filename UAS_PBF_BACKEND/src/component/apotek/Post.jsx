import React from 'react'

const Post = (brg) => {
    return (
  
      <div className="apotek">
        <div className="konten-apotek">
          {/* <p id="id-brg">ID : {brg.id}</p> */}
          <div className="gambar-apotek">
            <img src={brg.gambar} width="150" height="150" alt="" />
          </div>
          <div className="isi-apotek">
            <p id="nama-brg">{brg.nama}</p>
  
            <p>Stok : {brg.stok} </p>
            <p id="harga-brg">Rp. {brg.harga}</p>
          </div>
          <button className="btn btn-sm" 
            onClick={() => { if (window.confirm("Apakah anda yakin menghapus produk ini ?")) 
            brg.hapusApotek(brg.id) }}>
            Hapus
          </button>
        </div>
      </div>
  
    )
  }

export default Post;