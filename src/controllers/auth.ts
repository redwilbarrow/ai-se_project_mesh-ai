import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, name } = req.body;

  const requiredFields = ['email', 'password', 'name'] as const;

  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    let message: string;

    if (missingFields.length === 1) {
      message = `${missingFields[0]} is required`;
    } else if (missingFields.length === 2) {
      message = `${missingFields.join(' and ')} are required`;
    } else {
      const lastField = missingFields[missingFields.length - 1];
      const precedingFields = missingFields.slice(0, -1).join(', ');

      message = `${precedingFields}, and ${lastField} are required`;
    }

    // TODO: add validation for whitespace-only email/name

    return res.status(400).json({
      success: false,
      data: null,
      error: { message },
    });
  }

  const trimmedPassword = password.trim();

  if (password !== trimmedPassword) {
    const message =
      trimmedPassword.length < 8
        ? 'Password must be at least 8 characters and cannot start or end with spaces'
        : 'Password cannot start or end with spaces';

    res.status(400).json({
      success: false,
      data: null,
      error: { message },
    });
    return;
  }

  if (trimmedPassword.length < 8) {
    res.status(400).json({
      success: false,
      data: null,
      error: { message: 'Password must be at least 8 characters' },
    });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(trimmedPassword, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
    });

    res.status(201).json({
      success: true,
      data: { userId: user._id, email: user.email, name: user.name },
      error: null,
    });
  } catch (err: unknown) {
    if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) {
      res.status(409).json({
        success: false,
        data: null,
        error: { message: 'Email already in use' },
      });
      return;
    }

    if (err instanceof Error) {
      throw err;
    }

    throw new Error(String(err), { cause: err });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const requiredFields = ['email', 'password'] as const;

  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    let message: string;

    if (missingFields.length === 1) {
      message = `${missingFields[0]} is required`;
    } else {
      message = `${missingFields.join(' and ')} are required`;
    }

    res.status(400).json({
      success: false,
      data: null,
      error: { message },
    });
    return;
  }

  // TODO: add error handling for login lookup
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({
      success: false,
      data: null,
      error: { message: 'Invalid credentials' },
    });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      data: null,
      error: { message: 'Invalid credentials' },
    });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
    expiresIn: '2h',
  });

  res.status(200).json({
    success: true,
    data: {
      token,
      user: { userId: user._id, email: user.email, name: user.name },
    },
    error: null,
  });
};

// Lesson instructions only said to implement `register` and `login`,
// but previous submission for Project 2 Part 2 was rejected for not
// having implemented `getCurrentUser`. Not sure if I did this correctly.
export const getCurrentUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user!.userId;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({
      success: false,
      data: null,
      error: { message: 'User not found' },
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: {
      userId: user._id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    },
    error: null,
  });
};
