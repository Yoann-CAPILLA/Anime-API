const { Router } = require('express');
const tagController = require('./controllers/tagController');
const animeController = require('./controllers/animeController');
const bookmarkController = require('./controllers/bookmarkController');
const userController = require('./controllers/userController');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const router = Router();
const searchSchema = require('./schemas/search');
const loginSchema = require('./schemas/login');
const userSchema = require('./schemas/user');
const userChangesSchema = require('./schemas/userChanges');
const idSchema = require('./schemas/id');
const bookmarkSchema = require('./schemas/bookmark');
const { validateQuery, validateBody } = require('./services/validator');
const verifyJWT = require('./services/token');

const { cache, flushUser } = require('./services/cache');

/*****************************************************************
 *                      API DOC                                  *
 * **************************************************************/
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument));

/*****************************************************************
 *                      ANIMES                                   *
 * **************************************************************/
router.get('/animes', cache(), animeController.getAll);
router.get('/anime/:id(\\d+)', cache(), animeController.getOne);
router.get('/search', validateQuery(searchSchema), cache(), animeController.search);

/*****************************************************************
 *                      CATEGORIES                               *
 * **************************************************************/
router.get('/category', cache(60*5), tagController.getMainTags);
router.get('/category/:id(\\d+)', cache(), tagController.getOneTag);
router.get('/tags', cache(), tagController.getAllTags);

/*****************************************************************
 *                        USER                                   *
 * **************************************************************/
router.post('/signin', validateBody(loginSchema), userController.getUser);
router.post('/signup', validateBody(userSchema), userController.addOne);
router.patch('/user', verifyJWT, validateBody(userChangesSchema), userController.modifyOne);
router.delete('/user', verifyJWT, validateBody(idSchema), userController.deleteOne);

/*****************************************************************
 *                      BOOKMARKS                                *
 * **************************************************************/
router.get('/bookmark', verifyJWT, validateBody(idSchema), cache(), bookmarkController.getBookmark);
router.put('/bookmark', verifyJWT, validateBody(bookmarkSchema), flushUser, bookmarkController.setBookmark);
router.delete('/bookmark', verifyJWT, validateBody(bookmarkSchema), flushUser, bookmarkController.deleteBookmark);

module.exports = router;
