import { ROLES } from 'src/shared/constants/role.constants';
import { HashingService } from 'src/shared/service/hashing.service';
import { PrismaService } from 'src/shared/service/prisma.service';


const prisma = new PrismaService();
const hashing = new HashingService();

const main = async () => {
    const roles = await prisma.role.count();
    if(roles > 0) {
        throw new Error('Roles already exist');
    }

    const role = await prisma.role.createMany({
        data: [
            {
                name: ROLES.ADMIN,
                description: 'Admin role',

            },
            {
                name: ROLES.SELLER,
                description: 'Seller role',
            },
            {
                name: ROLES.CLIENT,
                description: 'Client role',
            },
        ]
    });
    const roleAdmin = await prisma.role.findFirstOrThrow({
        where: {
            name: ROLES.ADMIN,
        },
    });
    const hashedPassword = await hashing.hashPassword(process.env.PASSWORD_ADMIN as string);
    const userAdmin = await prisma.user.create({
        data: {
            email: process.env.EMAIL_ADMIN as string,
            password: hashedPassword, 
            phoneNumber: process.env.PHONE_ADMIN as string,
            name: process.env.NAME_ADMIN as string,
            roleId: roleAdmin.id,
        },
    });
    return {
        userAdmin,
        countRoles: role.count,
    }

    
};

main().then(({userAdmin, countRoles}) => {
    console.log(`User admin: ${userAdmin.email}`);
    console.log(`Count roles: ${countRoles}`);
}).catch((error) => {
    console.error(error);
    process.exit(1);
});