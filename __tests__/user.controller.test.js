const userController = require('../src/controller/user.controller')
const reviewController = require('../src/controller/review.controller')
const jwt = require('jsonwebtoken');
const db = require("../src/config/db");


describe('User Controller', () => {
  describe('signup', () => {
    it('should create a new user in the database', async () => {
      const req = {
        body: {
          username: 'test',
          email: 'test2222@example.com',
          password: 'password123'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      await userController.signup(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          user: expect.objectContaining({
            username: 'test',
            email: 'test2222@example.com'
          }),
          token: expect.any(String)
        })
      );
    });
    it('should not allow the creation of a user with an email already registered', async () => {
      const req = {
        body: {
          username: 'testS',
          email: 'test@example.com',
          password: 'password456'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      await userController.signup(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Email already taken'
        })
      );
    });

    it('Test to verify that the "email" field is required.', async () => {
      const req = {
        body: {
          username: 'test2',
          email: '',
          password: 'password456'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      await userController.signup(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Email is required'
        })
      );
    });

    it('Test to verify that the "username" field is required.', async () => {
      const req = {
        body: {
          username: '',
          email: 'example1@example.com',
          password: 'password456'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      await userController.signup(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Username is required'
        })
      );
    });

    it('Test to verify that the "password" field is required.', async () => {
      const req = {
        body: {
          username: 'test2',
          email: 'example1@example.com',
          password: ''
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      await userController.signup(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Password is required'
        })
      );
    });
  })

  describe('AuthMiddleware', () => {
    it('test to verify that the token is valid and user is authorized', async () => {

      const req = {
        headers: {
          authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJ0ZXN0IiwiaWF0IjoxNjgzODk4NzY0LCJleHAiOjE2ODQ1MDM1NjR9.b25skbCuJ81_w647e9ajkya-IHU88vobgP79TOeUmdw`
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      const next = jest.fn();

      await userController.AuthMiddleware(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    })

    it('test to verify that an invalid token results in unauthorized access', async () => {
      const req = {
        headers: {
          authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJ0ZXN0IiwiaWF0IjoxNjgzODk4NzY0LCJleHAiOjE2ODQ1MDM1NjR9.b25skbCuJ81_w647e9ajkya-IHU88vobgP79TOeUmd`
        }
      }
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }
      const next = jest.fn();

      await userController.AuthMiddleware(req, res, next);
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Invalid token'
        })
      );
    })

  })
})

