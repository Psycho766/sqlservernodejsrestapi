var config = require('./dbconfig');
const sql = require('mssql');
const e = require('express');

async function addUser(user) {
    try {
        let pool = await sql.connect(config);
        let insertUser = await pool.request()
            .input('SystemUserID', sql.Int, user.UserTypeID)
            .input('EmailAddress', sql.VarChar, user.email)
            .input('Username', sql.VarChar, user.Username)
            .input('Password', sql.VarChar, user.Password)
            .query('INSERT INTO Account (SystemUserID, Username, Password, EmailAddress) VALUES (@SystemUserID, @Username, @Password, @EmailAddress)');
        return insertUser.recordsets;
    }
    catch (err) {
        console.log(err);
    }
}

// login authentication
async function loginUser(user) {
    const voter = 'Voter';
    try {
        let pool = await sql.connect(config);

        if(user.UserType == voter) {
            let findVoter = await pool.request()
            .input('Username', sql.VarChar, user.Username)
            .input('Password', sql.VarChar, user.Password)
            .input('userType', sql.Int, determineUserType(user.UserType))
            .query('SELECT Voter.VoterID, Voter.password, Voter.GradeLevelID, SystemUser.SystemUserID FROM Voter JOIN SystemUser ON SystemUser.SystemUserID = Voter.SystemUserID WHERE Voter.VoterID = @Username AND Voter.Password = @Password AND SystemUser.SystemUserID = @usertype');

            console.log("voterLogin", findVoter.recordset);
            // if recordet is greter than one meaning the user is existing and authorized
            return findVoter.recordset; 
        }else{

            let findUser = await pool.request()
                .input('Username', sql.VarChar, user.Username)
                .input('Password', sql.VarChar, user.Password)
                .input('userType', sql.Int, determineUserType(user.UserType))
                .query('SELECT Account.Username, Account.Password, SystemUser.SystemUserID FROM Account JOIN SystemUser ON SystemUser.SystemUserID = Account.SystemUserID WHERE Account.Username = @Username AND Account.Password = @Password AND SystemUser.SystemUserID = @usertype');

            console.log("loginUser", findUser.recordset);
            // if recordet is greter than one meaning the user is existing and authorized
           return findUser.recordset;
s
        }
    }
    catch (err) {
        
        console.log(err);
        return false;
    }
}

function determineUserType(userType) {
    if(userType == "SCE Admin") {
        return 1;
    }else if(userType == "Campaign Manager") {
        return 2;
    }else if(userType == "Voter") {
        return 3;
    }
}

// login authentication
async function getAccounts() {
    try {
        let pool = await sql.connect(config);
        let accounts = await pool.request()
            .query('SELECT Account.AccountiD, Account.SystemUserID, Account.EmailAddress, Account.Username, Account.Password, SystemUser.UserType FROM Account INNER JOIN SystemUser ON Account.SystemUserID = SystemUser.SystemUserID');
        
        return accounts.recordsets;
    }
    catch (err) {
        
        console.log(err);
        return false;
    }
}

async function getResult(posotionId) {
    try {
        let pool = await sql.connect(config);
        let accounts = await pool.request()
            .input('positionId', sql.VarChar, posotionId)
            .query('SELECT MAX(VoteCount) AS TotalVote, PositionID, FirstName, Lastname FROM Candidate WHERE PositionID = @positionId GROUP BY FirstName, Lastname, PositionID');
        return accounts.recordset;
    }
    catch (err) {
        
        console.log(err);
        return false;
    }
}

// login authentication
async function verifyCandidacy(id, status) {

    console.log(id, status);
    try {
        let pool = await sql.connect(config);
        let verify = await pool.request()
            .input('status', sql.Char, status)
            .input('id', sql.Int, id)
            .query('UPDATE Candidate SET Status = @status WHERE CandidateID = @id');
        
        return verify.recordsets;
    }
    catch (err) {
        
        console.log(err);
        return false;
    }
}


async function registerCandidate(candidates) {
    try {
        let pool = await sql.connect(config);
        let insertcandidate = await pool.request()
            .input('Firstname', sql.VarChar, candidates.Firstname)
            .input('Middlename', sql.VarChar, candidates.Middlename)
            .input('Lastname', sql.VarChar, candidates.Lastname)
            .input('ElectionID', sql.VarChar, candidates.electionId)
            .input('GradeLevelID', sql.VarChar, candidates.GradeLevelID)
            .input('PositionID', sql.VarChar, candidates.PositionID)
            .input('PartyListID', sql.VarChar, candidates.PartyListID)
            .input('Link', sql.VarChar, candidates.Link)
            .input('Status', sql.VarChar, candidates.Status)
            .input('VoteCount', sql.VarChar, candidates.VoteCount)
            .query('INSERT INTO Candidate (Firstname, Middlename, Lastname,ElectionID, GradeLevelID,PositionID,PartyListID,Link,Status,VoteCount) VALUES (@Firstname, @Middlename, @Lastname,@ElectionID, @GradeLevelID,@PositionID,@PartyListID,@Link,@Status,@VoteCount)');
        return insertcandidate.recordset;
    }
    catch (err) {
        console.log(err);
    }
}

async function createElection(election) {
    try {
        let pool = await sql.connect(config);
        let insertelection = await pool.request()
            .input('ElectionName', sql.VarChar, election.ElectionName)
            .input('StartDate', sql.DateTime, election.StartDate)
            .input('EndDate', sql.DateTime, election.EndDate)
            .input('Timezone', sql.VarChar, election.Timezone)
            .input('Status', sql.Int, election.Status)
            .query('INSERT INTO Election (ElectionName, StartDate, EndDate, Timezone, Status) VALUES (@ElectionName, @StartDate, @EndDate, @Timezone, @Status)');
        return insertelection.recordset;
    }
    catch (err) {
        console.log(err);
    }
}

async function getCandidate(status) {
    try {
        let pool = await sql.connect(config);
        let Candidate = await pool.request()
        .input('status', sql.Char, status)
        .query("SELECT * from Candidate WHERE Status = @status");
        return Candidate.recordsets;

    }
    catch (error) {
        console.log(error);
    }
}

async function updateVoteCount(id) {
    const addOne = 1;
    try {
        let pool = await sql.connect(config);
        let Candidate = await pool.request()
        .input('id', sql.Int, id)
        .input('voteCount', sql.Int, addOne)
        .query("UPDATE Candidate SET VoteCount = VoteCount +  @voteCount WHERE CandidateID = @id");
        return Candidate.recordsets;

    }
    catch (error) {
        console.log(error);
    }
}




async function addOrder(order) {

    try {
        let pool = await sql.connect(config);
        let insertProduct = await pool.request()
            .input('Id', sql.Int, order.Id)
            .input('Title', sql.NVarChar, order.Title)
            .input('Quantity', sql.Int, order.Quantity)
            .input('Message', sql.NVarChar, order.Message)
            .input('City', sql.NVarChar, order.City)
            .execute('InsertOrders');
        return insertProduct.recordsets;
    }
    catch (err) {
        console.log(err);
    }

}


module.exports = {
    getResult: getResult,
    getCandidate: getCandidate,
    verifyCandidacy: verifyCandidacy,
    determineUserType:determineUserType,
    getAccounts: getAccounts,
    addOrder : addOrder,
    addUser: addUser,
    loginUser: loginUser,
    registerCandidate: registerCandidate,
    createElection: createElection,
    updateVoteCount: updateVoteCount,
}