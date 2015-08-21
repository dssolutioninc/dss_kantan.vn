module.exports = {

    read: function (fd, type, res) {
        var skipperAdapter = Database.skipperAdapter();
        skipperAdapter.read(fd, function (error, file) {
            if (error) {
                res.json(error);
            } else {
                res.contentType(type);
                res.send(new Buffer(file));
            }
        });
    },

    upload: function(controlName, req, cb){
        req.file(controlName).upload({
            adapter: require('skipper-gridfs'),
            uri: Database.uri() + '.' + Database.gridfsName
        }, cb);
    },

    rm: function (fd, cb) {
        var skipperAdapter = Database.skipperAdapter();
        skipperAdapter.rm(fd, function (err) {
            if (err) return cb(err);
            return cb();
        });
    },
    
}