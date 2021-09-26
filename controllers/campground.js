const Campground = require('../models/campgroundmodel')



module.exports.index = async (req,res) =>{
    const camps = await Campground.find({});
    res.render('campgrounds/index',{camps})
};

module.exports.createCampground = async (req,res) =>{
    const camp = new Campground(req.body.campground)
    camp.author = req.user._id;
    await camp.save();
    const id = camp._id;
    req.flash('success', `Successfully Created ${camp.title}`);
    res.redirect('/campgrounds/'+id)
};

module.exports.newForm = (req,res)=>{
    res.render('campgrounds/new');
}

module.exports.renderDetails = async (req,res) =>{
    const id = req.params.id;
    let camp = await Campground.findById(id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!camp){
        req.flash('error', 'Campground not found' )
    }
    res.render('campgrounds/details',{camp})
}

module.exports.editCampground =  async (req,res) =>{
    const id = req.params.id;
    let camp = await Campground.findByIdAndUpdate(id,req.body.campground,{new:true});
    req.flash('success',`Successfully Updated ${camp.title}`)
    res.render('campgrounds/details',{camp})

}

module.exports.deleteCampground = async (req,res) =>{
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    req.flash('success',`Successfully deleted Campground!`);
    res.redirect('/campgrounds');

}

module.exports.renderEditForm = async (req,res) =>{
    const id = req.params.id;
    let camp = await Campground.findById(id);
    res.render('campgrounds/edit',{camp})
}