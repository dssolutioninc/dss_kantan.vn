/**
 * Common/MediaController
 *
 * @description :: Server-side logic for managing common/medias
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	getImg: function (req, res) {
            var fd = req.param('fd');
            //console.log('fd: ' + fd);
            if (fd == null) {
                res.send('null');
            } else {
                var skipperAdapter = Database.skipperAdapter('files');
                skipperAdapter.read(fd, function (error, file) {
                    //console.log('file: ' + JSON.stringify(file));
                    if (error) {
                        res.json(error);
                    } else {
                        res.contentType('image/jpg');
                        res.send(new Buffer(file));
                    }
                });
            }
    },

    getAudio: function (req, res) {
        var fd = req.param('fd');
        if (fd == null) {
            res.send('');
        } else {
            var skipperAdapter = Database.skipperAdapter('files');
            skipperAdapter.read(fd, function (error, file) {
                if (error) {
                    res.json(error);
                } else {
                    res.contentType('audio/mpeg');
                    res.send(new Buffer(file));
                }
            });
        }
    },

    getVideo: function (req, res) {
        var fd = req.param('fd');
        if (fd == null) {
            res.send('');
        } else {
            var skipperAdapter = Database.skipperAdapter('files');

            skipperAdapter.read(fd, function (error, file) {
                if (error) {
                    res.json(error);
                } else {
                    res.contentType('video/mp4');
                    res.send(new Buffer(file));
                }
            });
        }
    }
};

