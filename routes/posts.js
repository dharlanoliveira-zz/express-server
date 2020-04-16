let express = require('express');
let cors = require('cors')
let DetectLanguage = require('detectlanguage');
let router = express.Router();

let posts = []

var options = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

router.options('/', cors(options))
router.options('/language', cors(options))
router.options('/clear', cors(options))

/* GET users listing. */
router.get('/', cors(options), function (req, res, _) {
    res.send(posts)
});

router.post('/language', cors(options), function (req, res, _) {
    let detectLanguage = new DetectLanguage({
        key: 'c94805c96d7151f56f3e36f2882e0232',
        ssl: false
    });

    let post = req.body;
    let description = post.description;

    detectLanguage.detect(description, function(error, result) {
        if(error != null){
            res.status(412).send(`Error identifying the language of the description of the post`)
        } else if(result.length > 0){
            res.status(200).send({language: result[0].language})
        } else {
            res.status(200).send({language: "n/a"})
        }
    });
});

router.post('/', cors(options), function (req, res, _) {
    let post = req.body;
    let descriptions = posts.filter((o) => post.description === o.description)
    if (descriptions.length > 0) {
        res.status(412).send(`A post with description "${post.description}" already exists`)
        return
    }

    if(post.language == null){
        res.status(412).send(`The language of the is required`)
        return
    }

    posts = posts.concat([req.body]);
    res.    sendStatus(200);
});

router.post('/clear', cors(options), function (req, res, _) {
    posts = [];
    res.sendStatus(200);
});



module.exports = router;
