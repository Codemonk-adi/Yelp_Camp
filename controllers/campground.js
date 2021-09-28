const Campground = require('../models/campgroundmodel')
const { cloudinary } = require('../cloudinary')
const mbxGeocode = require('@mapbox/mapbox-sdk/services/geocoding');
const Geocoder = mbxGeocode({ accessToken: process.env.mapbox_token });


module.exports.index = async(req, res) => {
    const camps = await Campground.find({});
    res.render('campgrounds/index', { camps })
};

module.exports.createCampground = async(req, res) => {
    const geoData = await Geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 2
    }).send()
    const camp = new Campground(req.body.campground)
    camp.author = req.user._id;
    camp.geometry = geoData.body.features[0].geometry;
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    await camp.save();
    const id = camp._id;
    req.flash('success', `Successfully Created ${camp.title}`);
    res.redirect('/campgrounds/' + id)
};

module.exports.newForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.renderDetails = async(req, res) => {
    const id = req.params.id;
    let camp = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!camp) {
        req.flash('error', 'Campground not found')
    }
    res.render('campgrounds/details', { camp })
}

module.exports.editCampground = async(req, res) => {
    const id = req.params.id;
    let camp = await Campground.findByIdAndUpdate(id, {...req.body.campground }, { new: true });
    if (req.body.deleteImages) {
        for (image_id of req.body.deleteImages) {
            cloudinary.uploader.destroy(camp.images.id(image_id).filename)
        }
    }
    await camp.updateOne({
        $pull: {
            images: {
                _id: { $in: req.body.deleteImages }
            }
        }
    })

    const img = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.images.push(...img);

    await camp.save();
    req.flash('success', `Successfully Updated ${camp.title}`)
    res.redirect(`/campgrounds/${camp.id}`)

}

module.exports.deleteCampground = async(req, res) => {
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    req.flash('success', `Successfully deleted Campground!`);
    res.redirect('/campgrounds');

}

module.exports.renderEditForm = async(req, res) => {
    const id = req.params.id;
    let camp = await Campground.findById(id);
    res.render('campgrounds/edit', { camp })
}