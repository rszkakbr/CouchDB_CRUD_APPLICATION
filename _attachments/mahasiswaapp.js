 var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc = 
  { _id:'_design/mahasiswaapp'
  , rewrites : 
    [ {from:"/", to:'index.html'}
    , {from:"/api", to:'../../'}
    , {from:"/api/*", to:'../../*'}
    , {from:"/*", to:'*'}
    ]
  }
  ;

ddoc.views = {
       "show_all": {
           "map": "function(doc) {" + 
            
            "emit(null, { '_rev':doc._rev,'_id':doc._id , 'nim':doc.nim," +
                   "'namaLengkap': doc.namaLengkap,'alamat':doc.alamat,'jurusan': doc.jurusan, 'fakultas': doc.fakultas, 'masuk': doc.masuk});}"
       }
};

ddoc.validate_doc_update = function (newDoc, oldDoc, userCtx) {   
  if (newDoc._deleted === true && userCtx.roles.indexOf('_admin') === -1) {
    throw "Only admin can delete documents on this database.";
  } 
}

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;