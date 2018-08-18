const mongoose = require('mongoose');
const dbConnectionSys =  process.env.REACT_APP_SYS_DB_URL;
const Repo = require('../models/Repo');
const RepoUser = require('../models/RepoUser');

module.exports = {
    retrieveUserList: function (userEmail, callback) {
    },   
    connectDatabaseByUserEmail: function (userEmail, callback) {
        //dont hardcode !!!
        var repoConnectionUrl = 'mongodb://adminhnn:admin123@34.227.75.167/hlhnn'; 
        mongoose
        .connect(repoConnectionUrl)
        .then(() => {
            console.log('MongoDB Connected repoConnectionUrl ', repoConnectionUrl);
            callback();
        })
        .catch(err => {
            console.log(err);
            callback(err);                    
            return;
        })
    },   
    connectDatabaseByUserEmail_old: function (userEmail, callback) {
        //find repo based on email
        if(dbConnectionSys.length==0){
            callback('No dbConnectionSys');
            return;
        }
        mongoose
            .connect(dbConnectionSys)
            .then(() => {
                console.log('ConnectDatabaseByUserEmail Connected ', dbConnectionSys);
                console.log('Start find repoUser ', userEmail);
                RepoUser.findOne({ "userEmail": userEmail }).then(repoUser => {
                    // Check for user
                    if (!repoUser) {
                        callback('No RepoUser', userEmail);
                        return;
                    }
                    console.log('found repoUser.repoid :', repoUser.repoid);
                    Repo.findOne({ "_id": repoUser.repoid }).then(repo => {
                        mongoose
                        .connect(repo.repoConnectionUrl)
                        .then(() => {
                            console.log('MongoDB Connected repoConnectionUrl ', repo.repoConnectionUrl);
                            callback();
                        })
                        .catch(err => {
                            console.log(err);
                            callback(err);                    
                            return;
                        })
                    });
                })
                .catch(err => {
                    console.log(userEmail, err);
                    callback(err);                    
                });                
            })
            .catch(err => {
                console.log('Fail to connect to sys: ', err);                
            });
    },        
    connectDatabaseByAdminEmail: function (adminEmail, callback) {
        //find repo based on email
        mongoose
            .connect(dbConnectionSys)
            .then(() => console.log('MongoDB Connected ', dbConnectionSys))
            .catch(err => console.log(err));
        console.log('connectDatabaseByAdminEmail adminEmail : ', adminEmail);
        Repo.findOne({ "adminEmail": adminEmail }).then(repo => {
            // Check for user
            if (!repo) {
                return;
            }
            console.log('found repoConnectionUrl', repo.repoConnectionUrl);
            mongoose
                .connect(repo.repoConnectionUrl)
                .then(() => {
                    console.log('MongoDB Connected repoConnectionUrl ', repo.repoConnectionUrl);
                    callback();
                })
                .catch(err => console.log(err));
        });
    },
    connectSysDatabase: function () {
        console.log(dbConnectionSys);
        //connect to found repo
        mongoose
            .connect(dbConnectionSys)
            .then(() => console.log('MongoDB Connected ', dbConnectionSys))
            .catch(err => console.log(err));
    },
    connectDatabaseByDbConnection: function (dbConnection) {
        //connect to found repo
        mongoose
            .connect(dbConnection)
            .then(() => console.log('MongoDB Connected ', dbConnection))
            .catch(err => console.log(err));
    },

};