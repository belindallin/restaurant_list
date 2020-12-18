//load express
const express = require ( 'express' )
//load express-handlebars
const exphbs = require ( 'express-handlebars' )
//load restaurant
const Restaurant = require ( './models/restaurant' )
//load mongoose
const mongoose = require ( 'mongoose' )

//Declare related variables for server
const app = express ()
const port = 3000

app.engine ( 'handlebars' , exphbs ({ defaultLayout : 'main' }) )
app.set ( 'view engine' , 'handlebars' )
app.use ( express.static ( 'public' ) )

//set connection with database
mongoose.connect ( 'mongodb://localhost/restaurant_list' , { useNewUrlParser: true , useUnifiedTopology: true } )

const db = mongoose.connection
db.on ( 'error' , () => { console.log ('mongodb error!!!')})
db.once ( 'open' , () => { 
    console.log ('mongoose connected')
})

//get data by client and response to client
app.get ( '/' , ( req , res ) => {
    Restaurant.find()
    .lean()
    .then ( restaurants => res.render ( 'index', { restaurants }) )
    .catch ( error => console.log ( error ) )    
})
app.get ( '/restaurants/:restaurant_id' , ( req , res ) => {
    const restaurant= restaurant_list.results.find ( restaurant => restaurant.id.toString() === req.params.restaurant_id)
    res.render ( 'show', { restaurant: restaurant } )
})
app.get ( '/search' , ( req , res ) => {
    const keyword = req.query.keyword
    const restaurants = restaurant_list.results.filter ( restaurant => restaurant.name.toLowerCase().includes(keyword.toLowerCase().trim()) || restaurant.category.toLowerCase().includes(keyword.toLowerCase().trim()) )   
    res.render ( 'index', { restaurants: restaurants , keywords :  req.query.keyword } )
})

//listening server
app.listen ( port , () => {
    console.log ( `Resaurant Web is running on http://localhost:${port}` )
})