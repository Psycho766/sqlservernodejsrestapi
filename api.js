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
      if(result.length === 0){
         response.status(401).json({message: 'Invalid username or password'});
      }

      //if user is authenicated
      response.status(200).json(result[0]);
   })

})

//fetch all accounts
router.route('/accounts').get((request,response)=>{
    dboperations.getAccounts().then(result => {
       response.json(result[0]);
    })
})

//fetch all accounts
router.route('/result/:position').get((request,response)=>{
   dboperations.getResult(request.params.position).then(result => {
      response.json(result[0]);
   })
})

//fetch all accounts
router.route('/candidates/:status').get((request,response)=>{
   dboperations.getCandidate(request.params.status).then(result => {
      response.json(result[0]);
   })
})

//verify
router.route('/verifycandidate/:id/:status').get((request,response)=>{
   dboperations.verifyCandidacy(request.params.id, request.params.status).then(result => {
      response.status(202).json(result[0]);
   })
})


// add candidates
router.route('/addCandidate').post((request,response)=>{

   let candidates =  {...request.body}

   dboperations.registerCandidate(candidates).then(result => {
      response.status(200).json({message: "Candidate added"});
   })

})


//updates the vote
router.route('/updateVoteCount/:id').get((request,response)=>{

   dboperations.updateVoteCount(request.params.id).then(result => {
      response.status(200).json({message: "Vote added"});
   })

})

// create election
router.route('/addElection').post((request,response)=>{

   let election =  {...request.body}

   dboperations.createElection(election).then(result => {
      response.status(202).json({message: "Election Created"});
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
console.log('EMS is runnning at ' + port);



