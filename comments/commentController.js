var CurrentComment = require('./commentModel.js');
exports.createComment = async function (req, res, next) {
    try {
        let p1 = req.body;
        var newItem = await CurrentComment.create(p1);
        res.status(201).json({
            status: "success",
            data: newItem
        })
    }
    catch (err) {
        res.status(400).json({
            status: "fail",
            message:"error" + err
        })
    }
};

exports.getAllComments = async function (req, res, next) {
    try{
        const comments = await CurrentComment.find()
        res.status(200).json({
            status: "success",
            data: comments
        })
    }
    catch(err){
        res.status(400).json({
            status: "fail",
            message:"error" + err
        })
    }
}
