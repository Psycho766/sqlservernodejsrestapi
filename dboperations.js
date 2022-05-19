var config = require('./dbconfig');
const sql = require('mssql');

async function addUser(user) {
    try {
        let pool = await sql.connect(config);
        let insertUser = await pool.request()
            .input('AccountID', sql.Int, user.AccountID)
            .input('UserTypeID', sql.Int, user.UserTypeID)
            .input('DepartmentID', sql.VarChar, user.DepartmentID)
            .input('Username', sql.VarChar, user.Username)
            .input('Password', sql.VarChar, user.Password)
            .query('INSERT INTO Account (AccountID, UserTypeID, DepartmentID, Username, Password) VALUES (@AccountID, @UserTypeID, @DepartmentID, @Username, @Password)');
        return insertUser.recordsets;
    }
    catch (err) {
        console.log(err);
    }
}

async function loginUser(user) {
    try {
        let pool = await sql.connect(config);
        let findUser = await pool.request()
            .input('Username', sql.VarChar, user.Username)
            .input('Password', sql.VarChar, user.Password)
            .query('SELECT Username, Password From Account WHERE Username = @Username AND Password = @Password');
        
        if(findUser.recordset.length > 0) {
            return true;
        }else{
            return false;
        }
    }
    catch (err) {
        console.log(err);
    }
}

async function getOrders() {
    try {
        let pool = await sql.connect(config);
        let products = await pool.request().query("SELECT * from Orders");
        return products.recordsets;
    }
    catch (error) {
        console.log(error);
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
    getOrders: getOrders,
    getOrder : getOrder,
    addOrder : addOrder,
    addUser: addUser,
    loginUser: loginUser,
}