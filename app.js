let express = require('express')
let fs = require('fs')
let mysql = require('mysql')
const bodyParser = require('body-parser');


let app = express()
let port = process.env.PORT || 3000;

// parse JSON (application/json content-type) 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//make db connection
let db = mysql.createConnection({
    host     : 'localhost',
    user     : 'arabaz',
    password : 'arabaz98',
    database : 'hotel'
});

// connect to db
db.connect((err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("Connected Successfully to db");
    }
})



// REST API ROUTES
app.get('/',(req,res)=>{
    res.send("Hello Welcome")
})


// http://localhost:3000/getrhotel/?rid=1
app.get('/getrhotel',(req,res)=>{
    hotel_id = req.query.rid;

    let q = "select menu_item,cost from rHotel"+hotel_id.toString()
    
    db.query(q,(err,result,fields)=>{
        if(err) console.log(err);
    
        let sendRes = result.map((row,index)=>{
            return [result[index].menu_item,result[index].cost]
        })
    
        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify(sendRes))

    })
})

// http://localhost:3000/getfrhotel/?rid=14&fid=1
app.get('/getfrhotel',(req,res)=>{
    
    let hotel_id = req.query.rid;
    let f_id = req.query.fid;

    let query = "select menu_item,cost from f"+f_id.toString()+"h"+hotel_id.toString();
    
    db.query(query,(err,result)=>{
        if(err) console.log(err);

        let sendRes = result.map((row,index)=>{
            return [result[index].menu_item,result[index].cost]
        })
    
        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify(sendRes))

    })
})


// http://localhost:3000/putrhotel/?rid=1&name=pizza&cost=21
app.get('/putrhotel',(req,res)=>{
    let hotel_id = req.query.rid;
    let menu_item = req.query.name;
    let cost = req.query.cost;

    console.log(hotel_id);
    console.log(menu_item);
    console.log(cost);

    let query_sql = `INSERT INTO rHotel${hotel_id.toString()}(hotel_id, menu_item, cost) VALUES (${hotel_id.toString()},${menu_item.toString()},${cost.toString()});`;

    let uploadObject = {
        "hotel_id": hotel_id.toString(),
         "menu_item":menu_item.toString(),
         "cost": cost
    }

    let query = "INSERT into rHotel"+hotel_id.toString()+" SET ?"
    console.log(query);
    
    db.query(query,uploadObject,(err,result)=>{
        if(err) reject(err)
        // console.log(file + " was Uploaded file to the db");
        res.send("Success")
    })

})


// http://localhost:3000/putf/?fid=1&name=ashish
app.get('/putf',(req,response)=>{
    let f_id = req.query.fid;
    let h_name = req.query.name;


    let query1 = "INSERT into f"+f_id.toString()+" SET ?"

    
    db.query(query1,{"hotel_name":h_name},(err,result)=>{
        if(err) reject(err)

        let query2 = "select max(hotel_id) as last from f"+f_id;

        db.query(query2,(err,res)=>{
            if(err) throw err

            let hotel_id = res[0].last

            let query3 = "create table f"+f_id.toString()+"h"+hotel_id.toString()+"(menu_item varchar(255),cost int);"
        
            console.log(query3);

            db.query(query3,(err,res5)=>{
                if(err) throw err

                response.send("Succesfully added")
            
            })
        })
        
    })

})

// http://localhost:3000/getf/?fid=1
app.get('/getf',(req,response)=>{

    let hotel_id = req.query.fid;

    let q = "select hotel_id,hotel_name from f"+hotel_id.toString()
    
    db.query(q,(err,result,fields)=>{
        if(err) console.log(err);
    
        let sendRes = result.map((row,index)=>{
            return [result[index].hotel_id,result[index].hotel_name]
        })
    
        response.setHeader('Content-Type', 'application/json')
        response.send(JSON.stringify(sendRes))

    })
})

// http://localhost:3000/putfrhotel/?rid=1&fid=1&name=pizza&cost=21
app.get('/putfrhotel',(req,res)=>{
    let hotel_id = req.query.rid;
    let f_id = req.query.fid;
    let menu_item = req.query.name;
    let cost = req.query.cost;

    console.log(hotel_id);


    let uploadObject = {
         "menu_item":menu_item.toString(),
         "cost": cost
    }

    let query = "INSERT into f"+f_id.toString()+"h"+hotel_id.toString()+" SET ?";
    
    db.query(query,uploadObject,(err,result)=>{
        if(err) console.log(err);

        res.send("Success")
    })

})



app.listen(port,()=>{
    console.log(`Started listening on port ${port}`);
})


