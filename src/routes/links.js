const express = require('express');
const router = express.Router();

//coneccion a la base de datos
const pool = require('../database')

router.get('/add', (req, res) => {
    res.render('links/add');
});
router.post('/add', async(req, res) => {
    const { title, url, description } = req.body;
    const newLink = {
        title,
        url,
        description
    };
    await pool.query('INSERT INTO links SET ?', [newLink]);
    req.flash('success', 'Links added successfully');
    res.redirect('/links');
});

router.get('/', async(req, res) => {
    const links = await pool.query('SELECT * FROM links');
    res.render('links/list', { links });
});

router.get('/delete/:id', async(req, res) => {
    const {id} = req.params;
     await pool.query('DELETE FROM links WHERE id = ?', [id]);
     req.flash('success', 'Links deleted successfully');
     res.redirect('/links');
});

router.get('/edit/:id', async(req, res) => {
    const {id} = req.params;
     const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
     req.flash('success', 'Links updated successfully');
     res.render('links/edit', { link: links[0] });
});

router.post('/edit/:id', async(req, res) => {
    const {id} = req.params;
    const { title, url, description } = req.body;
    const editLink = { title, url, description};
    await pool.query('UPDATE links SET ? WHERE id = ?', [editLink,id]);    
    req.flash('success', 'Links updated successfully');
    res.redirect('/links');

});
module.exports = router;