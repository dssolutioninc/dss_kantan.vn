module.exports={
    translate : function(req,res){
        var text = req.param('text');
        var textTranslated = req.__(text);
        res.send(textTranslated);
    }
}