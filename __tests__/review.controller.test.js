const reviewController = require('../src/controller/review.controller')

describe('Review Controller', () => {
  describe('Create Review', () => {
    it('should create a new review', async () => {
      const req = {
        headers: {
          authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0IiwiaWF0IjoxNjgzOTE3MjY1LCJleHAiOjE2ODQ1MjIwNjV9.UcSluq60-aolFD9wHucCAhMb96nFsncG06Lguf6lBx4'
        },
        body: {
          title: 'The Shawshank Redemption',
          rating: 5,
          comment: 'A masterpiece in filmmaking',
          isPublic: true,
          movieId: 1
        },
        user: {
          id: 1
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      await reviewController.createReview(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Review criada com sucesso!',
          body: {
            review: expect.objectContaining({
              id: expect.any(Number),
              userid: expect.any(Number),
              movieid: expect.any(Number),
              rating: 5,
              review: 'A masterpiece in filmmaking',
              ispublic: true,
              created_at: expect.any(Date)
            })
          }
        })
      );
    });

    it('rating should only allow between 0 and 5', async () => {
      const req = {
        headers: {
          authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0IiwiaWF0IjoxNjgzOTAyNzYyLCJleHAiOjE2ODQ1MDc1NjJ9.nFfy7KdxCcY-YtYNc1NuIGF2eEjsdFmK-aJSzv7rBbI'
        },
        body: {
          title: 'The Shawshank Redemption',
          rating: 6,
          comment: 'A masterpiece in filmmaking',
          isPublic: true,
          movieId: 1
        },
        user: {
          id: 1
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      await reviewController.createReview(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "O campo 'rating' deve ser um número entre 0 e 5."
        })
      )


    })

    it('movie should exist in OMDB database', async () => {
      const req = {
        headers: {
          authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0IiwiaWF0IjoxNjgzOTAyNzYyLCJleHAiOjE2ODQ1MDc1NjJ9.nFfy7KdxCcY-YtYNc1NuIGF2eEjsdFmK-aJSzv7rBbI'
        },
        body: {
          title: 'Inexistent Movie',
          rating: 5,
          comment: 'A masterpiece in filmmaking',
          isPublic: true,
          movieId: 1
        },
        user: {
          id: 1
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      await reviewController.createReview(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Filme não encontrado no OMDB."
        })
      )

    })

    it('Test to verify that the "rating" field is required.', async () => {
      const req = {
        headers: {
          authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0IiwiaWF0IjoxNjgzOTE3MjY1LCJleHAiOjE2ODQ1MjIwNjV9.UcSluq60-aolFD9wHucCAhMb96nFsncG06Lguf6lBx4'
        },
        body: {
          title: 'The Shawshank Redemption',
          rating: null,
          comment: 'A masterpiece in filmmaking',
          isPublic: true,
          movieId: 1
        },
        user: {
          id: 1
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await reviewController.createReview(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Rating is required',
        })
      );
    })

    it('Test to verify that the "title" field is required.', async () => {
      const req = {
        headers: {
          authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0IiwiaWF0IjoxNjgzOTE3MjY1LCJleHAiOjE2ODQ1MjIwNjV9.UcSluq60-aolFD9wHucCAhMb96nFsncG06Lguf6lBx4'
        },
        body: {
          title: '',
          rating: 5,
          comment: 'A masterpiece in filmmaking',
          isPublic: true,
          movieId: 1
        },
        user: {
          id: 1
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await reviewController.createReview(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Title is required',
        })
      );
    })

    it('Test to verify that the "review" field is required.', async () => {
      const req = {
        headers: {
          authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0IiwiaWF0IjoxNjgzOTE3MjY1LCJleHAiOjE2ODQ1MjIwNjV9.UcSluq60-aolFD9wHucCAhMb96nFsncG06Lguf6lBx4'
        },
        body: {
          title: 'The Shawshank Redemption',
          rating: 5,
          comment: '',
          isPublic: true,
          movieId: 1
        },
        user: {
          id: 1
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await reviewController.createReview(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Review is required',
        })
      );
    })
  })

  describe('Get All Review', () => {
    it('should return an empty array if the user has no review', async () => {
      const req = {
        headers: {
          authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwidXNlcm5hbWUiOiJ0ZXN0IiwiaWF0IjoxNjg0MTg0MTYxLCJleHAiOjE2ODQ3ODg5NjF9.oqYqLQyT81fNUf2ZanHWVxmHaX_1A0CJAE1Are1UQmg'
        },
        user: {
          id: 6
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await reviewController.getAllReviews(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'O usuario não possui reviews'
        })
      );
    })
  })

  describe('Get Review by ID', () => {
    it('should return a error message if not found a review with the provided ID', async () => {
      const req = {
        headers: {
          authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0IiwiaWF0IjoxNjgzOTE3MjY1LCJleHAiOjE2ODQ1MjIwNjV9.UcSluq60-aolFD9wHucCAhMb96nFsncG06Lguf6lBx4'
        },
        user: {
          id: 1
        },
        query: {
          id: 999
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      await reviewController.getReviewById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Não foi possível encontrar a review com o id fornecido.'
        })
      );
    });
  })

  describe('Delete Review', () =>{
    it('should return a error message if not found a review with the provided ID', async() =>{
      const req = {
        headers: {
          authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0IiwiaWF0IjoxNjgzOTE3MjY1LCJleHAiOjE2ODQ1MjIwNjV9.UcSluq60-aolFD9wHucCAhMb96nFsncG06Lguf6lBx4'
        },
        user: {
          id: 1
        },
        query: {
          id: 999
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      await reviewController.deleteReview(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'A review que você tentou deletar não existe.'
        })
      );
    })
  })

  describe('Update Review', () => {
    it('should return a error message if not found a review with the provided ID', async() =>{
      const req = {
        headers: {
          authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0IiwiaWF0IjoxNjgzOTE3MjY1LCJleHAiOjE2ODQ1MjIwNjV9.UcSluq60-aolFD9wHucCAhMb96nFsncG06Lguf6lBx4'
        },
        user: {
          id: 1
        },
        query: {
          id: 999
        },
        body: {
          rating: 4,
          review: "This is a test review."
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      await reviewController.updateReview(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Não foi possivel encontrar a review com o id fornecido."
        })
      );
    })
  })

  describe('Update Partially a Review', () =>{
    it('should return a error message if not found a review with the provided ID', async() =>{
      const req = {
        headers: {
          authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0IiwiaWF0IjoxNjgzOTE3MjY1LCJleHAiOjE2ODQ1MjIwNjV9.UcSluq60-aolFD9wHucCAhMb96nFsncG06Lguf6lBx4'
        },
        user: {
          id: 1
        },
        query: {
          id: 999
        },
        body: {
          rating: 4,
          review: "This is a test review."
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      await reviewController.updateReviewPartionally(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Não foi possível encontrar a review com o id fornecido."
        })
      );
    })

    it('should only update the Review', async() =>{
      const req = {
        headers: {
          authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0IiwiaWF0IjoxNjgzOTE3MjY1LCJleHAiOjE2ODQ1MjIwNjV9.UcSluq60-aolFD9wHucCAhMb96nFsncG06Lguf6lBx4'
        },
        user: {
          id: 1
        },
        query: {
          id: 1
        },
        body: {
          review: "This is a review."
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      await reviewController.updateReviewPartionally(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Review atualizada com sucesso!',
          review: expect.objectContaining({
              id: expect.any(Number),
              userid: expect.any(Number),
              movieid: expect.any(Number),
              rating: 5,
              review: "This is a review.",
              ispublic: false,
              created_at: expect.any(Date)
            })
        })
      );
    })

    it('should only update the Rating', async() =>{
      const req = {
        headers: {
          authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0IiwiaWF0IjoxNjgzOTE3MjY1LCJleHAiOjE2ODQ1MjIwNjV9.UcSluq60-aolFD9wHucCAhMb96nFsncG06Lguf6lBx4'
        },
        user: {
          id: 1
        },
        query: {
          id: 1
        },
        body: {
          rating: 5
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      await reviewController.updateReviewPartionally(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Review atualizada com sucesso!',
          review: expect.objectContaining({
              id: expect.any(Number),
              userid: expect.any(Number),
              movieid: expect.any(Number),
              rating: 5,
              review: "This is a review.",
              ispublic: false,
              created_at: expect.any(Date)
            })
        })
      );
    })

    it('should only update the is Public', async() =>{
      const req = {
        headers: {
          authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0IiwiaWF0IjoxNjgzOTE3MjY1LCJleHAiOjE2ODQ1MjIwNjV9.UcSluq60-aolFD9wHucCAhMb96nFsncG06Lguf6lBx4'
        },
        user: {
          id: 1
        },
        query: {
          id: 1
        },
        body: {
          ispublic: false
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };

      await reviewController.updateReviewPartionally(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Review atualizada com sucesso!',
          review: expect.objectContaining({
              id: expect.any(Number),
              userid: expect.any(Number),
              movieid: expect.any(Number),
              rating: 5,
              review: "This is a review.",
              ispublic: false,
              created_at: expect.any(Date)
            })
        })
      );
    })
  })
})









