"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const companies_1 = require("./companies");
const interviews_1 = require("./interviews");
const contacts_1 = require("./contacts");
const claims_1 = require("./claims");
const properties_1 = require("./properties");
const tenants_1 = require("./tenants");
const users_1 = require("./users");
const tenant_members_1 = require("./tenant_members");
const supplements_1 = require("./supplements");
async function registerRoutes(server) {
    // Companies CRUD + CSV import
    server.register(companies_1.companiesRoutes, { prefix: '/companies' });
    // Interview workflow routes
    server.register(interviews_1.interviewsRoutes, { prefix: '/interviews' });
    // Contacts CRUD
    server.register(contacts_1.contactsRoutes, { prefix: '/contacts' });
    // Claims CRUD
    server.register(claims_1.claimsRoutes, { prefix: '/claims' });
    // Properties CRUD
    server.register(properties_1.propertiesRoutes, { prefix: '/properties' });
    // Tenants CRUD
    server.register(tenants_1.tenantsRoutes, { prefix: '/tenants' });
    // Users CRUD
    server.register(users_1.usersRoutes, { prefix: '/users' });
    // Tenant Members CRUD
    server.register(tenant_members_1.tenantMembersRoutes, { prefix: '/tenant-members' });
    // Supplements CRUD
    server.register(supplements_1.supplementsRoutes, { prefix: '/supplements' });
}
