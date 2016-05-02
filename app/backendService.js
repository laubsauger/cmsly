module.exports = {
    getProductsData: function(resolverField, resolverFieldValue, fieldName) {
        // console.log(fieldName, resolverField, resolverFieldValue);
        switch(resolverField) {
            case '#sku': {
                return getDataForFieldBySku(resolverFieldValue, fieldName);
            }
            default:
                return 'no data returned from service!';
        }
    }
}

function getDataForFieldBySku(sku, fieldName) {
    switch(fieldName) {
        case '_text__title':
            return 'Title for SKU#' + sku;
        case '_image':
            return '/images/productImages/' + sku + '.jpg'; 
        case '_linkHref':
            return '/productPath_' + sku;
        default:
            return 'backendService: Unhandled field: ' + fieldName;
    }
}