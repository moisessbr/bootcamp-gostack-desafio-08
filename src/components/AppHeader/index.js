import React from 'react';

import Icon from 'react-native-vector-icons/MaterialIcons';

import { useSelector } from 'react-redux';

import { Logo, Cart, CartItems } from './styles';

import logo from '../../assets/images/header/logo.png';

export function Name() {
  return <Logo source={logo} />;
}

export default function Basket() {
  const cartSize = useSelector(state => state.cart.length);
  return (
    <Cart>
      <CartItems>{cartSize}</CartItems>
      <Icon name="shopping-basket" size={24} color="#fff" />
    </Cart>
  );
}
