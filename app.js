const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { name } = require('ejs');
const app = express();

mongoose.connect("mongodb+srv://username:AfNhITyMQw0A9MRD@cluster0.06dw5yz.mongodb.net/todolistDB")

const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
    name: "welcome to this list"
});
const item2 = new Item ({
    name: "This is testing"
});
const item3 = new Item ({
    name: "Its a new statement"
});

const def_items = [item1,item2,item3];

const listSchema = {
    name : String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function (req, res) {
    Item.find({})

    .then(function(founditems){
    if (founditems == 0){
        Item.insertMany(def_items)
        .then (function (err) {
           if (err) {
               console.log(err);
           } else {
               console.log("Succesfull");
           }
        });
    res.redirect("/");
    }else{
        res.render("list",{listTitle: "Today", newListItem: founditems});
    }
    
    })
    
    .catch(function(err){
    
    console.log(err)
    
    });
    
});

//adding a new itms

app.post("/", function (req, res) {
    let itemname = req.body.newItem;
    const listName = req.body.list;
    const item = new Item({
        name: itemname
    });

    if ( listName == "Today"){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name: listName, function (err, foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+ listName);
        }});
    }
   
});


//deleting checked items


app.post("/delete", function (req, res) {
    const checked = req.body.checkbox;
    Item.findByIdAndRemove(checked) 
        .then(function (founditems) {
            Item.deleteOne({_id: checked})
        });
 
        res.redirect("/");
});

app.get("/:dynamiclist", function (req, res) {
    const dynamiclist = req.params.dynamiclist;

    List.find({})
    .then(function (foundItem) {
        if (foundItem === 0) {
            const list = new List ({
                name: dynamiclist,
                items: def_items
            });
            list.save();
            res.redirect("/"+dynamiclist);
        } else {
            res.render("list", {listTitle: foundItem.name, newListItem: foundItem.items});
        }
    });
});

app.listen(3000, function () {
    console.log("Server is started at port 3000");
});



