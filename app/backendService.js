module.exports = {
    getProductsData: function(content) {
        for (var i = 0; i < content.items.length; i++) {
            content.items[i]._image = '/images/productImages/' + content.items[i]['#sku'] + '.jpg';
            content.items[i]._text__title = 'productTitle_' + content.items[i]['#sku'];
            content.items[i]._linkHref = '/productpath_' + content.items[i]['#sku'];
        }
        
        return content;
    }
}