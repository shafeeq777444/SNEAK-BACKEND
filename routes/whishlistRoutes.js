const express = require('express');
const router = express.Router();
const verifyTokenByCookies = require('../middlewares/verifyTokenByCookies')
const whishlistController = require('../controllers/whishlistController');

router.post('/whishlists', verifyTokenByCookies, whishlistController.addToWishlist);
router.delete('/:id/whishlists', verifyTokenByCookies, whishlistController.removeFromWishlist);
router.get('/wishlists', verifyTokenByCookies, whishlistController.getWishlist);

module.exports = router;
