//load express
const express = require ( 'express' )
//load express-handlebars
const exphbs = require ( 'express-handlebars' )
//load restaurant
const Restaurant = require ( './models/restaurant' )
//load mongoose
const mongoose = require ( 'mongoose' )
//load body-parser
const bodyParser = require ( 'body-parser' )
const restaurantList = require ( './restaurant.json' ).results

//Declare related variables for server
const app = express ()
const port = 3000

app.engine ( 'handlebars' , exphbs ({ defaultLayout : 'main' }) )
app.set ( 'view engine' , 'handlebars' )
app.use ( express.static ( 'public' ) )
app.use ( bodyParser.urlencoded ({ extended : true }) )

//set connection with database
mongoose.connect ( 'mongodb://localhost/restaurant_list' , { useNewUrlParser: true , useUnifiedTopology: true } )

const db = mongoose.connection
db.on ( 'error' , () => { console.log ('mongodb error!!!') } )
db.once ( 'open' , () => { 
    console.log ( 'mongoose connected' )
})

//get data by client and response to client
app.get ( '/' , ( req , res ) => {
    Restaurant.find()
    .lean()
    .then ( restaurants => res.render ( 'index', { restaurants } ) )
    .catch ( error => console.log ( error ) )    
})
app.get ( '/restaurant/new' , ( req , res ) => {
    return res.render ( 'new' )
})
app.post ( '/restaurant' , ( req ,res ) => {
    const name = req.body.name     
    const name_en = req.body.name_en  
    const category  = req.body.category   
    const image  = req.body.image   
    const location = req.body.location  
    const phone = req.body.phone  
    const google_map = req.body.google_map  
    const rating  = req.body.rating  
    const description = req.body.description    
    return Restaurant.create ({ name , name_en , category , image , location , phone ,google_map , rating ,description })     
        .then ( () => res.redirect ('/') ) 
        .catch ( error => console.log (error) )

})
app.get ( '/restaurants/:id' , ( req , res ) => {
    const id = req.params.id
    return Restaurant.findById ( id )
    .lean()
    .then ( restaurant  => {
        res.render( 'show' , { restaurant } )
    })
    .catch(error => console.log(error))
})
app.get ( '/restaurants/:id/edit' , ( req , res ) => {
    const id = req.params.id
    return Restaurant.findById ( id )
    .lean()
    .then ( restaurant  =>  res.render ( 'edit' , { restaurant } ) )
    .catch ( error => console.log ( error ) )
})

app.post ( '/restaurants/:id/edit' , ( req , res ) => {
    const id = req.params.id
    const name = req.body.name     
    const name_en = req.body.name_en  
    const category  = req.body.category   
    const image  = req.body.image   
    const location = req.body.location  
    const phone = req.body.phone  
    const google_map = req.body.google_map  
    const rating  = req.body.rating  
    const description = req.body.description 
    
    return Restaurant.findById ( id )
        .then ( restaurant => {
            restaurant.name = name
            restaurant.name_en = name_en 
            restaurant.category = category
            restaurant.image = image 
            restaurant.location = location 
            restaurant.phone = phone 
            restaurant.google_map = google_map 
            restaurant.rating = rating 
            restaurant.description = description
            return restaurant.save()
        })
        .then ( () => res.redirect ( `/restaurants/${id}` ) ) 
        .catch ( error => console.log ( error ) )
})
app.post ( '/restaurants/:id/delete' , ( req , res ) => {
    const id = req.params.id
    return Restaurant.findById ( id )
      .then ( restaurant => restaurant.remove () )
      .then ( () => res.redirect ('/') )
      .catch ( error => console.log ( error ) )
})
app.get ( '/search' , ( req , res ) => {
    const keyword = req.query.keyword
    const restaurants = restaurantList.filter ( restaurant => restaurant.name.toLowerCase().includes ( keyword.toLowerCase().trim() ) || restaurant.category.toLowerCase().includes ( keyword.toLowerCase().trim() ) )   
    res.render ( 'index', { restaurants: restaurants , keywords :  req.query.keyword } )
})


//listening server
app.listen ( port , () => {
    console.log ( `Restaurant Web is running on http://localhost:${port}` )
})