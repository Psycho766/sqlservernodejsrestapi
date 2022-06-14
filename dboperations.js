var config = require('./dbconfig');
const sql = require('mssql');

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
    try {
        let pool = await sql.connect(config);
        let findUser = await pool.request()
                .input('Username', sql.VarChar, user.Username)
                .input('Password', sql.VarChar, user.Password)
                .input('userType', sql.Int, determineUserType(user.UserType))
            .query('SELECT Account.Username, Account.Password, SystemUser.SystemUserID FROM Account JOIN SystemUser ON SystemUser.SystemUserID = Account.SystemUserID WHERE Account.Username = @Username AND Account.Password = @Password AND SystemUser.SystemUserID = @usertype');

            //join table account and systemuser

        
        console.log("loginUser", findUser.recordsets);
        // if recordet is greter than one meaning the user is existing and authorized
        if(findUser.recordset.length > 0) {
            return true;
        }else{
            return false;
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
            .input('PartylistID', sql.Int, candidates.PartylistID)
            .input('Link', sql.VarChar, candidates.Link)
            .input('Status', sql.VarChar, candidates.Status)
            .query('INSERT INTO Candidate (Firstname, Middlename, Lastname,ElectionID, GradeLevelID,PositionID,PartylistID,Link,Status) VALUES (@Firstname, @Middlename, @Lastname,@ElectionID, @GradeLevelID,@PositionID,@PartylistID,@Link,@Status)');
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

async function getOrder(orderId) {
    try {
        let pool = await sql.connect(config);
        let product = await pool.request()
            .input('input_parameter', sql.Int, orderId)
            .query("SELECT * from Orders where Id = @input_parameter");
        return product.recordsets;

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
    determineUserType:determineUserType,
    getAccounts: getAccounts,
    getOrder : getOrder,
    addOrder : addOrder,
    addUser: addUser,
    loginUser: loginUser,
    registerCandidate: registerCandidate,
    createElection: createElection,
}