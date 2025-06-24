const UserStatus = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    BLOCKED: "BLOCKED"
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export type UserType = {

    id: number,
    email: string,
    name: string,
    phoneNumber: string,
    password: string,
    avatar: string | null,
    totpSecret: string | null,
    status: UserStatus,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
    createdById: number | null,
    updatedById: number | null,
}