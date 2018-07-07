# Installation Instruction
(this instruction for Amazon Linux)

	node 	v4.9.1
	npm 	v2.15.11
	sails 	v0.11.0
	mongodb	v3.0.15
		

## 1. In stall mongodb. Version 3.0.15 (2016/01 ver)

### create file
### sudo vi /etc/yum.repos.d/mongodb-org-3.0.repo
	[mongodb-org-3.0]
	name=MongoDB 3.0 Repository
	baseurl=https://repo.mongodb.org/yum/amazon/2013.03/mongodb-org/3.0/x86_64/
	gpgcheck=0
	enabled=1


### install from repo
	sudo yum install -y mongodb-org-3.0.15 mongodb-org-server-3.0.15 mongodb-org-shell-3.0.15 mongodb-org-mongos-3.0.15 mongodb-org-tools-3.0.15


### start mongodb
	sudo service mongod start

### Verify that MongoDB has started successfully
	tail -50 /var/log/mongodb/mongod.log

### You can optionally ensure that MongoDB will start following a system reboot by issuing the following command:
	sudo chkconfig mongod on

### Stop MongoDB.
	sudo service mongod stop

### Restart MongoDB
	sudo service mongod restart


## 2. Install Node v4.x
	curl --silent --location https://rpm.nodesource.com/setup_4.x | sudo bash -
	sudo yum -y install nodejs


## 3. install sails 0.11.0

### install dependencies
	yum info gcc-c++
	sudo yum install gcc-c++

#### install sails
	sudo npm install -g sails@0.11.0


## 4. Get source from github

### get source and use tool branch to import data
	git clone https://github.com/duluong/japtool.git

	mv japtool japdata
	cd japdata

	git checkout tool

	npm install

### 4.1 Remove all old data before importing data
	node removeAll.js 
### 4.2 Import data of [test] 
	node importQuestion.js 
### 4.3 Import data of [vocabulary]
	node importVocabulary.js 
### 4.4 Import data of [kanji]
	node importKanji.js 
### 4.5 Import data of [book]
	node importBook.js 
### 4.6 Import data of [survey]
	node importSurvey.js 


## 5. get source and use dev branch to lift server run
	git clone https://github.com/duluong/japtool.git
	cd japtool

	git checkout master

	npm install



## 6. Run app forever
	sudo npm install forever -g

### create file
### vi .foreverignore
	**/.tmp/**
	**/views/**
	**/assets/**



### update file
	/home/ec2-user/japtool/node_modules/sails-mongo/node_modules/mongodb/node_modules/bson/ext/index.js

	Change path to js version in catch block:

	bson = require('../build/Release/bson');
	To:

	bson = require('../browser_build/bson');
	Or copy file in:

	..\node_modules\bson\build\Release\bson

	From:

	..\node_modules\bson\browser_build\bson


## 7. RUN
	sudo forever -w start app.js --prod # -w to watch for file changes!

	sudo forever logs



## fix RUN error
	https://stackoverflow.com/questions/22475849/node-js-error-enospc

	echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

#### For Arch Linux add this line to /etc/sysctl.d/99-sysctl.conf:

	fs.inotify.max_user_watches=524288

### Then execute:
	sudo sysctl --system
