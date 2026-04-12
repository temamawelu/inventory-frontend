const productRepository = require('../repositories/productRepository');

class ProductService {
    async getAllProducts() {
        return await productRepository.findAll();
    }

    async getProductById(id) {
        const product = await productRepository.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    async createProduct(productData, userId) {
        const { sku, name, description, category_id, unit_price, quantity_on_hand, reorder_point, location } = productData;

        if (!sku || !name || unit_price === undefined) {
            throw new Error('SKU, Name and Unit Price are required');
        }

        const existingSku = await productRepository.findBySku(sku);
        if (existingSku) {
            throw new Error('SKU already exists');
        }

        const productId = await productRepository.create([
            sku, name, description || null, category_id || null, unit_price,
            quantity_on_hand || 0, reorder_point || 0, location || null, userId
        ]);

        return { id: productId, sku, name };
    }

    async updateProduct(id, productData) {
        const { name, description, category_id, unit_price, reorder_point, location } = productData;

        const product = await productRepository.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }

        const affected = await productRepository.update(id, [
            name || product.name,
            description !== undefined ? description : product.description,
            category_id !== undefined ? category_id : product.category_id,
            unit_price !== undefined ? unit_price : product.unit_price,
            reorder_point !== undefined ? reorder_point : product.reorder_point,
            location !== undefined ? location : product.location
        ]);

        return affected > 0;
    }

    async deleteProduct(id) {
        const product = await productRepository.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }

        const affected = await productRepository.softDelete(id);
        return affected > 0;
    }

    async searchProducts(searchTerm) {
        if (!searchTerm || searchTerm.trim() === '') {
            return await this.getAllProducts();
        }
        return await productRepository.search(searchTerm);
    }

    async getLowStockProducts() {
        return await productRepository.getLowStock();
    }
}

module.exports = new ProductService();
