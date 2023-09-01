import * as express from 'express'
import * as path from 'path'

const app = express()
app.use(express.static(path.join(__dirname, '../', 'dist')));
app.use(express.static(path.join(__dirname, '../', 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../', 'src/', 'index.html'));
});
app.listen(8080, () => console.log('started'))