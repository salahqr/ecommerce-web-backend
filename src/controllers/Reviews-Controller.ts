import { Request, Response } from 'express';
import { reviews } from '../Schemas/index.js';
import reviewsService from '../Database/Review-Service.js';

const addReview = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ msg: 'Unauthorized' });
      return;
    }

    const userId = (req.user as { id: string }).id;

    const data: reviews = {
      userId: userId,
      productId: req.body.productId,
      rating: req.body.rating,
      comment: req.body.comment,
    };

    const review = await reviewsService.addReview(data);
    res.status(201).json({ data: review });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};

const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ msg: 'Unauthorized' });
      return;
    }

    const userId = (req.user as { id: string }).id;
    const productId = req.params.productId;

    const updateFields: Partial<Pick<reviews, 'rating' | 'comment'>> = {};
    if (req.body.rating !== undefined) updateFields.rating = req.body.rating;
    if (req.body.comment !== undefined) updateFields.comment = req.body.comment;

    if (Object.keys(updateFields).length === 0) {
      res
        .status(400)
        .json({ msg: 'Nothing to update. Provide rating or comment.' });
      return;
    }

    const data = {
      userId,
      productId,
      ...updateFields,
    };

    const review = await reviewsService.updateReview(data);

    res.status(200).json({ data: review });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};

const deleteReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: Record<string, any> = {};

    const user = req.user;

    if (!user) {
      res.status(401).json({ msg: 'Unauthorized' });
      return;
    }

    const userId = (req.user as { id: string }).id;

    data.userId = userId;

    if (!req.params.productId) {
      res.status(400).json({ msg: 'Missing product ID' });
      return;
    }

    data.productId = req.params.productId;

    await reviewsService.deleteReviews(data);
    res.status(200).json({ msg: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};

const getReviews = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;

    const data = await reviewsService.getReviews(productId);
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};

export { addReview, update, deleteReviews, getReviews };
