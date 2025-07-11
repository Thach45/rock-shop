import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/service/prisma.service";
import { CreatePermissionType, GetPermissionQueryType, UpdatePermissionType } from "./permission.model";

@Injectable()
export class PermissionRepo {
    constructor(private readonly prisma: PrismaService) {}
    async getListPermissions(query: GetPermissionQueryType) {
        const { page, limit } = query
        const [permissions, total] = await Promise.all([
        this.prisma.permission.findMany({
            where: {
                deletedAt: null,
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
        }),
        this.prisma.permission.count({
            where: {
                deletedAt: null,
            },
        }),
    ])
    return { permissions, total, page, limit, totalPages: Math.ceil(total / limit) }
    }
    async getPermissionById(id: number) {
        return this.prisma.permission.findUnique({
            where: {
                id,
                deletedAt: null,
            },
        })
    }
    async createPermission(body: CreatePermissionType, user: any) {
        return this.prisma.permission.create({
            data: {
                name: body.name,
                path: body.path,
                method: body.method,
                createdBy: user.userId,
                updatedBy: user.userId,
                description: body.description || 'No description',
            },
        })
    }
    async updatePermission(id: number, body: UpdatePermissionType, user: any) {
        return this.prisma.permission.update({
            where: { id },
            data: {
                ...body,
                updatedBy: user.userId,
            },
        })
    }
    async deletePermission(id: number) {
        return this.prisma.permission.update({
            where: { id },
            data: { deletedAt: new Date() },
        })
    }
}
