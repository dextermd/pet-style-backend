import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { User } from './modules/users/entities/user.entity';
import { Repository } from 'typeorm';
import { compare } from 'bcrypt';
import { JwtRole } from './modules/auth/jwt/jwt-role';
import { Role } from './modules/roles/entities/role.entity';
import { RefreshToken } from './modules/refresh_token/entities/refresh_token.entity';
import { Pet } from './modules/pets/entities/pet.entity';
import { Groomer } from './modules/groomers/entities/groomer.entity';

const authenticate = async (
  email: string,
  password: string,
  userRepository: Repository<User>,
) => {
  const user = await userRepository.findOne({
    where: { email },
    relations: ['roles', 'pets'],
  });
  if (user && user.password && (await compare(password, user.password))) {
    const isAdmin = user.roles.some((role) => role.name === JwtRole.ADMIN);
    if (isAdmin) {
      return Promise.resolve({ id: user.id.toString(), email: user.email });
    }
  }
  return null;
};

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    (async () => {
      const { AdminModule } = await import('@adminjs/nestjs');
      const AdminJS = (await import('adminjs')).default;
      const AdminJSTypeORM = await import('@adminjs/typeorm');

      AdminJS.registerAdapter({
        Database: AdminJSTypeORM.Database,
        Resource: AdminJSTypeORM.Resource,
      });

      return AdminModule.createAdminAsync({
        imports: [TypeOrmModule.forFeature([User, Role])],
        useFactory: async (userRepository: Repository<User>) => ({
          adminJsOptions: {
            rootPath: '/admin',
            resources: [
              {
                resource: Groomer,
              },
              {
                resource: User,
                options: {
                  properties: {
                    password: {
                      isVisible: {
                        list: false,
                        filter: false,
                        show: false,
                        edit: true,
                      },
                    },
                    roles: {
                      isArray: true,
                      reference: 'Role',
                    },
                  },
                  listProperties: ['id', 'name', 'email', 'createdAt'],
                  showProperties: [
                    'id',
                    'name',
                    'email',
                    'roles',
                    'createdAt',
                    'updatedAt',
                  ],
                  editProperties: ['name', 'email', 'roles'],
                  filterProperties: ['id', 'name', 'email', 'roles'],
                },
              },
              {
                resource: Role,
                options: {
                  properties: {
                    users: {
                      isArray: true,
                    },
                  },
                  listProperties: ['id', 'name', 'route'],
                  showProperties: ['id', 'name', 'image', 'route', 'users'],
                  editProperties: ['name', 'image', 'route'],
                },
              },
              {
                resource: RefreshToken,
                options: {
                  properties: {
                    user: {
                      reference: 'User',
                    },
                  },
                },
              },
              {
                resource: Pet,
                options: {
                  properties: {
                    user: {
                      reference: 'User',
                    },
                  },
                  listProperties: ['id', 'name', 'user', 'createdAt'],
                  showProperties: [
                    'id',
                    'name',
                    'type',
                    'breed',
                    'age',
                    'user',
                    'createdAt',
                    'updatedAt',
                  ],
                  editProperties: ['name', 'type', 'breed', 'age', 'user'],
                },
              },
            ],
            branding: {
              companyName: 'Pet Style',
              softwareBrothers: false,
            },
          },
          auth: {
            authenticate: (email, password) =>
              authenticate(email, password, userRepository),
            cookieName: 'adminjs',
            cookiePassword: 'secret',
          },
          sessionOptions: {
            resave: true,
            saveUninitialized: true,
            secret: 'secret',
          },
        }),
        inject: [getRepositoryToken(User), getRepositoryToken(Role)],
      });
    })(),
  ],
  controllers: [],
})
export class AdminModule {}
