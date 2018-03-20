var express = require('express')
var app = express()

app.get('/', function(req, res, next) {
    req.getConnection(function(error, conn) {
        var sqlQuery = "SELECT * FROM store;";
        // Query to get all the entries.
        // conn object which will execute and return results
        conn.query(sqlQuery,function(err, rows, fields) {
            if (err) {
                // Display error message in case an error
                req.flash('error', err)
                res.render('store/list', {
                    title: 'Store listing',
                    data: ''
                })
            } else {
                // render to views/store/list.ejs template file
                res.render('store/list', {
                    title: 'Store listing',
                    data: rows
                })
            }
        })
    })
})

// Display form to get values for store item for insertion
app.get('/add', function(req, res, next){
    // render to views/store/add.ejs
    res.render('store/add', {
        title: 'Add New Item',
        sname: '',
        qty: '',
        price: ''
    })
})

// ADD NEW ITEM POST ACTION -- Used to insert values
// Notice that we are using post here
app.post('/add', function(req, res, next){
    req.assert('sname', 'sname is required').notEmpty()
    //Validate sname
    req.assert('qty', 'Quantity is required').notEmpty()
    //Validate qty
    req.assert('price', 'Price is required').notEmpty()
    //Validate price
    var errors = req.validationErrors()
    if( !errors ) {   //No errors were found.  Passed Validation!
        var item = {
            sname: req.sanitize('sname').escape().trim(),
            qty: req.sanitize('qty').escape().trim(),
            price: req.sanitize('price').escape().trim()
        }
        req.getConnection(function(error, conn) {
            /* Below we are doing a template replacement. The ?
             is replaced by entire item object*/
            /* This is the way which is followed to substitute
             values for SET*/
            conn.query('INSERT INTO store SET ?', item,
                       function(err, result) {
                           if (err) {
                               req.flash('error', err)
                               // render to views/store/add.ejs
                               res.render('store/add', {
                                   title: 'Add New Item',
                                   sname: item.sname,
                                   qty: item.qty,
                                   price: item.price
                               })
                           } else {
                               req.flash('success', 'Data added successfully!')
                               // render to views/store/add.ejs
                               res.render('store/add', {
                                   title: 'Add New Item',
                                   sname: '',
                                   qty: '',
                                   price: ''
                               })
                           }
                       })
        })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)
        /**
         * Using req.body.sname
         * because req.param('sname') is deprecated
         */
        // Sending back the entered values for user to verify
        res.render('store/add', {
            title: 'Add New Item',
            sname: req.body.sname,
            qty: req.body.qty,
            price: req.body.price
        })
    }
})

module.exports = app // This must be the last line in the file. Any  and all code
//must be added before this line
