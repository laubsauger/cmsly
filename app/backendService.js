module.exports = {
    getProductsData: function(content) {
        for (var i = 0; i < content.items.length; i++) {
            content.items[i]._image = 'http://lorempixel.com/96/96/technics/' + content.items[i].sku;
            content.items[i]._title = 'productTitle_' + content.items[i].sku;
            content.items[i]._path = '/productpath_' + content.items[i].sku;
        }
        
        return content;
    }
}