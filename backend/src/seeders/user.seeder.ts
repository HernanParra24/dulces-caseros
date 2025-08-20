import { AppDataSource } from '../config/data-source';
import { User, UserRole } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

const users = [
  {
    email: 'parrahernan94@gmail.com',
    firstName: 'Hernan',
    lastName: 'Parra',
    phone: '2615632310',
    password: 'your_password',
    role: UserRole.ADMIN,
    emailVerified: true,
  },
  {
    email: 'montenegroh0426@gmail.com',
    firstName: 'Usuario',
    lastName: 'Prueba',
    phone: '2611234567',
    password: 'your_password',
    role: UserRole.USER,
    emailVerified: true,
  }
];

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Conectado a la base de datos');

    const userRepository = AppDataSource.getRepository(User);

    for (const userData of users) {
      const existingUser = await userRepository.findOne({
        where: { email: userData.email }
      });

      if (!existingUser) {
        // Crear el usuario sin hashear manualmente - dejar que el hook lo haga
        const user = userRepository.create(userData);
        
        await userRepository.save(user);
        console.log(`Usuario creado: ${userData.email} (${userData.role})`);
      } else {
        // Actualizar el rol si es necesario
        if (existingUser.role !== userData.role) {
          existingUser.role = userData.role;
          await userRepository.save(existingUser);
          console.log(`Rol actualizado para: ${userData.email} -> ${userData.role}`);
        } else {
          console.log(`Usuario ya existe: ${userData.email} (${userData.role})`);
        }
      }
    }

    console.log('Seeder de usuarios completado exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('Error en el seeder de usuarios:', error);
    process.exit(1);
  }
}

seed();
