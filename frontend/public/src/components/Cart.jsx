import React from "react";
import { useNavigate } from "react-router";
import imgExample from "../imgs/imgExample.jpeg";
import "../styles/Cart.css";
import ItemCard from "./ItemCartCard";
import Button from "../assets/Button"

function Cart() {

  const navigate = useNavigate()

  return (
      <div className="cart">
        <div className="items">
            <ItemCard
            imagen={imgExample}
            titulo="Ejemplo de orden 1"
            tamano="Mediano"
            topp1="chispas de chocolate"
            topp2="coco rallado"
            compl1="crema de avellanas"
            compl2="fresa"
            precio="2.85"/>
            <ItemCard
            imagen={imgExample}
            titulo="Ejemplo de orden 1"
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