// config/prisma.js

const { PrismaClient } = require('@prisma/client');

// création  d'une instance de PrismaClient
const prisma = new PrismaClient();

//pour pouvoir l'utiliser partout dans l'app
module.exports = prisma;
