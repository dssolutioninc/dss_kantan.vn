module.exports = {
    host: sails.config.connections.someMongodbServer.host,
    port: sails.config.connections.someMongodbServer.port,
    name: sails.config.connections.someMongodbServer.database,
    gridfsName: 'media',

    uri: function () {
    	return 'mongodb://' + 
    			(this).host + ':' +
    			(this).port + '/' +
    			(this).name;
    },

    skipperAdapter: function () {
        return require('skipper-gridfs')({
            uri: (this).uri() + '.' + (this).gridfsName
        });
    },    
}