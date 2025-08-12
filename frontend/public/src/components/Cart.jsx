import React from "react";
import { useNavigate } from "react-router";
import imgExample1 from "../imgs/item1menu.png";
import imgExample2 from "../imgs/item2menu.png";
import imgExample3 from "../imgs/item3menu.png";
import imgExample4 from "../imgs/item4menu.png";
import imgExample5 from "../imgs/item5menu.png";
import imgExample6 from "../imgs/item6menu.png";
import "../styles/Cart.css";
import ItemCard from "./ItemCartCard";
import Button from "../assets/Button"

function Cart() {

  const navigate = useNavigate()

  return (
      <div className="cart">
        <div className="items">
            <ItemCard
            imagen={imgExample1}
            titulo="Ejemplo de orden 1"
            tamano="Mediano"
            topp1="chispas de chocolate"
            topp2="coco rallado"
            compl1="crema de avellanas"
            compl2="fresa"
            precio="2.85"/>
            <ItemCard
            imagen={imgExample2}
            titulo="Ejemplo de orden 1"
            tamano="Mediano"
            topp1="chispas de chocolate"
            topp2="coco rallado"
            compl1="crema de avellanas"
            compl2="fresa"
            precio="2.85"/>
            <ItemCard
            imagen={imgExample3}
            titulo="Ejemplo de orden 1"
            resumen="panqueis con helado de chocolate y crema de avellanas"
            tamano="Mediano"
            topp1="chispas de chocolate"
            topp2="coco rallado"
            compl1="crema de avellanas"
            compl2="fresa"
            precio="2.85"/>
            <ItemCard
            imagen={imgExample4}
            titulo="Ejemplo de orden 1"
            resumen="panqueis con helado de chocolate y crema de avellanas"
            tamano="Mediano"
            topp1="chispas de chocolate"
            topp2="coco rallado"
            compl1="crema de avellanas"
            compl2="fresa"
            precio="2.85"/>
            <ItemCard
            imagen={imgExample5}
            titulo="Ejemplo de orden 1"
            resumen="panqueis con helado de chocolate y crema de avellanas"
            tamano="Mediano"
            topp1="chispas de chocolate"
            topp2="coco rallado"
            compl1="crema de avellanas"
            compl2="fresa"
            precio="2.85"/>
            <ItemCard
            imagen={imgExample6}
            titulo="Ejemplo de orden 1"
            resumen="panqueis con helado de chocolate y crema de avellanas"
            tamano="Mediano"
            topp1="chispas de chocolate"
            topp2="coco rallado"
            compl1="crema de avellanas"
            compl2="fresa"
            precio="2.85"/>
            <ItemCard
            imagen={imgExample1}
            titulo="Ejemplo de orden 1"
            resumen="panqueis con helado de chocolate y crema de avellanas"
            tamano="Mediano"
            topp1="chispas de chocolate"
            topp2="coco rallado"
            compl1="crema de avellanas"
            compl2="fresa"
            precio="2.85"/>
            <ItemCard
            imagen={imgExample1}
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