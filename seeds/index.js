const mongoose = require('mongoose');
const Campground = require('../models/campgroundmodel')
const {places , descriptors} = require('../seeds/seedHelpers');
const cities = require('../seeds/cities_ind');

const connect  = mongoose.connect('mongodb://localhost:27017/Yelp')

const db = mongoose.connection;

db.on('error',console.error.bind(console,'connection error'));
db.once('open',()=>{
    console.log('Database Connected');
})

const seedDB = async () => {
    try{
    await Campground.deleteMany({});
    for(let i =0;i<50;i++){
        const rand406 = Math.floor(Math.random()*406);
        const price = Math.floor(Math.random()*1500) + 1500
        const camp = new Campground({
            location:`${cities[rand406].city}, ${cities[rand406].state}`,
            title: `${descriptors[Math.floor(Math.random()*descriptors.length)]} ${places[Math.floor(Math.random()*places.length)]}`,
            images:[{
                url:'https://source.unsplash.com/collection/9046579/',
                filename:''
            }],
            geometry:{
                type: "Point",
                coordinates : [cities[rand406].lng,cities[rand406].lat]
            },
            price,
            author:"614ee1a0d5a53a7e1a1063d8",
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque minus officia corporis, obcaecati deserunt quas nemo ad. Provident voluptates, aut libero deleniti voluptatibus corrupti dicta impedit consequatur? Fugiat, mollitia officiis!'
        })
        await camp.save()
    }
    }catch(e){
        console.log('Seeding Error',e)
    }
}

seedDB().then(()=>{
    db.close();
});