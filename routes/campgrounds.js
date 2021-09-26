const express = require('express')
const Router = express.Router()
const WrapperAsync = require('../utils/WrapperAsync')
const {isLoggedIn, ValidateCamp,ValidateId,isOwner} = require('../middleware');
const Controller = require('../controllers/campground')


Router.route('/')
    .get(WrapperAsync(Controller.index))
    .post(isLoggedIn,ValidateCamp,WrapperAsync(Controller.createCampground));

Router.get('/new',isLoggedIn,Controller.newForm);
    
Router.route('/:id')
    .get(ValidateId ,WrapperAsync(Controller.renderDetails))
    .post(isLoggedIn,ValidateCamp,isOwner,WrapperAsync(Controller.editCampground))
    .delete(isLoggedIn,isOwner,WrapperAsync(Controller.deleteCampground));

Router.get('/:id/edit',isLoggedIn,isOwner,WrapperAsync(Controller.renderEditForm));


module.exports = Router;