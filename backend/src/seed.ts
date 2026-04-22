import mongoose from 'mongoose';
import { connectDB } from './db/connection';
import { Product } from './models/Product';

const seedProducts = [
  {
    name: "MacBook Pro M1 2020",
    description: "Laptop Apple reacondicionado. Batería al 95%, sin rayones en pantalla. Excelente rendimiento para diseño y desarrollo.",
    price: 850,
    stock: 5,
    condition: "A",
    image_urls: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800"]
  },
  {
    name: "iPhone 12 Pro Max 256GB",
    description: "Teléfono en estado casi nuevo. Liberado de fábrica. Incluye cargador y cable genérico.",
    price: 650,
    stock: 12,
    condition: "A",
    image_urls: ["https://images.unsplash.com/photo-1605236453806-6ff368525b42?auto=format&fit=crop&q=80&w=800"]
  },
  {
    name: "Dell XPS 13 9310",
    description: "Laptop perfecta para productividad. Ligeros rasguños en la carcasa exterior, pero funcionamiento perfecto.",
    price: 700,
    stock: 8,
    condition: "B",
    image_urls: ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800"]
  },
  {
    name: "iPad Air 4ta Gen",
    description: "Ideal para estudio y arte digital. Batería al 85%, pantalla en condiciones prístinas.",
    price: 400,
    stock: 15,
    condition: "B",
    image_urls: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800"]
  },
  {
    name: "Sony WH-1000XM4",
    description: "Auriculares inalámbricos premium. Reacondicionados con almohadillas nuevas. Calidad de audio impecable.",
    price: 180,
    stock: 20,
    condition: "A",
    image_urls: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800"]
  },
  {
    name: "Nintendo Switch OLED",
    description: "Consola en perfecto funcionamiento, pero con desgaste notable en los plásticos y ligera marca en el dock.",
    price: 280,
    stock: 3,
    condition: "C",
    image_urls: ["https://images.unsplash.com/photo-1629851609590-edba17424de8?auto=format&fit=crop&q=80&w=800"]
  }
];

const runSeed = async () => {
  try {
    await connectDB();
    console.log('Clearing old products...');
    await Product.deleteMany({});
    
    console.log('Inserting new products...');
    await Product.insertMany(seedProducts);
    
    console.log('\n✅ Database seeded successfully with premium used tech!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

runSeed();