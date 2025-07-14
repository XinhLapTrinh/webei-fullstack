function getEffectivePrice(product) {
  const now = Date.now();
  if (
    product.flashSale &&
    product.flashSale.isActive &&
    now >= new Date(product.flashSale.startTime) &&
    now <= new Date(product.flashSale.endTime)
  ) {
    return product.flashSale.price;
  }
  return product.price;
}

module.exports = { getEffectivePrice };
