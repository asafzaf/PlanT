import { IUserCreateDTO, IUserUpdateDTO } from '@types';
import { validate } from '../utils/validate';

/* ----------------- CREATE USER ----------------- */
export const validateUserCreate = validate<IUserCreateDTO>({
    firstName: [
        (value) => (typeof value === 'string' && value.trim().length > 0) || 'First name is required.',
    ],
    lastName: [
        (value) => (typeof value === 'string' && value.trim().length > 0) || 'Last name is required.',
    ],
    email: [
        (value) => (typeof value === 'string' && /\S+@\S+\.\S+/.test(value)) || 'Invalid email format.',
    ],
    password: [
        (value) => (typeof value === 'string' && value.length >= 6) || 'Password must be at least 6 characters long.',
    ],
});

/* ----------------- UPDATE USER ----------------- */
export const validateUserUpdate = validate<IUserUpdateDTO>({
    firstName: [
        (value) => (typeof value === 'string' && value.trim().length > 0) || 'First name cannot be empty.',
    ],
    lastName: [ 
        (value) => (typeof value === 'string' && value.trim().length > 0) || 'Last name cannot be empty.',
    ],
    email: [
        (value) => (typeof value === 'string' && /\S+@\S+\.\S+/.test(value)) || 'Invalid email format.',
    ],
    password: [
        (value) => (typeof value === 'string' && value.length >= 6) || 'Password must be at least 6 characters long.',
    ],
});