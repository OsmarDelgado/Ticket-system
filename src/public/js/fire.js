'use strict'

// Real-time listener
fire.collection('nel_carga_gasolina').onSnapshot( (snapshot) => {
    //console.log(snapshot.docChanges());
    snapshot.docChanges().forEach( (change) => {
        //console.log(change, change.doc.data(), change.doc.id);
        if(change.type === 'added') {
            // Add the document data to the web page
            renderTicket(change.doc.data(), change.doc.id);
        }
        if(change.type === 'removed') {
            // Remove the document data from the web page
        }
    } );
} );