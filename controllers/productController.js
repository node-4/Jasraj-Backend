const Product = require('../models/productmodel');
const SubCategory = require('../models/subCategoryModel');
const Category = require('../models/categoryModel');
const User = require('../models/userModel');
const Wishlist = require('../models/wishlistMiodel');


const { productSchema, productIdSchema, updateProductSchema, createProductReviewSchema, updateProductReviewSchema, getAllProductReviewsSchema, getProductReviewByIdSchema, deleteProductReviewSchema, addToWishlistSchema, removeFromWishlistSchema, categoryIdSchema, subCategoryIdSchema, searchSchema, getNewArrivalProductsSchema } = require('../validations/productvalidation');




exports.createProduct = async (req, res) => {
    try {
        const { error } = productSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const {
            productName,
            description,
            price,
            categoryId,
            subCategoryId,
            size,
            color,
            stock,
        } = req.body;

        const images = req.files.map((file) => ({
            url: file.path,
        }));

        const subCategories = await SubCategory.findById(subCategoryId)

        if (!subCategories) {
            return res.status(404).json({ status: 404, message: "subCategories not found" });
        }
        const categories = await Category.findById(categoryId)
        if (!categories) {
            return res.status(404).json({ status: 404, message: "categories not found" });
        }

        const product = new Product({
            productName,
            description,
            image: images,
            price,
            categoryId,
            subCategoryId,
            size,
            color,
            stock,
        });

        await product.save();

        return res.status(201).json({ status: 201, message: 'Product created successfully', data: product });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Product creation failed', error: error.message });
    }
};


exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json({ status: 200, data: products });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error fetching products', error: error.message });
    }
};


exports.getAllProductsByAdmin = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json({ status: 200, data: products });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error fetching products', error: error.message });
    }
};


exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.productId;

        const { error } = productIdSchema.validate(req.params);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ status: 404, message: 'Product not found' });
        }

        return res.status(200).json({ status: 200, data: product });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error fetching product by ID', error: error.message });
    }
};


exports.forAdminGetProductById = async (req, res) => {
    try {
        const productId = req.params.productId;

        const { error } = productIdSchema.validate(req.params);
        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ status: 404, message: 'Product not found' });
        }

        return res.status(200).json({ status: 200, data: product });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Error fetching product by ID', error: error.message });
    }
};


exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.productId;

        const { error } = updateProductSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }


        let updatedFields = {
            ...req.body
        };

        if (updatedFields.subCategoryId) {
            const subCategories = await SubCategory.findById(updatedFields.subcategoryId)

            if (!subCategories) {
                return res.status(404).json({ status: 404, message: "subCategories not found" });
            }
        }

        if (updatedFields.categoryId) {
            const categories = await Category.findById(updatedFields.categoryId)
            if (!categories) {
                return res.status(404).json({ status: 404, message: "categories not found" });
            }
        }
        if (updatedFields.subCategoryId) {
            const subCategories = await Category.findById(updatedFields.subCategoryId)
            if (!subCategories) {
                return res.status(404).json({ status: 404, message: "subCategories not found" });
            }
        }

        if (req.files && req.files.length > 0) {
            const images = req.files.map((file) => ({
                url: file.path,
            }));

            updatedFields.image = images;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            updatedFields,
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ status: 404, message: 'Product not found' });
        }

        return res.status(200).json({ status: 200, message: 'Product updated successfully', data: updatedProduct });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Product update failed', error: error.message });
    }
};


exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId;

        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ status: 404, message: 'Product not found' });
        }

        return res.status(200).json({ status: 200, message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Product deletion failed', error: error.message });
    }
};


exports.createProductReview = async (req, res) => {
    try {
        const productId = req.params.productId;

        const { rating, comment } = req.body;

        const { error } = createProductReviewSchema.validate({ productId, rating, comment });

        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const userId = req.user.id;

        const userCheck = await User.findById(userId);

        if (!userCheck) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        const review = {
            user: userCheck._id,
            name: userCheck.userName,
            rating,
            comment,
        };

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ status: 404, message: 'Product not found' });
        }

        product.reviews.push(review);

        const totalRatings = product.reviews.reduce((sum, review) => sum + review.rating, 0);
        const newNumOfReviews = product.reviews.length;
        const newAvgRating = totalRatings / newNumOfReviews;

        product.rating = newAvgRating;
        product.numOfReviews = newNumOfReviews;

        await product.save();

        return res.status(201).json({ status: 201, message: 'Product review added successfully', data: product });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Product review creation failed', error: error.message });
    }
};


exports.getAllProductReviews = async (req, res) => {
    try {
        const productId = req.params.productId;

        const { error } = getAllProductReviewsSchema.validate({ productId });

        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ status: 404, message: 'Product not found' });
        }

        const reviews = product.reviews;

        res.status(200).json({ status: 200, data: reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Error fetching product reviews', error: error.message });
    }
};


exports.getProductReviewById = async (req, res) => {
    try {
        const productId = req.params.productId;
        const reviewId = req.params.reviewId;

        const { error } = getProductReviewByIdSchema.validate({ productId, reviewId });

        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ status: 404, message: 'Product not found' });
        }

        const review = product.reviews.id(reviewId);

        if (!review) {
            return res.status(404).json({ status: 404, message: 'Review not found' });
        }

        res.status(200).json({ status: 200, data: review });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Error fetching product review', error: error.message });
    }
};


exports.updateProductReview = async (req, res) => {
    try {
        const productId = req.params.productId;
        const reviewId = req.params.reviewId;
        const { rating, comment } = req.body;

        const { error } = updateProductReviewSchema.validate({ productId, reviewId, rating, comment });

        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ status: 404, message: 'Product not found' });
        }

        const review = product.reviews.id(reviewId);

        if (!review) {
            return res.status(404).json({ status: 404, message: 'Review not found' });
        }

        review.rating = rating;
        review.comment = comment;

        const totalRatings = product.reviews.reduce((sum, r) => sum + r.rating, 0);
        const newAvgRating = totalRatings / product.numOfReviews;

        product.rating = newAvgRating;

        await product.save();

        res.status(200).json({ status: 200, message: 'Product review updated successfully', data: review });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Product review update failed', error: error.message });
    }
};


exports.deleteProductReview = async (req, res) => {
    try {
        const productId = req.params.productId;
        const reviewId = req.params.reviewId;

        const { error } = deleteProductReviewSchema.validate({ productId, reviewId });

        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ status: 404, message: 'Product not found' });
        }

        const reviewIndex = product.reviews.findIndex((review) => review._id.toString() === reviewId);

        if (reviewIndex === -1) {
            return res.status(404).json({ status: 404, message: 'Review not found' });
        }

        product.reviews.splice(reviewIndex, 1);

        product.numOfReviews -= 1;

        if (product.numOfReviews > 0) {
            const totalRatings = product.reviews.reduce((sum, r) => sum + r.rating, 0);
            const newAvgRating = totalRatings / product.numOfReviews;
            product.rating = newAvgRating;
        } else {
            product.rating = 0;
        }

        await product.save();

        res.status(200).json({ status: 200, message: 'Product review deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Product review deletion failed', error: error.message });
    }
};


exports.addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;

        const { error } = addToWishlistSchema.validate({ productId });

        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        const wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            const newWishlist = new Wishlist({
                user: userId,
                products: [productId],
            });

            await newWishlist.save();
        } else {
            if (!wishlist.products.includes(productId)) {
                wishlist.products.push(productId);
                await wishlist.save();
            }
        }

        res.status(200).json({ status: 200, message: 'Product added to wishlist successfully', data: wishlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Error adding product to wishlist', error: error.message });
    }
};


exports.getMyWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const wishlist = await Wishlist.findOne({ user: userId }).populate('products');

        if (!wishlist) {
            return res.status(404).json({ status: 404, message: 'Wishlist not found' });
        }

        res.status(200).json({ status: 200, data: wishlist.products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Error fetching wishlist', error: error.message });
    }
};


exports.removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;

        const { error } = removeFromWishlistSchema.validate({ productId });

        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const product = await Product.findOne({ _id: productId });

        if (!product) {
            return res.status(404).json({ status: 404, message: 'product not found' });
        }

        const wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            return res.status(404).json({ status: 404, message: 'Wishlist not found' });
        }

        wishlist.products = wishlist.products.filter((id) => id.toString() !== productId.toString());

        await wishlist.save();

        res.status(200).json({ status: 200, message: 'Product removed from wishlist successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Error removing product from wishlist', error: error.message });
    }
};


exports.getProductsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;

        const { error } = categoryIdSchema.validate({ categoryId });

        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const products = await Product.find({ categoryId });

        res.status(200).json({ status: 200, data: products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Error fetching products by category', error: error.message });
    }
};


exports.getProductsBySubCategory = async (req, res) => {
    try {
        const subCategoryId = req.params.subCategoryId;

        const { error } = subCategoryIdSchema.validate({ subCategoryId });

        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const products = await Product.find({ subCategoryId });

        res.status(200).json({ status: 200, data: products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Error fetching products by category', error: error.message });
    }
};


exports.searchProducts = async (req, res) => {
    try {
        const { search } = req.query;

        const { error } = searchSchema.validate({ search });

        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const productsCount = await Product.count();
        if (search) {
            let data1 = [
                {
                    $lookup: { from: "categories", localField: "categoryId", foreignField: "_id", as: "categoryId" },
                },
                { $unwind: "$categoryId" },
                {
                    $lookup: { from: "subcategories", localField: "subCategoryId", foreignField: "_id", as: "subCategoryId", },
                },
                { $unwind: "$subCategoryId" },
                {
                    $match: {
                        $or: [
                            { "categoryId.name": { $regex: search, $options: "i" }, },
                            { "subCategoryId.name": { $regex: search, $options: "i" }, },
                            { "productName": { $regex: search, $options: "i" }, },
                            { "description": { $regex: search, $options: "i" }, },
                        ]
                    }
                },
                { $sort: { numOfReviews: -1 } }
            ]
            let apiFeature = await Product.aggregate(data1);
            return res.status(200).json({ status: 200, message: "Product data found.", data: apiFeature, count: productsCount });
        } else {
            let apiFeature = await Product.aggregate([
                { $lookup: { from: "categories", localField: "categoryId", foreignField: "_id", as: "categoryId" } },
                { $unwind: "$categoryId" },
                { $lookup: { from: "subcategories", localField: "subCategoryId", foreignField: "_id", as: "subCategoryId", }, },
                { $unwind: "$subCategoryId" },
                { $sort: { numOfReviews: -1 } }
            ]);

            return res.status(200).json({ status: 200, message: "Product data found.", data: apiFeature, count: productsCount });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Error searching products', error: error.message });
    }
};


exports.getNewArrivalProductsByCategoryAndSubCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const subcategoryId = req.params.subcategoryId;

        const { error } = getNewArrivalProductsSchema.validate({ categoryId, subcategoryId });

        if (error) {
            return res.status(400).json({ status: 400, message: error.details[0].message });
        }

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ status: 404, message: 'Category not found' });
        }

        const subCategory = await SubCategory.findById(subcategoryId);

        if (!subCategory) {
            return res.status(404).json({ status: 404, message: 'SubCategory not found' });
        }

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const newArrivalProducts = await Product.find({
            categoryId: categoryId,
            subCategoryId: subcategoryId,
            createdAt: { $gte: thirtyDaysAgo },
        }).sort({ createdAt: -1 });

        return res.status(200).json({ status: 200, message: 'New arrival products by category and subcategory', data: newArrivalProducts, });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Error retrieving new arrival products', error: error.message, });
    }
};


exports.getNewArrivalProducts = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 90);

        const newArrivalProducts = await Product.find({
            createdAt: { $gte: thirtyDaysAgo },
        }).sort({ createdAt: -1 });

        return res.status(200).json({ status: 200, message: 'New arrival products', data: newArrivalProducts, });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Error retrieving new arrival products', error: error.message, });
    }
};


exports.getNewArrivalProductsforADmin = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 90);

        const newArrivalProducts = await Product.find({
            createdAt: { $gte: thirtyDaysAgo },
        }).sort({ createdAt: -1 });

        return res.status(200).json({ status: 200, message: 'New arrival products', data: newArrivalProducts, });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Error retrieving new arrival products', error: error.message, });
    }
};


exports.getMostDemandedProducts = async (req, res) => {
    try {
        const mostDemandedProducts = await Product.find({})
            .sort({ numOfReviews: -1 })

        return res.status(200).json({ status: 200, message: 'Most demanded products', data: mostDemandedProducts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Error retrieving most demanded products', error: error.message, });
    }
};


exports.getMostDemandedProductsforAdmin = async (req, res) => {
    try {
        const mostDemandedProducts = await Product.find({})
            .sort({ numOfReviews: -1 })

        return res.status(200).json({ status: 200, message: 'Most demanded products', data: mostDemandedProducts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, message: 'Error retrieving most demanded products', error: error.message, });
    }
};


exports.paginateProductSearch = async (req, res) => {
    try {
        const { search, fromDate, toDate, categoryId, subCategoryId, status, page, limit } = req.query;
        let query = {};
        if (search) {
            query.$or = [
                { "productName": { $regex: req.query.search, $options: "i" }, },
                { "description": { $regex: req.query.search, $options: "i" }, },
            ]
        }
        if (status) {
            query.status = status
        }
        if (subCategoryId) {
            query.subCategoryId = subCategoryId
        }
        if (categoryId) {
            query.categoryId = categoryId
        }
        if (fromDate && !toDate) {
            query.createdAt = { $gte: fromDate };
        }
        if (!fromDate && toDate) {
            query.createdAt = { $lte: toDate };
        }
        if (fromDate && toDate) {
            query.$and = [
                { createdAt: { $gte: fromDate } },
                { createdAt: { $lte: toDate } },
            ]
        }
        let options = {
            page: Number(page) || 1,
            limit: Number(limit) || 15,
            sort: { createdAt: -1 },
            populate: ('categoryId subCategoryId')
        };
        let data = await Product.paginate(query, options);
        return res.status(200).json({ status: 200, message: "Product data found.", data: data });

    } catch (err) {
        return res.status(500).send({ msg: "internal server error ", error: err.message, });
    }
};