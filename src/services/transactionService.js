const productRepository = require('../repositories/productRepository');
const transactionRepository = require('../repositories/transactionRepository');

class TransactionService {
    async recordGoodsReceipt(productId, userId, quantity, referenceNumber, notes) {
        if (!productId || !quantity || quantity <= 0) {
            throw new Error('Product ID and valid quantity required');
        }

        const product = await productRepository.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        const quantityBefore = product.quantity_on_hand;
        const quantityAfter = quantityBefore + quantity;

        // Update product stock
        await productRepository.updateStock(productId, quantityAfter);

        // Create transaction record
        await transactionRepository.create([
            productId, userId, 'GOODS_RECEIPT', quantity,
            quantityBefore, quantityAfter, referenceNumber || null, notes || null
        ]);

        return {
            product_id: productId,
            previous_quantity: quantityBefore,
            new_quantity: quantityAfter,
            quantity_added: quantity
        };
    }

    async recordGoodsIssue(productId, userId, quantity, referenceNumber, notes) {
        if (!productId || !quantity || quantity <= 0) {
            throw new Error('Product ID and valid quantity required');
        }

        const product = await productRepository.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        if (product.quantity_on_hand < quantity) {
            throw new Error(Insufficient stock. Available: );
        }

        const quantityBefore = product.quantity_on_hand;
        const quantityAfter = quantityBefore - quantity;

        // Update product stock
        await productRepository.updateStock(productId, quantityAfter);

        // Create transaction record
        await transactionRepository.create([
            productId, userId, 'GOODS_ISSUE', quantity,
            quantityBefore, quantityAfter, referenceNumber || null, notes || null
        ]);

        return {
            product_id: productId,
            previous_quantity: quantityBefore,
            new_quantity: quantityAfter,
            quantity_removed: quantity
        };
    }

    async getTransactionHistory(productId = null, limit = 100) {
        return await transactionRepository.getHistory(productId, limit);
    }
}

module.exports = new TransactionService();
