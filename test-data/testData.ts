import * as usersJson from "./users.json";
import * as productsJson from "./products.json";
import {User} from "./models/user";
import {Product} from "./models/products";

export const USERS = {
    STANDARD: usersJson.validUser as User,
    LOCKED_OUT: usersJson.lockedOutUser as User,
    PROBLEM: usersJson.problemUser as User,
    PERFORMANCE: usersJson.performanceUser as User,
    VISUAL: usersJson.visualUser as User,
    INVALID_PASS: usersJson.wrongPassword as User,
    INVALID_USERNAME: usersJson.missingUsername as User,
    MISSING_PASSWORD: usersJson.missingPassword as User
}

export const PRODUCTS = {
    BACKPACK: productsJson.productOne as Product,
    BIKE_LIGHT: productsJson.productTwo as Product,
    T_SHIRT_BOLT: productsJson.productThree as Product,
    FLEECE_JACKET: productsJson.productFour as Product,
    ONESIE: productsJson.productFive as Product,
    T_SHIRT_RED: productsJson.productSix as Product
};