import React from "react";
import imgExample from "../imgs/imgExample.jpeg";
import "../styles/Cart.css";
import ItemCard from "./ItemCartCard";

function Cart() {
  return (
      <div className="cart">
        <div className="items">
            <h1>Tu pedido:</h1>
            <ItemCard
            imagen={imgExample}
            titulo="Ejemplo de orden 1"
            resumen="panqueis con helado de chocolate y crema de avellanas"
            tamano="Mediano"
            topp1="chispas de chocolate"
            topp2="coco rallado"
            compl1="crema de avellanas"
            compl2="fresa"
            precio="2.85"/>
            <ItemCard
            imagen={imgExample}
            titulo="Ejemplo de orden 1"
            resumen="panqueis con helado de chocolate y crema de avellanas"
            tamano="Mediano"
            topp1="chispas de chocolate"
            topp2="coco rallado"
            compl1="crema de avellanas"
            compl2="fresa"
            precio="2.85"/>
            <ItemCard
            imagen={imgExample}
            titulo="Ejemplo de orden 1"
            resumen="panqueis con helado de chocolate y crema de avellanas"
            tamano="Mediano"
            topp1="chispas de chocolate"
            topp2="coco rallado"
            compl1="crema de avellanas"
            compl2="fresa"
            precio="2.85"/>
            <ItemCard
            imagen={imgExample}
            titulo="Ejemplo de orden 1"
            resumen="panqueis con helado de chocolate y crema de avellanas"
            tamano="Mediano"
            topp1="chispas de chocolate"
            topp2="coco rallado"
            compl1="crema de avellanas"
            compl2="fresa"
            precio="2.85"/>
            <ItemCard
            imagen={imgExample}
            titulo="Ejemplo de orden 1"
            resumen="panqueis con helado de chocolate y crema de avellanas"
            tamano="Mediano"
            topp1="chispas de chocolate"
            topp2="coco rallado"
            compl1="crema de avellanas"
            compl2="fresa"
            precio="2.85"/>
            <ItemCard
            imagen={imgExample}
            titulo="Ejemplo de orden 1"
            resumen="panqueis con helado de chocolate y crema de avellanas"
            tamano="Mediano"
            topp1="chispas de chocolate"
            topp2="coco rallado"
            compl1="crema de avellanas"
            compl2="fresa"
            precio="2.85"/>
        </div>
      </div>
  );
}

export default Cart;