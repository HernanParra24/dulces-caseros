import { AppDataSource } from '../config/data-source';
import { Product } from '../products/entities/product.entity';

const products = [
  {
    name: 'Dulce de Tomate',
    description: 'Dulce de tomate artesanal elaborado con tomates frescos de la huerta, con un sabor único y tradicional.',
    ingredients: 'Tomates frescos, azúcar, limón, canela',
    price: 2700,
    stock: 45,
    category: 'dulces',
    images: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
    isActive: true,
    isFeatured: false,
    rating: 0,
    reviewCount: 0,
    weight: 250,
    allergens: 'Ninguno',
    nutritionalInfo: 'Calorías: 120, Grasas: 0g, Carbohidratos: 30g, Proteínas: 1g'
  },
  {
    name: 'Dulce de Naranja',
    description: 'Dulce de naranja casero con la dulzura natural de las naranjas frescas y un toque de canela.',
    ingredients: 'Naranjas frescas, azúcar, canela, limón',
    price: 3000,
    stock: 50,
    category: 'dulces',
    images: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=500',
    isActive: true,
    isFeatured: false,
    rating: 0,
    reviewCount: 0,
    weight: 250,
    allergens: 'Ninguno',
    nutritionalInfo: 'Calorías: 110, Grasas: 0g, Carbohidratos: 28g, Proteínas: 1g'
  },
  {
    name: 'Dulce de Alcayota',
    description: 'Dulce de alcayota tradicional con textura suave y sabor delicado, perfecto para acompañar el mate.',
    ingredients: 'Alcayota, azúcar, limón, canela',
    price: 3000,
    stock: 40,
    category: 'dulces',
    images: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500',
    isActive: true,
    isFeatured: false,
    rating: 0,
    reviewCount: 0,
    weight: 250,
    allergens: 'Ninguno',
    nutritionalInfo: 'Calorías: 100, Grasas: 0g, Carbohidratos: 25g, Proteínas: 1g'
  },
  {
    name: 'Dulce de Frutilla',
    description: 'Dulce de frutilla artesanal con el sabor intenso de las frutillas frescas de temporada.',
    ingredients: 'Frutillas frescas, azúcar, limón, canela',
    price: 4200,
    stock: 35,
    category: 'dulces',
    images: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500',
    isActive: true,
    isFeatured: true,
    rating: 0,
    reviewCount: 0,
    weight: 250,
    allergens: 'Frutillas',
    nutritionalInfo: 'Calorías: 130, Grasas: 0g, Carbohidratos: 32g, Proteínas: 1g'
  },
  {
    name: 'Dulce de Banana',
    description: 'Dulce de banana casero con la dulzura natural de las bananas maduras y un toque de vainilla.',
    ingredients: 'Bananas maduras, azúcar, vainilla, limón',
    price: 4200,
    stock: 30,
    category: 'dulces',
    images: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=500',
    isActive: true,
    isFeatured: true,
    rating: 0,
    reviewCount: 0,
    weight: 250,
    allergens: 'Ninguno',
    nutritionalInfo: 'Calorías: 115, Grasas: 0g, Carbohidratos: 29g, Proteínas: 1g'
  }
];

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Conectado a la base de datos');

    const productRepository = AppDataSource.getRepository(Product);

    for (const productData of products) {
      const existingProduct = await productRepository.findOne({
        where: { name: productData.name }
      });

      if (!existingProduct) {
        const product = productRepository.create(productData as any);
        await productRepository.save(product);
        console.log(`Producto creado: ${productData.name}`);
      } else {
        console.log(`Producto ya existe: ${productData.name}`);
      }
    }

    console.log('Seeder completado exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('Error en el seeder:', error);
    process.exit(1);
  }
}

seed();
