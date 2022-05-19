var Db  = require('./dboperations');
var Order = require('./order');
const dboperations = require('./dboperations');

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);


router.use((request,response,next)=>{
   console.log('middleware');
   next();
})

// add account user
router.route('/addAccount').post((request,response)=>{
   let user =  {...request.body}

   dboperations.addUser(user).then(result => {
      response.status(201).json(result);
   })

})

// login account user
router.route('/login').post((request,response)=>{
   let login =  {...request.body}

   dboperations.loginUser(login).then(result => {
      if(!result){
         response.status(401).json(result[0]);
      }

      //if user is authenicated
      response.status(200).json(result);
   })

})

router.route('/orders').get((request,response)=>{

    dboperations.getOrders().then(result => {
       response.json(result[0]);
    })

})

router.route('/orders/:id').get((request,response)=>{

    dboperations.getOrder(request.params.id).then(result => {
       response.json(result[0]);
    })

})

router.route('/orders').post((request,response)=>{

    let order = {...request.body}

    dboperations.addOrder(order).then(result => {
       response.status(201).json(result);
    })

})




var port = process.env.PORT || 8090;
app.listen(port);
console.log('Order API is runnning at ' + port);



