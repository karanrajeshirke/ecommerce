import productModel from "../models/productModel.js";
import reviewModel from "../models/reviewModel.js";
import mongoose from "mongoose";
export const createReviewController = async (req, res) => {
  try {
    const id = req.user._id;
    const { pid, rating, comment } = req.body;

    const product = await productModel.findById(pid).populate({
      path: "reviews",

      populate: {
        path: "author",
        select: "-photo",
      },
    });
    const isPresent = product.reviews.find((item) => {
      return item.author._id.equals(id);
    });
    if (isPresent) {
      return res.status(400).send({
        message: "Already marked review",
      });
    }

    const review = new reviewModel({
      rating,
      comment,
      author: id,
    });

    const data = await review.save();

    product.reviews.push(review);

    await product.save();
    
    let sum=0;

    for (const review of product.reviews) {
        sum = sum + review.rating;
      }
      const average = sum / product.reviews.length;




    res.status(200).send({
      message: "review created",
      average,
      length:product.reviews.length
    });
  } catch (error) {
    console.log(error);
  }
};

export const getReviewsForProduct = async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await productModel
      .findById(pid)
      .populate({
        path: "reviews",

        populate: {
          path: "author",
          select: "-photo",
        },
      })
      .select("-photo");

    const reviews = product.reviews;

    res.send({ reviews });
  } catch (error) {
    console.log(error);
  }
};

export const averageOfReviews = async (req, res) => {
  try {
    const { pid } = req.params;

    const { reviews } = await productModel.findById(pid).populate("reviews");

    console.log(reviews);
    let sum = 0;

    for (const review of reviews) {
      sum = sum + review.rating;
    }
    const average = sum / reviews.length;
    res.send({
      average: parseFloat(average.toFixed(1)),
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.log(error);
  }
};

export const RatingOfAllProducts = async (req, res) => {
  try {
    const data = await productModel
      .find({})
      .populate("reviews")
      .select("reviews");

    const allProductsReviews = {};

    data.forEach((product) => {
      const pid = product._id;

      const { reviews } = product;
      let sum = 0;

      for (const review of reviews) {
        sum = sum + review.rating;
      }

      const average = sum ? sum / reviews.length : 0;

      allProductsReviews[pid] = {
        totalReviews: reviews.length,
        average: average ? parseFloat(average.toFixed(1)) : 0,
      };
    });
    res.send(allProductsReviews);
  } catch (error) {
    console.log(error);
  }
};
