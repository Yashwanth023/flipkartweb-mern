
/**
 * Product Model
 * Represents the schema for products in the database
 */
class Product {
  constructor(id, name, description, price, imageUrl, category, stock) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;
    this.category = category;
    this.stock = stock;
  }
  
  // This would contain database methods in a real implementation
  static findAll() {
    // Fetch all products from database
    return [];
  }
  
  static findById(id) {
    // Find product by ID
    return null;
  }
  
  static findByCategory(category) {
    // Find products by category
    return [];
  }
  
  save() {
    // Save product to database
    return this;
  }
  
  update(data) {
    // Update product in database
    Object.assign(this, data);
    return this;
  }
  
  delete() {
    // Delete product from database
    return true;
  }
}

module.exports = Product;
