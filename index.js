import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';

const app = new Hono();
const prisma = new PrismaClient();

app.use(cors());

// Shorten URL
app.post('/shorten', async (c) => {
    try {
        const { url } = await c.req.json();
        const short = Math.random().toString(36).substring(2, 8);

        const newLink = await prisma.shortURL.create({
            data: {
                original: url,  // Use actual URL from request
                short,
                clicks: 0
            }
        });

        console.log("Short URL created:", newLink);
        return c.json({ short: newLink.short });
    } catch (error) {
        console.error("Error creating short URL:", error);
        return c.json({ error: "Failed to shorten URL" }, 500);
    }
});

// Redirect
app.get('/:short', async (c) => {
    try {
        const short = c.req.param("short"); 
        const link = await prisma.shortURL.findUnique({
            where: { short }
        });

        if (!link) return c.text('URL not found', 404);

        await prisma.shortURL.update({
            where: { short },
            data: { clicks: link.clicks + 1 }
        });

        return c.redirect(link.original);
    } catch (error) {
        console.error("Error redirecting:", error);
        return c.json({ error: "Failed to redirect" }, 500);
    }
});

// Start the server
serve({
    fetch: app.fetch,
    port: 3000,
});

console.log('Server running on http://localhost:3000');

export default app;
