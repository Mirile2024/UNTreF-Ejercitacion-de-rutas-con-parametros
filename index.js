import express from 'express'
import fs from 'fs'

const app = express()
const shows = JSON.parse(fs.readFileSync('./data/shows.json'))

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000')
})
app.get('/', (req, res) => {
    res.json({ mensaje: 'Bienvenido al catálogo de Series con Express!' })
})
app.get('/shows/all', (req, res) => {
    res.json(shows)
})
app.get('/shows/id/:id', (req, res) => {
    const { id } = req.params
    if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' })
    } else {
        const show = shows.find(show => show.id == id)
        if (show) {
            res.json(show)
        } else {
            res.status(404).json({ error: `Serie con ID ${id} no encontrada` })
        }
    }
})
app.get('/shows/titulo/:titulo', (req, res) => {
    const { titulo } = req.params
    const show = shows.filter(show => show.titulo.toLowerCase().includes(titulo.toLowerCase()))
    if (show.length > 0) {
        res.json(show)
    } else {
        res.status(404).json({ error: `Serie con título ${titulo} no encontrada` })
    }
})
app.get('/shows/existe/:titulo', (req, res) => {
    const { titulo } = req.params
    const show = shows.find(show => show.titulo.toLowerCase() == titulo.toLowerCase())
    if (show) {
        res.json({ titulo, existe: true })
    }
    else {
        res.json({ titulo, existe: false })
    }
})
  app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' })
  })
  app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ error: 'Error interno del servidor' })
  })
