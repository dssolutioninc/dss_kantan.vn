module.exports = {
  _config: {
    locals: {
      layout: 'layout/layout-japtool'
    }
  },
  list: function (req, res) {
    var extractDataCondition = req.param('condition');
    Grammar.selectByLevel({condition: extractDataCondition}, function (err, grammars) {
      if (err) return res.send(err.status);
      res.render('japtool/grammar/list', {grammars: grammars});
    });
  }
}
