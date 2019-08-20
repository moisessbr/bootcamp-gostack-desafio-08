import React, { useState, useEffect } from 'react';
import { TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Container,
  ProductList,
  Product,
  ProductImage,
  ProductTitle,
  ProductPrice,
  ProductAddToCart,
  ProductAddToCartText,
  ProductAddToCartIcon,
  ProductAddToCartAmount,
} from './styles';
import Basket, { Name } from '../../components/AppHeader';
import api from '../../services/api';
import formatPrice from '../../util/format';
import * as CartActions from '../../store/modules/cart/actions';

export default function Home({ navigation }) {
  const [products, setProducts] = useState([]);
  const amount = useSelector(state =>
    state.cart.reduce((amountSum, product) => {
      amountSum[product.id] = product.amount;

      return amountSum;
    }, {})
  );

  const dispatch = useDispatch();

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get('products');
      const data = await Promise.all(
        response.data.map(async product => ({
          ...product,
          priceFormatted: await formatPrice(product.price),
        }))
      );
      setProducts(data);
    }
    loadProducts();
  }, []);

  function handleAddProduct(id) {
    dispatch(CartActions.addToCartRequest(id));
    navigation.navigate('Cart');
  }

  return (
    <Container>
      <ProductList
        horizontal
        data={products}
        keyExtractor={product => String(product.id)}
        renderItem={({ item }) => (
          <Product>
            <ProductImage source={{ uri: item.image }} />
            <ProductTitle>{item.title}</ProductTitle>
            <ProductPrice>{item.priceFormatted}</ProductPrice>
            <ProductAddToCart onPress={() => handleAddProduct(item.id)}>
              <ProductAddToCartIcon>
                <Icon name="add-shopping-cart" size={16} color="#fff" />
                <ProductAddToCartAmount>
                  {amount[item.id] || 0}
                </ProductAddToCartAmount>
              </ProductAddToCartIcon>
              <ProductAddToCartText>ADICIONAR</ProductAddToCartText>
            </ProductAddToCart>
          </Product>
        )}
      />
    </Container>
  );
}

Home.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

Home.navigationOptions = ({ navigation }) => ({
  headerLeft: <Name />,
  headerRight: (
    <TouchableHighlight onPress={() => navigation.navigate('Cart')}>
      <Basket />
    </TouchableHighlight>
  ),
});
