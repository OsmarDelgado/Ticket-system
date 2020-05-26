'use strict'

const express = require( 'express' );
const router = express.Router();

const db = require( '../db' );
const { isNotLoggedIn, isLoggedIn } = require( '../lib/auth' );


router.get( '/', isNotLoggedIn, async (req, res) => {
    const tickets = await db.query('SELECT * FROM nel_carga_gasolina WHERE id_user_login = ?', [req.user.login]);
    //console.log(tickets);
    res.render('tickets/list', { tickets });
} );

router.get( '/add', isNotLoggedIn, (req, res) => {
    res.render('tickets/add');
} );

router.post( '/add', isNotLoggedIn, async (req, res) => {
    //console.log( req.body );
    const { fecha_creacion, monto_carga, litros_cargados, precio_litro, observaciones } = req.body;
    const newTicket = {
        id_user_login : req.user.login,
        fecha_creacion,
        monto_carga,
        litros_cargados,
        precio_litro,
        observaciones,
    };
    //console.log(newTicket);
    await db.query('INSERT INTO nel_carga_gasolina set ?', [newTicket]);
    req.flash('success', 'Ticket guardado correctamente.');
    res.redirect('/tickets');
} );

router.get( '/delete/:id', isNotLoggedIn, async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE FROM nel_carga_gasolina WHERE id = ?', [id]);
    req.flash('success', 'Ticket eliminado correctamente.');
    res.redirect('/tickets');
} );

router.get( '/edit/:id', isNotLoggedIn, async (req, res) => {
    const { id } = req.params;
    const tickets = await db.query('SELECT * FROM nel_carga_gasolina WHERE id = ?', [id]);
    res.render('tickets/edit', { ticket : tickets[0] });
} );

router.post( '/edit/:id', isNotLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { fecha_creacion, monto_carga, litros_cargados, precio_litro, observaciones } = req.body;
    const newTicket = {
        fecha_creacion,
        monto_carga,
        litros_cargados,
        precio_litro,
        observaciones,
    };
    await db.query('UPDATE nel_carga_gasolina SET ? WHERE id = ?', [newTicket, id]);
    req.flash('success', 'Ticket actualizado correctamente.');
    res.redirect('/tickets');
    //res.send('Updated');
} );

module.exports = router;