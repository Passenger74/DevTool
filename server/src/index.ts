import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { prisma } from './lib/prisma.js';
import { requireAuth, signToken } from './middleware/auth.js';

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors({ origin: process.env.CLIENT_URL ?? 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, message: 'DevTool API is running' });
});

const loginSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string().min(4).optional(),
});

app.post('/auth/login', async (req, res) => {
  try {
    const payload = loginSchema.parse(req.body);

    let user = await prisma.user.findUnique({ where: { email: payload.email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          name: payload.name ?? payload.email.split('@')[0],
          password: payload.password ?? 'devtool-demo-password',
        },
      });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Invalid login payload',
      details: error instanceof Error ? error.message : error,
    });
  }
});

app.get('/me', requireAuth, async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  return res.json({ user });
});

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'ARCHIVED']).optional(),
  assigneeId: z.number().int().positive().optional(),
  spaceId: z.number().int().positive().optional(),
  dueDate: z.string().datetime({ offset: true }).optional(),
});

app.get('/tasks', requireAuth, async (_req, res) => {
  const tasks = await prisma.task.findMany({
    include: {
      assignee: true,
      space: true,
      tags: {
        include: { tag: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const response = tasks.map((task) => ({
    ...task,
    tags: task.tags.map((item) => item.tag.name),
  }));

  return res.json(response);
});

app.post('/tasks', requireAuth, async (req, res) => {
  try {
    const payload = taskSchema.parse(req.body);

    const task = await prisma.task.create({
      data: {
        title: payload.title,
        description: payload.description ?? null,
        status: payload.status ?? 'TODO',
        assigneeId: payload.assigneeId ?? null,
        spaceId: payload.spaceId ?? null,
        dueDate: payload.dueDate ? new Date(payload.dueDate) : null,
      },
      include: {
        assignee: true,
        space: true,
        tags: { include: { tag: true } },
      },
    });

    return res.status(201).json({
      ...task,
      tags: task.tags.map((item) => item.tag.name),
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Invalid task payload',
      details: error instanceof Error ? error.message : error,
    });
  }
});

app.patch('/tasks/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid task id' });
  }

  try {
    const payload = taskSchema.partial().parse(req.body);

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...payload,
        dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
      },
      include: {
        assignee: true,
        space: true,
        tags: { include: { tag: true } },
      },
    });

    return res.json({
      ...task,
      tags: task.tags.map((item) => item.tag.name),
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Unable to update task',
      details: error instanceof Error ? error.message : error,
    });
  }
});

app.delete('/tasks/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid task id' });
  }

  await prisma.task.delete({ where: { id } });
  return res.status(204).send();
});

app.get('/spaces', requireAuth, async (_req, res) => {
  const spaces = await prisma.space.findMany({
    include: { tasks: true, owner: true },
    orderBy: { createdAt: 'desc' },
  });

  return res.json(spaces);
});

const spaceSchema = z.object({
  name: z.string().min(1),
  visibility: z.enum(['PRIVATE', 'INTERNAL', 'PUBLIC']).optional(),
  ownerId: z.number().int().positive(),
});

app.post('/spaces', requireAuth, async (req, res) => {
  const payload = spaceSchema.parse(req.body);

  const space = await prisma.space.create({
    data: {
      name: payload.name,
      ownerId: payload.ownerId,
      visibility: payload.visibility ?? 'PRIVATE',
    },
  });

  return res.status(201).json(space);
});

app.get('/groups', requireAuth, async (_req, res) => {
  const groups = await prisma.group.findMany({
    include: { owner: true, members: { include: { user: true } } },
  });

  return res.json(groups);
});

const groupSchema = z.object({
  name: z.string().min(1),
  ownerId: z.number().int().positive(),
});

app.post('/groups', requireAuth, async (req, res) => {
  const payload = groupSchema.parse(req.body);

  const group = await prisma.group.create({
    data: {
      name: payload.name,
      ownerId: payload.ownerId,
    },
    include: { owner: true },
  });

  return res.status(201).json(group);
});

app.listen(port, () => {
  console.log(`DevTool API listening on http://localhost:${port}`);
});
