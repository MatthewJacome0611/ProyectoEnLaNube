CREATE TABLE "productos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "categoria" VARCHAR(120) NOT NULL,
    "pvp" DECIMAL(10, 2) NOT NULL,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "productos_pvp_nonnegative" CHECK ("pvp" >= 0)
);
