module.exports = {
    getProductsData: function(content) {
        for (var i = 0; i < content.items.length; i++) {
            content.items[i].image = 'productImage_' + content.items[i].sku + '.png';
            content.items[i].title = 'productTitle_' + content.items[i].sku;
            content.items[i].path = '/productpath_' + content.items[i].sku;
        }
        
        return content;
    }
}